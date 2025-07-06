import { Request, Response } from 'express';
import {
    createCommentReaction,
    fetchAllEventComments,
    getCommentReaction,
    removeCommentReaction,
    updateCommentDislikeCount,
    updateCommentLikeCount
} from "../services/comments";
import { CookieRequest } from "../middlewares/checkVisitorCookie";
import { CommentReactionType } from "../types/types";

export const getAllEventComments = async (req: Request, res: Response) => {
    const { id } = req.params;

    const commentsFromDB = await fetchAllEventComments(id);

    if (!commentsFromDB.success) {
        return res.status(commentsFromDB.status || 500).json({
            success: false,
            error: commentsFromDB.error
        });
    }

    const comments = commentsFromDB.data;

    return res.status(200).json({
        success: true,
        data: comments
    });
};

export const likeEventComment = async (req: CookieRequest, res: Response) => {
    const { id } = req.params;
    const visitorId = req.visitorId;

    if (!visitorId) {
        return res.status(400).json({
            success: false,
            error: {
                message: "Visitor ID is required"
            }
        });
    }

    // Check if the visitor has already liked the comment or disliked it

    const existingReaction = await getCommentReaction(id, visitorId);

    if (!existingReaction.success) {
        return res.status(existingReaction.status || 500).json({
            success: false,
            error: existingReaction.error
        });
    }

    const reaction = existingReaction.data[0];

    if (reaction) {
        switch (reaction.type) {
            case CommentReactionType.LIKE:
                return res.status(400).json({
                    success: false,
                    error: {
                        message: "You have already liked this comment"
                    }
                });
            case CommentReactionType.DISLIKE:
                // If the visitor has disliked the comment, we remove the dislike
                const removeReactionDB = await removeCommentReaction(id, visitorId);
                if (!removeReactionDB.success) {
                    return res.status(removeReactionDB.status || 500).json({
                        success: false,
                        error: removeReactionDB.error
                    });
                }

                // -1 to the comment's dislikes count

                const updateDislikeCountDB = await updateCommentDislikeCount(id, "-");
                if (!updateDislikeCountDB.success) {
                    return res.status(updateDislikeCountDB.status || 500).json({
                        success: false,
                        error: updateDislikeCountDB.error
                    });
                }
                break;
            default:
                return res.status(400).json({
                    success: false,
                    error: {
                        message: "Invalid reaction type"
                    }
                });
        }
    }

    const commentReactionDB = await createCommentReaction(id, visitorId, CommentReactionType.LIKE);

    if (!commentReactionDB.success) {
        return res.status(commentReactionDB.status || 500).json({
            success: false,
            error: commentReactionDB.error
        });
    }

    // +1 to the comment's likes count

    const updateLikeCountDB = await updateCommentLikeCount(id, "+");

    if (!updateLikeCountDB.success) {
        return res.status(updateLikeCountDB.status || 500).json({
            success: false,
            error: updateLikeCountDB.error
        });
    }

    return res.status(200).json({
        success: true,
        message: "Comment liked successfully"
    });

};

export const disLikeEventComment = async (req: CookieRequest, res: Response) => {
    const { id } = req.params;
    const visitorId = req.visitorId;

    if (!visitorId) {
        return res.status(400).json({
            success: false,
            error: {
                message: "Visitor ID is required"
            }
        });
    }

    // Check if the visitor has already disliked the comment or liked it

    const existingReaction = await getCommentReaction(id, visitorId);

    if (!existingReaction.success) {
        return res.status(existingReaction.status || 500).json({
            success: false,
            error: existingReaction.error
        });
    }

    const reaction = existingReaction.data[0];

    if (reaction) {
        switch (reaction.type) {
            case CommentReactionType.DISLIKE:
                return res.status(400).json({
                    success: false,
                    error: {
                        message: "You have already disliked this comment"
                    }
                });
            case CommentReactionType.LIKE:
                // If the visitor has liked the comment, we remove the like
                const removeReactionDB = await removeCommentReaction(id, visitorId);
                if (!removeReactionDB.success) {
                    return res.status(removeReactionDB.status || 500).json({
                        success: false,
                        error: removeReactionDB.error
                    });
                }

                // -1 to the comment's likes count

                const updateLikeCountDB = await updateCommentLikeCount(id, "-");
                if (!updateLikeCountDB.success) {
                    return res.status(updateLikeCountDB.status || 500).json({
                        success: false,
                        error: updateLikeCountDB.error
                    });
                }
                break;
            default:
                return res.status(400).json({
                    success: false,
                    error: {
                        message: "Invalid reaction type"
                    }
                });
        }
    }

    const commentReactionDB = await createCommentReaction(id, visitorId, CommentReactionType.DISLIKE);

    if (!commentReactionDB.success) {
        return res.status(commentReactionDB.status || 500).json({
            success: false,
            error: commentReactionDB.error
        });
    }

    // +1 to the comment's dislikes count

    const updateDislikeCountDB = await updateCommentDislikeCount(id, "+");

    if (!updateDislikeCountDB.success) {
        return res.status(updateDislikeCountDB.status || 500).json({
            success: false,
            error: updateDislikeCountDB.error
        });
    }

    return res.status(200).json({
        success: true,
        message: "Comment disliked successfully"
    });
};