"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const main_controller_1 = require("../controllers/main_controller");
const express_1 = __importDefault(require("express"));
exports.router = express_1.default.Router();
// router.get('/', (req, res) => {res.render('index')});
exports.router.get('/api/hello', main_controller_1.hello);
// router.post('/api/login', login);
// router.post('/api/signup', signup);
// router.get('/api/programs', getPrograms);
// router.post('/api/programs', createProgram);
