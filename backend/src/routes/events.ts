import express from "express";
import asyncHandler from "../utils/catchAsync";
import {
    addEvent,
    deleteEvent,
    getAllEvents,
    getTheMostPopularEvents,
    getTheNewestEvents,
    incrementViews,
    updateEvent
} from "../controllers/events";
import { checkForToken } from "../middlewares/checkForToken";
import { checkBody } from "../middlewares/checkBody";

const eventsRouter = express.Router();

eventsRouter.get("/", asyncHandler(getAllEvents));
eventsRouter.get("/newest", asyncHandler(getTheNewestEvents)); //not imp yet
eventsRouter.get("/popular", asyncHandler(getTheMostPopularEvents));//not imp yet
eventsRouter.post("/", checkBody, checkForToken, asyncHandler(addEvent));
eventsRouter.patch("/:id", checkBody, checkForToken, asyncHandler(updateEvent));
eventsRouter.delete("/:id", checkForToken, asyncHandler(deleteEvent));

eventsRouter.put("/increment-views/:id", asyncHandler(incrementViews)); //not imp yet

export default eventsRouter;