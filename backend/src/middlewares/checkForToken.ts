import { UserStatus, UserType } from "../types/types";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { getUserByEmail } from "../services/users";
import { jsonWebToken } from "../utils/jsonWebToken";
import { JwtPayload } from "jsonwebtoken";

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
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
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

    const userFromDB = await getUserByEmail(email);

    if (!userFromDB.success) {
      res.status(userFromDB.status).json({ error: userFromDB.error });
      return;
    }

    const user = userFromDB.data;

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
