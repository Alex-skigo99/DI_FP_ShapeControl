import express from 'express';
import { mainController } from '../controllers/main_controller';
import { verifyToken } from '../middlewares/verifyToken';

export const mainRouter = express.Router();

mainRouter.get('/programs', mainController.getPrograms);
mainRouter.post('/programs', mainController.postProgram);
mainRouter.patch('/programs', mainController.patchProgram);
mainRouter.get('/gpt', verifyToken, mainController.gpt);
// router.post('/api/programs', createProgram);
