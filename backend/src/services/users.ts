import { query } from "../utils/db";
import { User } from "../types/types";

export const getUserByEmail = async (email: string) => {
    const user: User[] = await query("SELECT * FROM users WHERE email = $1", [email]);
    return user;
}

export const addUser = async (user: User) => {
    const { email, name, lastName, userType, status, password } = user;

    await query(
        "INSERT INTO users (email, name, last_name, user_type, status, password) VALUES ($1, $2, $3, $4, $5, $6)",
        [email, name, lastName, userType, status, password]
    );
}