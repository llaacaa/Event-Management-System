import { query } from "../utils/db";

export const findTagByName = async (name: string) => {
    const queryString = `SELECT *
                         FROM tags
                         WHERE name = $1`;
    const values = [name];

    const result = await query(queryString, values);
    return result[0];
};

export const createTag = async (name: string) => {
    const queryString1 = `INSERT INTO tags (name)
                          VALUES ($1) RETURNING *`;
    const values1 = [name];

    const result = await query(queryString1, values1);

    return result[0];
};

export const linkTagToEvent = async (tagId: string, eventId: string) => {
    const queryString = `INSERT INTO event_tags (tag_id, event_id)
                         VALUES ($1, $2) RETURNING *`;
    const values = [tagId, eventId];

    const result = await query(queryString, values);
    return result[0];
};

interface EventTag {
    name: string;
    eventId: string;
}

export const fetchAllEventTags = async () => {
    const queryString = `SELECT tags.name, event_id as "eventId"
                         FROM tags
                                  INNER JOIN event_tags ON tags.id = event_tags.tag_id`;

    const result: EventTag[] = await query(queryString);
    return result;
};

export const removeTagsFromEvent = async (eventId: string) => {
    const queryString = `DELETE
                         FROM event_tags
                         WHERE event_id = $1`;
    const values = [eventId];

    await query(queryString, values);
};