"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hello = void 0;
const main_model_1 = require("../models/main_model");
const hello = (req, res) => {
    const { id } = req.params;
    console.log(id);
    (0, main_model_1._hello)(Number(id))
        .then(result => {
        res.json(result);
    })
        .catch(() => {
        res.status(404).json({ message: 'something went wrong!!!' });
    });
};
exports.hello = hello;
