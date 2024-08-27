import express from 'express';
import { hello } from '../controllers/main_controller';

export const mainRouter = express.Router();


mainRouter.get('hello/:id', hello);
// router.post('/api/login', login);
// router.post('/api/signup', signup);
// router.get('/api/programs', getPrograms);
// router.post('/api/programs', createProgram);
