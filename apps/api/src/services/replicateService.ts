import Replicate from 'replicate';
import { closest } from 'color-2-name';
import config from '../config/config';

const replicate = new Replicate({
  auth: config.replicateApiKey,
});

const STYLE_PROMPTS: Record<string, string> = {
  auto: 'A simple 3D icon with a smooth, matte, clay-like finish. Features soft, diffuse lighting and subtle highlights to create depth. Toy-like and clean, with a modern aesthetic and gentle ambient occlusion. No hard edges or photo textures.',
  sticker:
    'A die-cut sticker illustration on a light grey neutral background. Features a bold, cartoonish design with thick colored outlines and vibrant, saturated fills. The sticker is encased by a thick, uniform white border that clearly separates it from the background. A soft but distinct drop shadow beneath the sticker gives it a 3D "peeling off" look. Glossy highlights suggest a vinyl finish. The background must not be pure white, so the white sticker border is always visible.',
  pastels:
    'A flat illustration using a soft, muted pastel color palette (e.g., lavender, baby blue, soft pink). Features clean, colored linework that is slightly darker than the fills. The design is simple and airy, with a gentle, low-contrast aesthetic. Minimal to no shading, focusing on flat color shapes.',
  business:
    'A flat design business icon in minimalist style. A simple white silhouette placed inside a solid circular background. The silhouette is bold, geometric, and highly legible, with no outlines, no gradients, no shadows, and no extra details. Only two colors: white for the icon, and a single solid color for the circle background.',
  cartoon:
    "A cute and charming cartoon illustration in a children's book style. Features a soft, textured feel, resembling watercolor or digital pastels on paper. Uses warm, friendly colors and gentle gradients. The character has a simple, happy facial expression with blushing cheeks. Soft, colored outlines instead of harsh black lines.",
  '3d model':
    'A simple 3D icon with a smooth, matte, clay-like finish. Features soft, diffuse lighting and subtle highlights to create depth. Toy-like and clean, with a modern aesthetic and gentle ambient occlusion. No hard edges or photo textures.',
  gradient:
    'A modern flat icon silhouette with a vibrant, smooth gradient fill inside the shape. The gradient transitions seamlessly between multiple given colors, from warm to cool tones. The icon is a clean, minimalist silhouette with no outlines or internal details. The background is pure white (#FFFFFF), flat and uniform, with no gradients, textures, or extra elements. The gradient must only appear inside the icon, never in the background.',
};

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
    `A centered image of ${subject} with the following styles.`,
    styleInstruction,
    colorPolicy,
  ].join(', ');
}

function buildStyleInstruction(style: string): string {
  const key = (style ?? '').trim().toLowerCase();
  const instruction = STYLE_PROMPTS[key];
  if (instruction !== undefined) return instruction;
  // Fallback for unknown styles
  return key === 'auto' || key === '' ? '' : `in a ${key} style`;
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
