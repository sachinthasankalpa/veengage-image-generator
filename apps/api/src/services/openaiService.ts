import OpenAI from 'openai';
import config from "../config/config";

const openai = new OpenAI({
    apiKey: config.openaiApiKey,
});

/**
 * Retrieve subjects based on the given theme. OpenAI is used ONLY for this purpose.
 */
export async function getSubjects(theme: string): Promise<string[]> {
    const instructions = [
        'You are an expert icon-set planner.',
        'Given a theme, produce a JSON object with an array "subjects" of 8 distinct, specific, short subjects (1-3 words each).',
        'Subjects must be visually distinct but cohesive within the theme.',
        `For example, if the theme is 'Finance', you should return a JSON object like { "subjects": ["money bag", "credit card", "piggy bank", "wallet"] }`,
        'Return ONLY the JSON object. No explanations.',
    ].join(' ');

    const userPrompt = `Theme: "${theme}"`;
    let subjects: string[] = [];

    try {
        const response = await openai.responses.create({
            model: 'gpt-4.1-mini',
            instructions: instructions,
            input: userPrompt,
            temperature: 0.3,
            max_output_tokens: 300,
        });

        let responseContent = response.output_text;
        if (responseContent) {
            responseContent = responseContent.trim(); // Remove whitespace
            responseContent = responseContent.replace(/```json\n?|```/g, '').trim(); // Remove backticks, "```json"
            const parsedJson = JSON.parse(responseContent);

            const candidate = parsedJson?.subjects;
            if (isNonEmptyStringArray(candidate)) {
                subjects = candidate.map((s) => s.trim());
            } else {
                // Fallback: find the first array of non-empty strings
                const arrayKey = Object.keys(parsedJson).find((key) =>
                    isNonEmptyStringArray(parsedJson[key]),
                );
                if (arrayKey) {
                    subjects = (parsedJson[arrayKey] as string[]).map((s) => s.trim());
                }
            }
        }

        if (subjects.length === 0) {
            subjects = generateFallbackSubjects(theme);
        }

    } catch (error) {
        console.error("Error generating subjects with OpenAI, using fallback:", error);
        subjects = generateFallbackSubjects(theme);
    }

    return subjects;
}

function isNonEmptyStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every((s) => typeof s === 'string' && s.trim().length > 0);
}

function generateFallbackSubjects(theme: string, count: number = 8): string[] {
    return Array(count).fill(theme).map((t, i) => `${t} item ${i + 1}`);
}