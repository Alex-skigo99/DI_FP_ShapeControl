"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const main_controller_1 = require("../controllers/main_controller");
exports.router = express_1.default.Router();
// router.get('/', (req, res) => {res.render('index')});
exports.router.get('/', (req, res) => {
    console.log(path_1.default.resolve(__dirname, "../../client/dist", "index.html"));
    res.render(path_1.default.resolve(__dirname, "../../client/dist", "index.html"));
});
exports.router.get('/api/hello/:id', main_controller_1.hello);
// router.post('/api/login', login);
// router.post('/api/signup', signup);
// router.get('/api/programs', getPrograms);
// router.post('/api/programs', createProgram);
// All other GET requests not handled before will return our React app
exports.router.get("*", (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, "./client/dist", "index.html"));
});
