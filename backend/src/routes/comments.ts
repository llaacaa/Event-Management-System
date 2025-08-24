import express from "express";
import asyncHandler from "../utils/catchAsync";
import { addComment, deleteCommentReaction, disLikeEventComment, getAllEventComments, likeEventComment } from "../controllers/comments";

const commentsRouter = express.Router();

commentsRouter.get("/:id", asyncHandler(getAllEventComments));
commentsRouter.post("/:id", asyncHandler(addComment));
commentsRouter.post("/:id/like", asyncHandler(likeEventComment));
commentsRouter.post("/:id/dislike", asyncHandler(disLikeEventComment));
commentsRouter.delete("/:id/remove-reaction", asyncHandler(deleteCommentReaction));

export default commentsRouter;