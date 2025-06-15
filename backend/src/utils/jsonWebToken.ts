import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { getUserByEmail } from "../services/users";
import { UserStatus, UserType } from "../types/types";

const secretKey = process.env.JWT_SECRET || "your-secret-key";

export const jsonWebToken = {
    generateToken: (email: string): string => {
        return jwt.sign({ email }, secretKey, { expiresIn: "1h" });
    },
    verifyToken: (token: string): JwtPayload | string | null => {
        try {
            return jwt.verify(token, secretKey) as JwtPayload;
        } catch (error) {
            console.error("Invalid token", error);
            return null;
        }
    },
};

interface TokenData extends JwtPayload {
    email: string;
}

export interface AuthenticatedRequest extends Request {
    userData?: string;
}

export const createRoleBasedMiddleware = (
    allowedRoles: UserType[],
    errorMessage: string = "Forbidden: Insufficient permissions"
): RequestHandler => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const token =
            req.cookies?.token || req.headers["authorization"]?.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: "Unauthorized: No token provided" });
            return;
        }

        const userData = jsonWebToken.verifyToken(token);
        if (!userData) {
            res.status(401).json({ message: "Unauthorized: Invalid token" });
            return;
        }

        const email = (userData as TokenData).email;
        if (!email) {
            res.status(401).json({ message: "Unauthorized: Invalid token data" });
            return;
        }

        const user = await getUserByEmail(email);
        if (user.length === 0) {
            res.status(401).json({ message: "Unauthorized: User not found" });
            return;
        }

        if (!allowedRoles.includes(user[0].userType)) {
            res.status(403).json({ message: errorMessage });
            return;
        }

        if (user[0].status === UserStatus.NOT_ACTIVE) {
            res.status(403).json({ message: "Forbidden: User is not active" });
            return;
        }

        req.userData = email;
        next();
    };
};

export const checkForToken = createRoleBasedMiddleware(
    [UserType.ADMIN, UserType.EVENT_CREATOR],
    "Forbidden: Event Creator or Admin access required"
);

export const checkForAdminToken = createRoleBasedMiddleware(
    [UserType.ADMIN],
    "Forbidden: Admin access required"
);