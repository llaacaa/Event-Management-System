import jwt, { JwtPayload } from "jsonwebtoken";

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
