import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

export interface CustomRequest extends Request {
  userid?: number;
  username?: string;
}
const  ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string | undefined;
if (!ACCESS_TOKEN_SECRET) {
  throw new Error("Environment variables ACCESS_TOKEN_SECRET must be set");
};

export const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  // const accesstoken = req.cookies.token || req.headers["x-access-token"];
  const accesstoken = req.cookies.token;

  if (!accesstoken) return res.status(401).json({ message: "unauthorized" });

  jwt.verify(accesstoken, ACCESS_TOKEN_SECRET, (err: any, decode: any) => {
    if (err) return res.status(403).json({ message: "forbidden", error: err.message });

    const { userid, username } = decode;
    req.userid = Number(userid);
    req.username = username;

    console.log('verify-rec:', req.username, 'userid:', req.userid, 'accesstoken: ', accesstoken);
    next();
  });
};
