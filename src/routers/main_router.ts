import path from "path";
import express from 'express';
import { hello } from '../controllers/main_controller';

export const router = express.Router();

// router.get('/', (req, res) => {res.render('index')});
router.get('/', (req, res) => {
    console.log(path.resolve(__dirname, "../../client/dist", "index.html"));
    res.render(path.resolve(__dirname, "../../client/dist", "index.html"));
  });

router.get('/api/hello/:id', hello);
// router.post('/api/login', login);
// router.post('/api/signup', signup);
// router.get('/api/programs', getPrograms);
// router.post('/api/programs', createProgram);

// All other GET requests not handled before will return our React app
router.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./client/dist", "index.html"));
  });
  