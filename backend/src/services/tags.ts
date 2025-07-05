import { query } from "../utils/db";

export const findTagByName = (name: string) => {
    const queryString = `SELECT *
                         FROM tags
                         WHERE name = $1`;
    const values = [name];

    return query(queryString, values);
};

export const createTag = (name: string) => {
    const queryString1 = `INSERT INTO tags (name)
                          VALUES ($1) RETURNING *`;
    const values1 = [name];

    return query(queryString1, values1);
};

export const linkTagToEvent = (tagId: string, eventId: string) => {
    const queryString = `INSERT INTO event_tags (tag_id, event_id)
                         VALUES ($1, $2) RETURNING *`;
    const values = [tagId, eventId];

    return query(queryString, values);
};

export const fetchAllEventTags = () => {
    const queryString = `SELECT tags.name, event_id as "eventId"
                         FROM tags
                                  INNER JOIN event_tags ON tags.id = event_tags.tag_id`;

    return query(queryString);
};

export const removeTagsFromEvent = (eventId: string) => {
    const queryString = `DELETE
                         FROM event_tags
                         WHERE event_id = $1`;
    const values = [eventId];

    return query(queryString, values);
};