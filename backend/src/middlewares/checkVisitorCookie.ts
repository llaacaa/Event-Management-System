import { NextFunction, Request, Response } from "express";

export interface CookieRequest extends Request {
    visitorId?: string;
}

export const checkVisitorCookie = (req: CookieRequest, res: Response, next: NextFunction) => {
    if (!req.cookies.visitorId) {
        const uuid = crypto.randomUUID();
        res.cookie('visitorId', uuid, {
            maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });
        req.visitorId = uuid;
    } else {
        req.visitorId = req.cookies.visitorId;
    }

    next();
};