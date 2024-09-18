import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { stravaController } from "../controllers/strava_controller";

export const stravaRouter = express.Router();

// register route = register a new user
stravaRouter.get("/connect", verifyToken, stravaController.stravaConnect);
stravaRouter.get("/", verifyToken, stravaController.stravaGetData);
