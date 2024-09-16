"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainController = exports.hello = void 0;
const main_model_1 = require("../models/main_model");
const main_model_2 = require("../models/main_model");
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai = new openai_1.default();
const hello = (req, res) => {
    const { id } = req.params;
    console.log(id);
    (0, main_model_1._hello)(Number(id))
        .then(result => {
        res.json(result);
    })
        .catch((err) => {
        res.status(500).json({ message: err.message });
    });
};
exports.hello = hello;
exports.mainController = {
    getPrograms: (req, res) => {
        const { userid } = req.query;
        main_model_2.mainModel._getPrograms(Number(userid))
            .then(data => {
            if (!data) {
                res.status(204);
            }
            else {
                res.status(200).json(data);
            }
        })
            .catch((err) => {
            res.status(500).json({ message: err.message });
        });
    },
    postProgram: (req, res) => {
        const progData = req.body;
        main_model_2.mainModel._postProgram(progData)
            .then(result => {
            res.status(201).json(result);
        })
            .catch((err) => {
            res.status(500).json({ message: err.message });
        });
    },
    patchProgram: (req, res) => {
        const progData = req.body;
        main_model_2.mainModel._patchProgram(progData)
            .then(data => {
            res.status(206).json(data);
        })
            .catch((err) => {
            res.status(500).json({ message: err.message });
        });
    },
    gpt: async (req, res) => {
        const { prompt } = req.query;
        console.log('prompt', prompt); //--------------
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });
        let result = completion.choices[0].message;
        res.status(200).json(result);
    }
};
