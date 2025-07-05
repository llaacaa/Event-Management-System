import express from "express";
import asyncHandler from "../utils/catchAsync";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../controllers/categories";
import { checkForToken } from "../middlewares/checkForToken";
import { checkBody } from "../middlewares/checkBody";

const categoriesRouter = express.Router();

categoriesRouter.get("/", asyncHandler(getCategories));
categoriesRouter.post("/", checkBody, checkForToken, asyncHandler(createCategory));
categoriesRouter.put("/", checkBody, checkForToken, asyncHandler(updateCategory));
categoriesRouter.delete("/:name", checkForToken, asyncHandler(deleteCategory));

export default categoriesRouter;