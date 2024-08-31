import { Request, Response } from "express";
import { _hello } from "../models/main_model";
import { mainModel } from "../models/main_model";

export const hello = (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(id);
    _hello(Number(id))
        .then(result => {
            res.json(result)
        })
        .catch(() => {
            res.status(404).json({message:'something went wrong!!!'});
        })
};

export const mainController = {
    getPrograms: (req: Request, res: Response) => {
        const { userid } = req.query;
        mainModel._getPrograms(Number(userid))
            .then(data => {
                // console.log('getProgram-data-', data); //--------------
                if (!data) {
                    res.status(204);
                }
                else {
                    res.status(200).json(data)
                }
            })
            .catch(() => {
                res.status(404).json({message:'something went wrong!!!'});
            })
    },

    postProgram: (req: Request, res: Response) => {
        const progData = req.body;
        mainModel._postProgram(progData)
            .then(result => {
                res.status(201).json(result)
            })
            .catch(() => {
                res.status(404).json({message:'something went wrong!!!'});
            })
    },

    patchProgram: (req: Request, res: Response) => {
        const progData = req.body;
        mainModel._patchProgram(progData)
            .then(result => {
                res.status(206).json(result)
            })
            .catch(() => {
                res.status(404).json({message:'something went wrong!!!'});
            })
    }
};