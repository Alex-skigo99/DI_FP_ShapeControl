import express from 'express';
import cors from 'cors';
import { router } from './routers/main_router'

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.listen(process.env.PORT || 3001, () => {
    console.log(`run on ${process.env.PORT || 3001}`);
});

app.use('/', router);
