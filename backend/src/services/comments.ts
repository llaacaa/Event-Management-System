import { query } from "../utils/db";

export const fetchAllEventComments = (eventId: string) => {
    const querystring = `SELECT id,
                                author_name  as "authorName",
                                comment_text as "commentText",
                                created_at   as "createdAt",
                                event_id     as "eventId",
                                likes,
                                dislikes
                         from comments
                         WHERE event_id = $1
                         ORDER BY likes DESC, created_at DESC`;

    const values = [eventId];
    return query(querystring, values);
};

export const createCommentReaction = (commentId: string, visitorId: string, reactionType: string) => {
    const querystring = `INSERT INTO comment_reactions (comment_id, visitor_id, reaction_type)
                         VALUES ($1, $2, $3)`;

    const values = [commentId, visitorId, reactionType];
    return query(querystring, values);
};

export const getCommentReaction = (commentId: string, visitorId: string) => {
    const querystring = `SELECT reaction_type as "reactionType"
                         FROM comment_reactions
                         WHERE comment_id = $1
                           AND visitor_id = $2`;

    const values = [commentId, visitorId];
    return query(querystring, values);
};

export const removeCommentReaction = (commentId: string, visitorId: string) => {
    const querystring = `DELETE
                         FROM comment_reactions
                         WHERE comment_id = $1
                           AND visitor_id = $2`;

    const values = [commentId, visitorId];
    return query(querystring, values);
};

export const updateCommentLikeCount = (commentId: string, operator: "+" | "-") => {
    const querystring = `UPDATE comments
                         SET likes = likes ${operator} 1
                         WHERE id = $1 RETURNING *`;

    const values = [commentId];
    return query(querystring, values);
}

export const updateCommentDislikeCount = (commentId: string, operator: "+" | "-") => {
    const querystring = `UPDATE comments
                         SET dislikes = dislikes ${operator} 1
                         WHERE id = $1 RETURNING *`;

    const values = [commentId];
    return query(querystring, values);
};