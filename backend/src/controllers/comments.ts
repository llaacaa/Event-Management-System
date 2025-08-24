import { Request, Response } from "express";
import {
  createComment,
  createCommentReaction,
  fetchAllEventComments,
  getCommentReaction,
  removeCommentReaction,
  updateCommentDislikeCount,
  updateCommentLikeCount,
} from "../services/comments";
import { CookieRequest } from "../middlewares/checkVisitorCookie";
import { CommentReactionType } from "../types/types";

export const getAllEventComments = async (
  req: CookieRequest,
  res: Response
) => {
  const { id } = req.params;

  const commentsFromDB = await fetchAllEventComments(id);

  if (!commentsFromDB.success) {
    return res.status(commentsFromDB.status || 500).json({
      success: false,
      error: commentsFromDB.error,
    });
  }

  const comments = commentsFromDB.data;

  const visitorId = req.visitorId;

  if (!visitorId) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Visitor ID is required",
      },
    });
  }

  const newComments = await Promise.all(
    comments.map(async (comment) => {
      comment.isLiked = false;
      comment.isDisliked = false;

      if (visitorId) {
        const existingReaction = await getCommentReaction(
          comment.id,
          visitorId
        );
        if (existingReaction.success) {
          const reaction = existingReaction.data[0];
          if (reaction) {
            if (reaction.reactionType === CommentReactionType.LIKE) {
              comment.isLiked = true;
            } else if (reaction.reactionType === CommentReactionType.DISLIKE) {
              comment.isDisliked = true;
            }
          }
        }
      }
      return comment;
    })
  );

  return res.status(200).json({
    success: true,
    data: newComments,
  });
};

export const addComment = async (req: CookieRequest, res: Response) => {
  const { id } = req.params;
  const { content, authorName } = req.body;

  if (!content) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Comment content is required",
      },
    });
  }

  if (!authorName) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Author name is required",
      },
    });
  }

  // const visitorId = req.visitorId;

  // if (!visitorId) {
  //     return res.status(400).json({
  //         success: false,
  //         error: {
  //             message: "Visitor ID is required"
  //         }
  //     });
  // }

  const addCommentDB = await createComment(id, content, authorName);

  if (!addCommentDB.success) {
    return res.status(addCommentDB.status || 500).json({
      success: false,
      error: addCommentDB.error,
    });
  }
  const dbComment = addCommentDB.data[0];
  const mappedData = {
    id: dbComment.id,
    eventId: dbComment.event_id,
    authorName: dbComment.author_name,
    commentText: dbComment.comment_text,
    createdAt: dbComment.created_at,
    likes: dbComment.likes,
    dislikes: dbComment.dislikes,
  };

  return res.status(201).json({
    success: true,
    data: mappedData,
  });
};

export const likeEventComment = async (req: CookieRequest, res: Response) => {
  const { id } = req.params;
  const visitorId = req.visitorId;

  if (!visitorId) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Visitor ID is required",
      },
    });
  }

  // Check if the visitor has already liked the comment or disliked it

  const existingReaction = await getCommentReaction(id, visitorId);

  if (!existingReaction.success) {
    return res.status(existingReaction.status || 500).json({
      success: false,
      error: existingReaction.error,
    });
  }

  const reaction = existingReaction.data[0];

  if (reaction) {
    switch (reaction.reactionType) {
      case CommentReactionType.LIKE:
        return res.status(400).json({
          success: false,
          error: {
            message: "You have already liked this comment",
          },
        });
      case CommentReactionType.DISLIKE:
        // If the visitor has disliked the comment, we remove the dislike
        const removeReactionDB = await removeCommentReaction(id, visitorId);
        if (!removeReactionDB.success) {
          return res.status(removeReactionDB.status || 500).json({
            success: false,
            error: removeReactionDB.error,
          });
        }

        // -1 to the comment's dislikes count

        const updateDislikeCountDB = await updateCommentDislikeCount(id, "-");
        if (!updateDislikeCountDB.success) {
          return res.status(updateDislikeCountDB.status || 500).json({
            success: false,
            error: updateDislikeCountDB.error,
          });
        }
        break;
      default:
        return res.status(400).json({
          success: false,
          error: {
            message: "Invalid reaction type",
          },
        });
    }
  }

  const commentReactionDB = await createCommentReaction(
    id,
    visitorId,
    CommentReactionType.LIKE
  );

  if (!commentReactionDB.success) {
    return res.status(commentReactionDB.status || 500).json({
      success: false,
      error: commentReactionDB.error,
    });
  }

  // +1 to the comment's likes count

  const updateLikeCountDB = await updateCommentLikeCount(id, "+");

  if (!updateLikeCountDB.success) {
    return res.status(updateLikeCountDB.status || 500).json({
      success: false,
      error: updateLikeCountDB.error,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Comment liked successfully",
  });
};

