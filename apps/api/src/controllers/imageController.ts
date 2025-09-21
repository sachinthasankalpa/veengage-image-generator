import { Request, Response } from 'express';
import { getSubjects } from '../services/openaiService';
import { generateIcons } from '../services/replicateService';

export default class ImageController {
  public async createImages(req: Request, res: Response) {
    // Errors are handled in the errorHandler middleware and validations are done
    // in validation middleware
    const { prompt, style, colors } = req.body;

    // 1. Use OpenAI to retrieve subjects for the theme
    const subjects = await getSubjects(prompt);
    // 2. Use Replicate to generate the icons, providing subjects, style, and colors
    const imageUrls = await generateIcons(subjects, style, colors);

    return res.status(200).json({ imageUrls });
  }
}
