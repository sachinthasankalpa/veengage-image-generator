import api from '../utils/api.ts';

/**
 * Calls the API to generate icons based on the given parameters
 */
export const generateIcons = async (prompt: string, style: string, colors: string[]): Promise<string[]> => {
  try {
        const response = await api.post('/images/generate', { prompt, style, colors });
        return response.data.imageUrls;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.errors[0]?.message || 'Failed to generate icons. Please try again.';
        throw new Error(errorMessage);
    }
};