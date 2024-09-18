import express from 'express';
import cors from 'cors';
import path from "path";
import { mainRouter } from './routers/main_router';
import { userRouter } from './routers/user_router';
import cookieParser from 'cookie-parser';
import { stravaRouter } from './routers/strava_router';

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser()); // Enable cookie handling
app.use(express.static(path.resolve(__dirname, "../client/dist")));
console.log(path.resolve(__dirname, "../client/dist"));

app.use(cors());

app.listen(process.env.PORT || 3001, () => {
    console.log(`run on ${process.env.PORT || 3001}`);
});

app.get('/', (req, res) => {
  res.render(path.resolve(__dirname, "../client/dist", "index.html"));
});

app.use('/api/', mainRouter);
app.use('/user/', userRouter);
app.use('/strava/', stravaRouter);

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
});
