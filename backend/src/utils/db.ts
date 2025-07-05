import { Pool } from 'pg';
import dotenv from 'dotenv';
import { Encrypt } from "./bcryptEncription";
import { UserStatus, UserType } from "../types/types";

dotenv.config();

export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});

export interface DbSuccessResult<T> {
    success: true;
    data: T;
    error: null;
}

export interface DbErrorResult {
    success: false;
    data: null;
    status: number;
    error: {
        message: string;
        context?: any;
    };
}

export type DbResult<T> = DbSuccessResult<T> | DbErrorResult;

export const query = async <T = any[]>(text: string, params?: any[]): Promise<DbResult<T>> => {
    try {
        const result = await pool.query(text, params);
        return {
            success: true,
            data: result.rows as T,
            error: null
        };
    } catch (error) {
        console.error('Error executing query', error);
        return {
            success: false,
            data: null,
            status: 500,
            error: {
                message: 'Database operation failed.',
                context: { sqlQuery: text, originalError: (error as Error).message }
            }
        };
    }
};

export const initAdmin = async () => {
    try {
        const admin = await query("SELECT * FROM users WHERE user_type = $1", ['ADMIN']);

        if (admin.success) {
            if (admin.data.length === 0) {
                console.log("No admin user found, creating one...");
                const hashedPassword = await Encrypt.cryptPassword("admin");
                await query(
                    "INSERT INTO users (email, name, last_name, user_type, status, password) VALUES ($1, $5, $5, $3, $4, $2)",
                    ['admin@gmail.com', hashedPassword, UserType.ADMIN, UserStatus.ACTIVE, "admin"]
                );
            }
        } else {
            console.error("Failed to check for admin user:", admin.error.message);
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log("An unknown error occurred");
        }
    }
};