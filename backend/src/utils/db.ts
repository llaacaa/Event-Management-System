import {Pool} from 'pg';
import dotenv from 'dotenv';
import { UserStatus, UserType } from "../types/types";

dotenv.config();

export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});

pool.on('connect', async () => {
    const admin = await query("SELECT * FROM users WHERE user_type = $1", ['ADMIN']);
    if (admin.length === 0) {
        console.log("No admin user found, creating one...");
        await query("INSERT INTO users (email, name, last_name, user_type, status, password) VALUES ($1, $2, $2, $3, $4, $2)", ['admin@gmail.com', 'admin', UserType.ADMIN, UserStatus.ACTIVE]);
    }
});

export const query = async (text: string, params?: any[]) => {
    try {
        const result = await pool.query(text, params);
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error);
        throw error;
    }
};
