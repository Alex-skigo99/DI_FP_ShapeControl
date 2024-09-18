"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainRouter = void 0;
const express_1 = __importDefault(require("express"));
const main_controller_1 = require("../controllers/main_controller");
const verifyToken_1 = require("../middlewares/verifyToken");
exports.mainRouter = express_1.default.Router();
exports.mainRouter.get('/programs', main_controller_1.mainController.getPrograms);
exports.mainRouter.post('/programs', main_controller_1.mainController.postProgram);
exports.mainRouter.patch('/programs', main_controller_1.mainController.patchProgram);
exports.mainRouter.get('/gpt', verifyToken_1.verifyToken, main_controller_1.mainController.gpt);
// router.post('/api/programs', createProgram);
