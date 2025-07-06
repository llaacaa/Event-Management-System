import express from "express";
import asyncHandler from "../utils/catchAsync";
import {
    addEvent,
    deleteEvent,
    dislikeEvent,
    getAllEvents,
    getTheMostPopularEvents,
    getTheNewestEvents,
    incrementViews,
    likeEvent,
    updateEvent
} from "../controllers/events";
import { checkForToken } from "../middlewares/checkForToken";
import { checkBody } from "../middlewares/checkBody";

const eventsRouter = express.Router();

eventsRouter.get("/", asyncHandler(getAllEvents));
eventsRouter.get("/newest", asyncHandler(getTheNewestEvents));
eventsRouter.get("/popular", asyncHandler(getTheMostPopularEvents));
eventsRouter.post("/", checkBody, checkForToken, asyncHandler(addEvent));
eventsRouter.patch("/:id", checkBody, checkForToken, asyncHandler(updateEvent));
eventsRouter.delete("/:id", checkForToken, asyncHandler(deleteEvent));

eventsRouter.put("/increment-views/:id", asyncHandler(incrementViews));

eventsRouter.put("/like/:id", asyncHandler(likeEvent));
eventsRouter.put("/events/dislike/:id", asyncHandler(dislikeEvent));

export default eventsRouter;