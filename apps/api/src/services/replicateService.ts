import Replicate from 'replicate';
import { closest } from 'color-2-name';
import config from '../config/config';

const replicate = new Replicate({
  auth: config.replicateApiKey,
});

const MODEL_ID = 'black-forest-labs/flux-schnell';

export async function generateIcons(
  subjects: string[],
  style: string,
  colors: string[],
): Promise<string[]> {
  const styleInstructions = buildStyleInstruction(style);
  const colorPolicy = buildColorPolicy(colors);

  const prompts = subjects.map((subject) =>
    buildIconPrompt(subject, styleInstructions, colorPolicy),
  );

  // Create an array of promises, each representing a call to the Replicate API
  const predictions = prompts.map((prompt) => {
    return replicate.run(MODEL_ID, {
      input: {
        prompt: prompt,
        num_outputs: 1,
        output_format: 'png',
        num_inference_steps: 4,
      },
    });
  });

  // Wait for all the parallel predictions to complete
  const results = await Promise.allSettled(predictions);

  // Extract successful URLs while logging rejections
  const imageUrls: string[] = results
    .map((result, index) => {
      if (result.status === 'fulfilled') {
        return (result.value as any)[0]?.url() ?? '';
      } else {
        console.error(
          `Prediction failed for prompt "${prompts[index]}": ${result.reason}`,
        );
        return null;
      }
    })
    .filter((url): url is string => url !== null && url !== '');

  if (imageUrls.length === 0) {
    throw new Error('No icons were successfully generated.');
  } else if (imageUrls.length < prompts.length) {
    console.warn(
      `Some icons were not generated successfully. Successful count: ${imageUrls.length}`,
    );
  }
  return imageUrls;
}

function buildIconPrompt(
  subject: string,
  styleInstruction: string,
  colorPolicy: string,
): string {
  return [
    `A centered image of ${subject} ${styleInstruction}`,
    colorPolicy,
    'crisp edges, isolated on plain white background',
    'no borders beyond icon shape, no watermark, no text',
  ].join(', ');
}

function buildStyleInstruction(style: string): string {
  const normalizedStyle = style.trim().toLowerCase();
  return normalizedStyle === 'auto' ? '' : `in a ${normalizedStyle} style`;
}

/**
 * Builds a strict color policy description with color names derived from the hex values.
 */
function buildColorPolicy(palette: string[]): string {
  // Convert hex color values to names
  const colorNames = palette.map((hex) => {
    const colorName = closest(hex).name;
    return colorName.toLowerCase();
  });

  const paletteDescription = colorNames.join(', ');

  return [
    `strict color palette: ${paletteDescription}`,
    'use ONLY these exact colors for all fills and strokes',
    'do NOT introduce any additional colors or tints',
    'no blending, no color grading, no photo textures',
    'background must be pure white',
  ].join(', ');
}
