import express from "express";
import asyncHandler from "../utils/catchAsync";
import { addEvent, deleteEvent, getAllEvents, updateEvent } from "../controllers/events";
import { checkForToken } from "../utils/jsonWebToken";

const eventsRouter = express.Router();

eventsRouter.get("/", asyncHandler(getAllEvents));
eventsRouter.post("/", checkForToken, asyncHandler(addEvent));
eventsRouter.patch("/:id", checkForToken, asyncHandler(updateEvent));
eventsRouter.delete("/:id", checkForToken, asyncHandler(deleteEvent));

export default eventsRouter;