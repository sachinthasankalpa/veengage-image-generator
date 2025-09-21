import { body } from 'express-validator';

export const createImagesValidationRules = [
    body('prompt')
        .exists().withMessage('Prompt is required')
        .isString().withMessage('Prompt must be a string')
        .notEmpty().withMessage('Prompt must not be empty')
        .isLength({ min: 1, max: 100 }).withMessage('Prompt must be between 1 and 200 characters'),
    body('style')
        .exists().withMessage('Style is required')
        .isString().withMessage('Style must be a string')
        .notEmpty().withMessage('Style must not be empty'),
    body('colors')
        .optional()
        .isArray().withMessage('Colors must be an array, if provided')
];