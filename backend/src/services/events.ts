import { query } from "../utils/db";
import { EventType, TotalCount } from "../types/types";

export const fetchEvents = async (offset: number = 0, limit: number, search?: string) => {
    let queryString = '';
    let countQuery = '';
    let queryStringParams = [];

    if (search) {
        queryString = ` SELECT *
                        FROM events
                        WHERE title ILIKE $1
                           OR description ILIKE $1
                        ORDER BY created_at DESC LIMIT $2
                        OFFSET $3`;

        countQuery = ` SELECT COUNT(*) 
                       FROM events
                       WHERE title ILIKE $1
                          OR description ILIKE $1`;

        queryStringParams = [`%${search}%`, limit, offset];
    } else {
        queryString = `SELECT *
                       FROM events
                       ORDER BY created_at DESC LIMIT $1
                       OFFSET $2`;

        countQuery = `SELECT COUNT(*) FROM events`;

        queryStringParams = [limit, offset];
    }

    const events: EventType[] = await query(queryString, queryStringParams);
    const total: TotalCount[] = await query(
        countQuery,
        search ? [`%${search}%`] : []
    );

    return { events, total: Number(total[0].count) };
};

export const createEvent = async (userEmail: string, title: string, description: string, eventDate: string, location: string, category: string, tags: string[], maxCapacity?: number) => {
    const queryString = `INSERT INTO events (user_email, title, description, event_date, location, category, tags, max_capacity)
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                            RETURNING *`;
    const values = [userEmail, title, description, eventDate, location, category, JSON.stringify(tags), maxCapacity || null];


    const result = await query(queryString, values);
    return result[0];
}