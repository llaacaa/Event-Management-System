import { NextFunction, Request, Response } from "express";

export const checkBody = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        res.status(400).json({
            success: false,
            error: {
                message: "Request body cannot be empty"
            }
        });
        return;
    }

    next();
};