import express from "express";
import {userController} from "../controllers/user_controller";
import { verifyToken, CustomRequest } from "../middlewares/verifyToken";

export const userRouter = express.Router();

// register route = register a new user
userRouter.post("/register", userController.registerUser);
userRouter.post("/login", userController.loginUser);

userRouter.get("/all", verifyToken, userController.getAllUsers);
userRouter.get("/:id", verifyToken, userController.getUserById);

userRouter.get("/auth", verifyToken, (req: CustomRequest, res: express.Response) => {
  console.log('userRouter-req.username =>', req.username);
  res.sendStatus(200);
});
