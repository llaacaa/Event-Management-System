import { query } from "../utils/db";
import { EventDTO } from "../types/types";

const selectAllSQL = `
    id,
    title,
    description,
    created_at    AS "createdAt",
    event_date    AS "eventDate",
    location,
    views,
    author_email  AS "authorEmail",
    category_name AS "categoryName",
    max_capacity  AS "maxCapacity",
    like_count    AS "likeCount",
    dislike_count AS "dislikeCount"
`;

export const fetchEvents = async (offset: number = 0, limit: number, search?: string) => {
    let queryString = '';
    let countQuery = '';
    let queryStringParams = [];

    if (search) {
        queryString = `SELECT ${selectAllSQL}
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
        queryString = `SELECT ${selectAllSQL}
                       FROM events
                       ORDER BY created_at DESC LIMIT $1
                       OFFSET $2`;

        countQuery = `SELECT COUNT(*)
                      FROM events`;

        queryStringParams = [limit, offset];
    }

    const eventsFromDB = await query(queryString, queryStringParams);
    const totalFromDB = await query(
        countQuery,
        search ? [`%${search}%`] : []
    );

    return { eventsFromDB, totalFromDB };
};

export const createEvent = (userEmail: string, title: string, description: string, eventDate: string, location: string, category: string, maxCapacity?: number) => {
    const queryString = `INSERT INTO events (author_email, title, description, event_date, location, category_name,
                                             max_capacity)
                         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    const values = [userEmail, title, description, eventDate, location, category, maxCapacity || null];

    return query(queryString, values);
};

export const getEventById = (id: string) => {
    const queryString = `SELECT ${selectAllSQL}
                         FROM events
                         WHERE id = $1`;
    const values = [id];

    return query(queryString, values);
};

export const modifyEvent = async (id: string, eventData: Partial<EventDTO>) => {
    const { title, description, eventDate, location, category, maxCapacity } = eventData;

    let updateFields = [];
    const params = [id];
    let paramIndex = 2;

    if (title !== undefined) {
        updateFields.push(`title = $${paramIndex++}`);
        params.push(title);
    }

    if (description !== undefined) {
        updateFields.push(`description = $${paramIndex++}`);
        params.push(description);
    }

    if (eventDate !== undefined) {
        updateFields.push(`event_date = $${paramIndex++}`);
        params.push(eventDate);
    }

    if (location !== undefined) {
        updateFields.push(`location = $${paramIndex++}`);
        params.push(location);
    }

    if (category !== undefined) {
        updateFields.push(`category = $${paramIndex++}`);
        params.push(category);
    }

    if (maxCapacity !== undefined) {
        updateFields.push(`max_capacity = $${paramIndex++}`);
        params.push(maxCapacity.toString());
    }

    if (updateFields.length === 0) {
        return await getEventById(id);
    }

    const queryText = `
        UPDATE events
        SET ${updateFields.join(', ')}
        WHERE id = $1 RETURNING *
    `;

    return query(queryText, params);
};

export const getEventBasedOnCategory = (name: string) => {
    const queryString = `SELECT ${selectAllSQL}
                         FROM events
                         WHERE category_name  = $1`;
    const values = [name];

    return query(queryString, values);
};

export const removeEvent = (id: string) => {
    const queryString = `DELETE
                         FROM events
                         WHERE id = $1`;
    const values = [id];

    return query(queryString, values);
};

export const fetchNewestEvents = (limit: number = 10) => {
    const queryString = `SELECT ${selectAllSQL}
                         FROM events
                         ORDER BY created_at DESC
                             LIMIT $1`;
    const values = [limit];
    return query(queryString, values);
};

export const fetchAllEventTags = () => {
    const queryString = `SELECT event_id  AS "eventId",
                                tags.name AS "tagName"
                         FROM event_tags`;
    return query(queryString);
};