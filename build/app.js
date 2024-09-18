"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const main_router_1 = require("./routers/main_router");
const user_router_1 = require("./routers/user_router");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const strava_router_1 = require("./routers/strava_router");
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)()); // Enable cookie handling
app.use(express_1.default.static(path_1.default.resolve(__dirname, "../client/dist")));
console.log(path_1.default.resolve(__dirname, "../client/dist"));
app.use((0, cors_1.default)());
app.listen(process.env.PORT || 3001, () => {
    console.log(`run on ${process.env.PORT || 3001}`);
});
app.get('/', (req, res) => {
    res.render(path_1.default.resolve(__dirname, "../client/dist", "index.html"));
});
app.use('/api/', main_router_1.mainRouter);
app.use('/user/', user_router_1.userRouter);
app.use('/strava/', strava_router_1.stravaRouter);
// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, "../client/dist", "index.html"));
});
