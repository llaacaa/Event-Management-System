import express from "express";
import asyncHandler from "../utils/catchAsync";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../controllers/categories";

const categoriesRouter = express.Router();

categoriesRouter.get("/", asyncHandler(getCategories));
categoriesRouter.post("/", asyncHandler(createCategory));
categoriesRouter.put("/", asyncHandler(updateCategory));
categoriesRouter.delete("/:name", asyncHandler(deleteCategory));

export default categoriesRouter;