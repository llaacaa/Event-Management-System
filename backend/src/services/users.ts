import { query } from "../utils/db";
import { ActivityStatus, User } from "../types/types";

export const getUserByEmail = (email: string) => {
    return query(`SELECT email, name, last_name AS "lastName", user_type AS "userType", status, password
                  FROM users
                  WHERE email = $1`, [email]);
};

export const addUser = (user: User) => {
    const { email, name, lastName, userType, status, password } = user;

    return query(
        "INSERT INTO users (email, name, last_name, user_type, status, password) VALUES ($1, $2, $3, $4, $5, $6)",
        [email, name, lastName, userType, status, password]
    );
};

export const fetchAllUsers = () => {
    return query(`SELECT email,
                         name,
                         last_name AS "lastName",
                         user_type AS "userType",
                         status,
                         password
                  FROM users`);
};

export const updateUserInfo = (email: string, updates: Partial<User>) => {
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramCounter = 1;

    if (updates.name !== undefined) {
        updateFields.push(`name = $${paramCounter++}`);
        values.push(updates.name);
    }
    if (updates.lastName !== undefined) {
        updateFields.push(`last_name = $${paramCounter++}`);
        values.push(updates.lastName);
    }
    if (updates.userType !== undefined) {
        updateFields.push(`user_type = $${paramCounter++}`);
        values.push(updates.userType);
    }
    if (updates.status !== undefined) {
        updateFields.push(`status = $${paramCounter++}`);
        values.push(updates.status);
    }
    if (updates.password !== undefined) {
        updateFields.push(`password = $${paramCounter++}`);
        values.push(updates.password);
    }

    if (updateFields.length === 0) return;

    values.push(email);

    const sql = `UPDATE users
                 SET ${updateFields.join(", ")}
                 WHERE email = $${paramCounter}`;
    return query(sql, values);
};

export const updateUserActivityStatus = (email: string, status: ActivityStatus) => {
    return query(
        "UPDATE users SET status = $1 WHERE email = $2",
        [status, email]
    );
};
