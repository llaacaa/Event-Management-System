import { Request, Response, NextFunction } from "express";

const asyncHandler = (
    func: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        func(req, res, next).catch(next);
    };
};

export default asyncHandler;