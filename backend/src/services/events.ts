import { query } from "../utils/db";
import { EventDTO, EventType, TotalCount } from "../types/types";

const mapEventFromDB = (event: any): EventType => {
    return {
        id: event.id,
        title: event.title,
        description: event.description,
        createdAt: event.created_at,
        event_date: event.event_date,
        location: event.location,
        views: event.views,
        authorEmail: event.author_email,
        categoryName: event.category_name,
        maxCapacity: event.max_capacity,
        likeCount: event.like_count,
        dislikeCount: event.dislike_count,
        tags: event.tags
    };
};

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

        countQuery = `SELECT COUNT(*)
                      FROM events`;

        queryStringParams = [limit, offset];
    }

    const eventsFromDB: EventType[] = await query(queryString, queryStringParams);
    const total: TotalCount[] = await query(
        countQuery,
        search ? [`%${search}%`] : []
    );

    const events = eventsFromDB.map(event => mapEventFromDB(event));

    return { events, total: Number(total[0].count) };
};

export const createEvent = async (userEmail: string, title: string, description: string, eventDate: string, location: string, category: string, maxCapacity?: number) => {
    const queryString = `INSERT INTO events (author_email, title, description, event_date, location, category_name,
                                             max_capacity)
                         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    const values = [userEmail, title, description, eventDate, location, category, maxCapacity || null];

    const result = await query(queryString, values);
    return mapEventFromDB(result[0]);
};

export const getEventById = async (id: string) => {
    const queryString = `SELECT *
                         FROM events
                         WHERE id = $1`;
    const values = [id];

    const result: EventType[] = await query(queryString, values);
    return mapEventFromDB(result[0]);
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

    const modifiedEvent = await query(queryText, params);

    return {
        event: mapEventFromDB(modifiedEvent[0]),
    };
};

export const getEventBasedOnCategory = async (name: string) => {
    const queryString = `SELECT *
                         FROM events
                         WHERE category_name = $1`;
    const values = [name];

    const result: EventType[] = await query(queryString, values);
    return mapEventFromDB(result);
};

export const removeEvent = async (id: string) => {
    const queryString = `DELETE
                         FROM events
                         WHERE id = $1`;
    const values = [id];

    await query(queryString, values);
};