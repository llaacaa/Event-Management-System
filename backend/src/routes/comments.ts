import express from "express";
import asyncHandler from "../utils/catchAsync";
import { disLikeEventComment, getAllEventComments, likeEventComment } from "../controllers/comments";

const commentsRouter = express.Router();

commentsRouter.get("/", asyncHandler(getAllEventComments));
commentsRouter.post("/like", asyncHandler(likeEventComment));
commentsRouter.post("/dislike", asyncHandler(disLikeEventComment));

export default commentsRouter;