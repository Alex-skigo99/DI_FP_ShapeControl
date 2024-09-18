import express from "express";
import {userController} from "../controllers/user_controller";
import { verifyToken, CustomRequest } from "../middlewares/verifyToken";

export const userRouter = express.Router();

// register route = register a new user
userRouter.post("/login", userController.loginUser);
userRouter.get("/logout", userController.logOutUser);
userRouter.get("/auth", verifyToken, (req: CustomRequest, res: express.Response) => {
  console.log('userRouter-req.username =>', req.username);
  res.status(200);
});
userRouter.post("/", userController.registerUser);
userRouter.patch("/", verifyToken, userController.updateUser);

// userRouter.get("/stravaAuth", userController.stravaAuth);
// userRouter.get("/all", verifyToken, userController.getAllUsers);
// userRouter.get("/:id", verifyToken, userController.getUserById);
