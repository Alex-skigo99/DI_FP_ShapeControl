"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
if (!ACCESS_TOKEN_SECRET) {
    throw new Error("Environment variables ACCESS_TOKEN_SECRET must be set");
}
;
const verifyToken = (req, res, next) => {
    // const accesstoken = req.cookies.token || req.headers["x-access-token"];
    const accesstoken = req.cookies.token;
    if (!accesstoken)
        return res.status(401).json({ message: "unauthorized" });
    jsonwebtoken_1.default.verify(accesstoken, ACCESS_TOKEN_SECRET, (err, decode) => {
        if (err)
            return res.status(403).json({ message: "forbidden", error: err.message });
        const { userid, username } = decode;
        req.userid = Number(userid);
        req.username = username;
        console.log('verify-rec:', req.username, 'userid:', req.userid, 'accesstoken: ', accesstoken);
        next();
    });
};
exports.verifyToken = verifyToken;
