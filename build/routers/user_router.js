"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user_controller");
const verifyToken_1 = require("../middlewares/verifyToken");
exports.userRouter = express_1.default.Router();
// register route = register a new user
exports.userRouter.post("/register", user_controller_1.userController.registerUser);
exports.userRouter.post("/login", user_controller_1.userController.loginUser);
exports.userRouter.get("/all", verifyToken_1.verifyToken, user_controller_1.userController.getAllUsers);
exports.userRouter.get("/:id", verifyToken_1.verifyToken, user_controller_1.userController.getUserById);
exports.userRouter.get("/auth", verifyToken_1.verifyToken, (req, res) => {
    console.log('userRouter-req.username =>', req.username);
    res.sendStatus(200);
});
