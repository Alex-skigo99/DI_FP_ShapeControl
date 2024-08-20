import { hello } from '../controllers/main_controller';

import express from 'express';

export const router = express.Router();

// router.get('/', (req, res) => {res.render('index')});

router.get('/api/hello', hello);
// router.post('/api/login', login);
// router.post('/api/signup', signup);
// router.get('/api/programs', getPrograms);
// router.post('/api/programs', createProgram);
