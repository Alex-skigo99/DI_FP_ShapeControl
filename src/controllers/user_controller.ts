import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { userModel, User } from "../models/user_model";
import { CustomRequest } from "../middlewares/verifyToken";

dotenv.config();

export const userController = {
  registerUser: async (req: Request, res: Response) => {
    try {
      const userInfo = await userModel.createUser(req.body);
      res.status(201).json({
        message: "User registered successfully",
        user: userInfo,
      });
    } catch (error: any) {
      console.log(error);
      if (error.code == 23505) {
        return res.status(200).json({ message: "Username already exist" });
      }
      res.status(500).json({ message: "internal server error" });
    }
  },

  updateUser: async (req: Request, res: Response) => {
    try {
      await userModel.updateUser(req.body);
      res.status(201).json({
        message: "User updated successfully",
      });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ message: "internal server error" });
    }
  },

  loginUser: async (req: Request, res: Response) => {
    const name = req.body.username;
    const password = req.body.password;

    try {
      const user = await userModel.getUserByName(name);

      if (!user) {
        return res.status(404).json({ message: "User not found, ...." });
      }

      const passwordMatch = await bcrypt.compare(password + "", user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Authentication failed..." });
      }
      delete user.password; // remove password from user object

      /** create the token */
      const  ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string | undefined;
      const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string | undefined;
      if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
        throw new Error("Environment variables ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be set");
      };

      const accesstoken = jwt.sign(
        { userid: user.id, username: user.username },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      const refreshtoken = jwt.sign(
        { userid: user.id, username: user.username },
        REFRESH_TOKEN_SECRET,
        { expiresIn: "3d" }
      );

      // set token in httpOnly
      res.cookie("token", accesstoken, {
        httpOnly: true,
        // secure:
        maxAge: 60 * 1000 * 60,
      });

      res.cookie("refresh", refreshtoken, {
        httpOnly: true,
        // secure:
        maxAge: 60 * 60 * 1000 * 24 * 3,
      });
      console.log('login_controller - user:', user);
      await userModel.updateRefreshToken(refreshtoken, user.id);
      res.json({
        message: "Login succesfully",
        user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "internal server error" });
    }
  },
  
  logOutUser: (req: Request, res: Response) => {
      res.clearCookie("token");
      res.clearCookie("refresh");
      res.status(200).json({ message: 'Token and refreshToken cookies have been deleted' });
  },

  stravaConnect: async (req: Request, res: Response) => {
    const { code, state, scope } = req.query;
    console.log('stravaConnect - code:', code, 'state:', state, 'scope', scope); //-------------------
    let url = 'https://www.strava.com/oauth/token';
    url += '?client_id=' + process.env.CLIENT_ID;
    url += '&client_secret=' + process.env.CLIENT_SECRET;
    url += '&code=' + code;
    url += '&grant_type=authorization_code';
    console.log('stravaConnect - url:', url); //-------------------
    try {
      const response = await fetch(url, { method: 'POST' });
      const data = await response.json();
      console.log('stravaConnect - data:', data); //-------------------
      await userModel.createStravaConnect(Number(state), scope as string, data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "internal server error" });
    }
  },

  // getAllUsers: async (req: CustomRequest, res: Response) => {
  //   console.log('getAllUser: ', req.userid, req.username);
  //   try {
  //     const users = await userModel.getAllUsers();
  //     res.json(users);
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({ error: "internal server error" });
  //   }
  // },

  // getUserById: async (req: Request, res: Response) => {
  //   const id: number = Number(req.params.id);
  //   try {
  //     const user = await userModel.getUserById(id);
  //     res.json(user);
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({ error: "internal server error" });
  //   }
  // },
};
