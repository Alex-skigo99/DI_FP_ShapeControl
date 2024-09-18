import { Request, Response } from "express";
import { mainModel } from "../models/main_model";
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();
  
const openai = new OpenAI();
  
export const mainController = {
    getPrograms: (req: Request, res: Response) => {
        const { userid } = req.query;
        mainModel._getPrograms(Number(userid))
            .then(data => {
                if (!data) {
                    res.status(204);
                }
                else {
                    res.status(200).json(data)
                }
            })
            .catch((err) => {
                res.status(500).json({message: err.message});
            })
    },

    postProgram: (req: Request, res: Response) => {
        const progData = req.body;
        mainModel._postProgram(progData)
            .then(result => {
                res.status(201).json(result)
            })
            .catch((err) => {
                res.status(500).json({message: err.message});
            })
    },

    patchProgram: (req: Request, res: Response) => {
        const progData = req.body;
        mainModel._patchProgram(progData)
            .then(data => {
                res.status(206).json(data)
            })
            .catch((err) => {
                res.status(500).json({message: err.message});
            })
    },

    gpt: async (req: Request, res: Response) => {
        const {prompt} = req.query;
        console.log('prompt',prompt);  //--------------
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                {
                    role: "user",
                    content: prompt as string,
                },
            ],
        });
        let result = completion.choices[0].message;
        res.status(200).json(result);
    },

};