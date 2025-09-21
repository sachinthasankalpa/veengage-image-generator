import {Request, Response, NextFunction} from "express";
import {validationResult} from "express-validator";

export const validationMiddleware = (req: Request, _resp: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    throw new Error(errors.array().map(err => err.msg).join(', ') || 'Validation failed');
}