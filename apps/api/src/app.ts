import express, {json} from 'express';
import 'express-async-errors';
import cors from 'cors';
import apiRoutes from './routes';
import {errorHandler} from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(json());

app.use('/api/v1', apiRoutes);
app.all('*', () => {
    throw new Error('Invalid API route.');
});
app.use(errorHandler);

export default app;