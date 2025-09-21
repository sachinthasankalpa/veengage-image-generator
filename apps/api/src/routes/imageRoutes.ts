import { Router } from 'express';
import ImageController from "../controllers/imageController";
import {validationMiddleware} from "../middleware/validation";
import {createImagesValidationRules} from "../validation/imageValidation";

const router = Router();

const userController = new ImageController();

router.post('/generate', createImagesValidationRules, validationMiddleware, userController.createImages);

export default router;