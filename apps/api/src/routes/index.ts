import { Router } from 'express';
import imageRoutes from '../routes/imageRoutes';

const router = Router();

router.use('/images', imageRoutes);

export default router;
