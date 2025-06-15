import express from "express";
import asyncHandler from "../utils/catchAsync";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../controllers/categories";
import { checkForToken } from "../utils/jsonWebToken";

const categoriesRouter = express.Router();

categoriesRouter.get("/", asyncHandler(getCategories));
categoriesRouter.post("/", checkForToken, asyncHandler(createCategory));
categoriesRouter.put("/", checkForToken, asyncHandler(updateCategory));
categoriesRouter.delete("/:name", checkForToken, asyncHandler(deleteCategory));

export default categoriesRouter;