export const disLikeEventComment = async (
  req: CookieRequest,
  res: Response
) => {
  const { id } = req.params;
  const visitorId = req.visitorId;

  if (!visitorId) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Visitor ID is required",
      },
    });
  }

  const existingReaction = await getCommentReaction(id, visitorId);

  if (!existingReaction.success) {
    return res.status(existingReaction.status || 500).json({
      success: false,
      error: existingReaction.error,
    });
  }

  const reaction = existingReaction.data[0];

  if (reaction) {
    switch (reaction.reactionType) {
      case CommentReactionType.DISLIKE:
        return res.status(400).json({
          success: false,
          error: {
            message: "You have already disliked this comment",
          },
        });
      case CommentReactionType.LIKE:
        // If the visitor has liked the comment, we remove the like
        const removeReactionDB = await removeCommentReaction(id, visitorId);
        if (!removeReactionDB.success) {
          return res.status(removeReactionDB.status || 500).json({
            success: false,
            error: removeReactionDB.error,
          });
        }

        // -1 to the comment's likes count

        const updateLikeCountDB = await updateCommentLikeCount(id, "-");
        if (!updateLikeCountDB.success) {
          return res.status(updateLikeCountDB.status || 500).json({
            success: false,
            error: updateLikeCountDB.error,
          });
        }
        break;
      default:
        return res.status(400).json({
          success: false,
          error: {
            message: "Invalid reaction type",
          },
        });
    }
  }

  const commentReactionDB = await createCommentReaction(
    id,
    visitorId,
    CommentReactionType.DISLIKE
  );

  if (!commentReactionDB.success) {
    return res.status(commentReactionDB.status || 500).json({
      success: false,
      error: commentReactionDB.error,
    });
  }

  // +1 to the comment's dislikes count

  const updateDislikeCountDB = await updateCommentDislikeCount(id, "+");

  if (!updateDislikeCountDB.success) {
    return res.status(updateDislikeCountDB.status || 500).json({
      success: false,
      error: updateDislikeCountDB.error,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Comment disliked successfully",
  });
};

export const deleteCommentReaction = async (
  req: CookieRequest,
  res: Response
) => {
  const { id } = req.params;
  const visitorId = req.visitorId;

  if (!visitorId) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Visitor ID is required",
      },
    });
  }

  const existingReaction = await getCommentReaction(id, visitorId);

  if (!existingReaction.success) {
    return res.status(existingReaction.status || 500).json({
      success: false,
      error: existingReaction.error,
    });
  }

  const reaction = existingReaction.data[0];

  if (!reaction) {
    return res.status(404).json({
      success: false,
      error: {
        message: "Comment reaction not found",
      },
    });
  }

  const removeReactionDB = await removeCommentReaction(id, visitorId);
  if (!removeReactionDB.success) {
    return res.status(removeReactionDB.status || 500).json({
      success: false,
      error: removeReactionDB.error,
    });
  }

  switch (reaction.reactionType) {
    case CommentReactionType.LIKE:
      const decrementLikeCountDB = await updateCommentLikeCount(id, "-");
      if (!decrementLikeCountDB.success) {
        return res.status(decrementLikeCountDB.status || 500).json({
          success: false,
          error: decrementLikeCountDB.error,
        });
      }
      break;
    case CommentReactionType.DISLIKE:
      const decrementDislikeCountDB = await updateCommentDislikeCount(id, "-");
      if (!decrementDislikeCountDB.success) {
        return res.status(decrementDislikeCountDB.status || 500).json({
          success: false,
          error: decrementDislikeCountDB.error,
        });
      }
      break;
    default:
      return res.status(400).json({
        success: false,
        error: {
          message: "Invalid reaction type",
        },
      });
  }

  return res.status(200).json({
    success: true,
  });
};
