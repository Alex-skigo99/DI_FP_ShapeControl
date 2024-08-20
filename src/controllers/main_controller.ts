import { Request, Response } from "express";
import { _hello } from "../models/main_model";

export const hello = (req: Request, res: Response) => {
    const { id } = req.query;
    console.log(id);
    _hello(Number(id))
        .then(result => {
            res.json(result)
        })
        .catch(() => {
            res.status(404).json({message:'something went wrong!!!'});
        })
};
