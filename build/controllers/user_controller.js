"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_1 = require("../models/user_model");
dotenv_1.default.config();
exports.userController = {
    registerUser: async (req, res) => {
        try {
            const userInfo = await user_model_1.userModel.createUser(req.body);
            res.status(201).json({
                message: "User registered successfully",
                user: userInfo,
            });
        }
        catch (error) {
            console.log(error);
            if (error.code == 23505) {
                return res.status(200).json({ message: "Username already exist" });
            }
            res.status(500).json({ message: "internal server error" });
        }
    },
    updateUser: async (req, res) => {
        try {
            await user_model_1.userModel.updateUser(req.body);
            res.status(201).json({
                message: "User updated successfully",
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: "internal server error" });
        }
    },
    loginUser: async (req, res) => {
        const name = req.body.username;
        const password = req.body.password;
        try {
            const user = await user_model_1.userModel.getUserByName(name);
            if (!user) {
                return res.status(404).json({ message: "User not found, ...." });
            }
            const passwordMatch = await bcrypt_1.default.compare(password + "", user.password);
            if (!passwordMatch) {
                return res.status(401).json({ message: "Authentication failed..." });
            }
            delete user.password; // remove password from user object
            /** create the token */
            const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
            const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
            if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
                throw new Error("Environment variables ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be set");
            }
            ;
            const accesstoken = jsonwebtoken_1.default.sign({ userid: user.id, username: user.username }, ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
            const refreshtoken = jsonwebtoken_1.default.sign({ userid: user.id, username: user.username }, REFRESH_TOKEN_SECRET, { expiresIn: "3d" });
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
            await user_model_1.userModel.updateRefreshToken(refreshtoken, user.id);
            res.json({
                message: "Login succesfully",
                user,
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: "internal server error" });
        }
    },
    logOutUser: (req, res) => {
        res.clearCookie("token");
        res.clearCookie("refresh");
        res.status(200).json({ message: 'Token and refreshToken cookies have been deleted' });
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
