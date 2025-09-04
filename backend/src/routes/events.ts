import express from "express";
import asyncHandler from "../utils/catchAsync";
import {
  addEvent,
  deleteEvent, dislikeEvent,
  getAllEvents,
  getEventByIdController,
  getEventsByCategoryController,
  getEventsByTag,
  getMostInteractedEvents,
  getRelatedEvents,
  getTheMostPopularEvents,
  getTheNewestEvents, getUsersReactionsToEvent,
  incrementViews, likeEvent, removeReaction,
  updateEvent
} from "../controllers/events";
import { checkForToken } from "../middlewares/checkForToken";
import { checkBody } from "../middlewares/checkBody";

const eventsRouter = express.Router();

eventsRouter.get("/", asyncHandler(getAllEvents));
eventsRouter.get("/:id/reactions", asyncHandler(getUsersReactionsToEvent));
eventsRouter.get("/newest", asyncHandler(getTheNewestEvents));
eventsRouter.get("/popular", asyncHandler(getTheMostPopularEvents));
eventsRouter.get("/events-by-tag/:tagId", asyncHandler(getEventsByTag));
eventsRouter.get("/most-interacted", asyncHandler(getMostInteractedEvents));
eventsRouter.get("/by-category/:category", asyncHandler(getEventsByCategoryController));
eventsRouter.get("/related-events/:id", asyncHandler(getRelatedEvents));
eventsRouter.get("/:id", asyncHandler(getEventByIdController));
eventsRouter.post("/", checkBody, checkForToken, asyncHandler(addEvent));
eventsRouter.put("/:id", checkBody, checkForToken, asyncHandler(updateEvent));
eventsRouter.delete("/:id", checkForToken, asyncHandler(deleteEvent));

eventsRouter.put("/increment-views/:id", asyncHandler(incrementViews));

eventsRouter.delete("/remove-reaction/:id", asyncHandler(removeReaction));
eventsRouter.put("/like/:id", asyncHandler(likeEvent));
eventsRouter.put("/dislike/:id", asyncHandler(dislikeEvent));

export default eventsRouter;
