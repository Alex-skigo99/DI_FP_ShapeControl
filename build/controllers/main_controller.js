"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainController = exports.hello = void 0;
const main_model_1 = require("../models/main_model");
const main_model_2 = require("../models/main_model");
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
exports.mainController = {
    getPrograms: (req, res) => {
        const { userid } = req.query;
        main_model_2.mainModel._getPrograms(Number(userid))
            .then(data => {
            // console.log('getProgram-data-', data); //--------------
            if (!data) {
                res.status(204);
            }
            else {
                res.status(200).json(data);
            }
        })
            .catch(() => {
            res.status(404).json({ message: 'something went wrong!!!' });
        });
    },
    postProgram: (req, res) => {
        const progData = req.body;
        main_model_2.mainModel._postProgram(progData)
            .then(result => {
            res.json(result);
        })
            .catch(() => {
            res.status(404).json({ message: 'something went wrong!!!' });
        });
    }
};
