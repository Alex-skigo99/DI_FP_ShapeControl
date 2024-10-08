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
exports.userRouter.post("/login", user_controller_1.userController.loginUser);
exports.userRouter.get("/logout", user_controller_1.userController.logOutUser);
exports.userRouter.get("/auth", verifyToken_1.verifyToken, (req, res) => {
    console.log('userRouter-req.username =>', req.username);
    res.status(200);
});
exports.userRouter.post("/", user_controller_1.userController.registerUser);
exports.userRouter.patch("/", verifyToken_1.verifyToken, user_controller_1.userController.updateUser);
// userRouter.get("/stravaAuth", userController.stravaAuth);
// userRouter.get("/all", verifyToken, userController.getAllUsers);
// userRouter.get("/:id", verifyToken, userController.getUserById);
