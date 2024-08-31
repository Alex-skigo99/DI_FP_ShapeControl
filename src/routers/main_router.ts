import express from 'express';
import { hello, mainController } from '../controllers/main_controller';

export const mainRouter = express.Router();

mainRouter.get('/hello/:id', hello);
mainRouter.get('/programs', mainController.getPrograms);
mainRouter.post('/programs', mainController.postProgram);
// router.post('/api/programs', createProgram);
