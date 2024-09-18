"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stravaRouter = void 0;
const express_1 = __importDefault(require("express"));
const verifyToken_1 = require("../middlewares/verifyToken");
const strava_controller_1 = require("../controllers/strava_controller");
exports.stravaRouter = express_1.default.Router();
// register route = register a new user
exports.stravaRouter.get("/connect", verifyToken_1.verifyToken, strava_controller_1.stravaController.stravaConnect);
exports.stravaRouter.get("/", verifyToken_1.verifyToken, strava_controller_1.stravaController.stravaGetData);
