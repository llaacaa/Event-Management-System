import { Request, Response } from 'express';
import {
    addCategory,
    getCategoriesWithPagination,
    getCategoryByName,
    removeCategory,
    updateCategoryDescription
} from "../services/categories";
import { getEventBasedOnCategory } from "../services/events";
import { Category } from "../types/types";

export const getCategories = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { categoriesFromDB, totalFromDB } = await getCategoriesWithPagination(offset, limit);

    if (!categoriesFromDB.success) {
        res.status(categoriesFromDB.status || 500).json({ success: false, error: categoriesFromDB.error });
        return;
    }

    if (!totalFromDB.success) {
        res.status(totalFromDB.status || 500).json({ success: false, error: totalFromDB.error });
        return;
    }

    const categories: Category[] = categoriesFromDB.data;

    const total = Number(totalFromDB.data[0].count);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
        success: true,
        data: categories,
        pagination: {
            page,
            limit,
            total,
            totalPages
        }
    });
};

export const createCategory = async (req: Request, res: Response) => {
    const { name, description } = req.body;

    if (!name || !description) {
        res.status(400).json({
            success: false,
            error: {
                message: 'Category name and description are required'
            }
        });
        return;
    }

    const newCategoryFromDB = await addCategory(name, description);

    if (!newCategoryFromDB.success) {
        res.status(newCategoryFromDB.status || 500).json({ success: false, error: newCategoryFromDB.error });
        return;
    }

    const newCategory = newCategoryFromDB.data[0] as Category;

    res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: newCategory
    });
};

export const updateCategory = async (req: Request, res: Response) => {
    const { name, description } = req.body;

    if (!name || !description) {
        res.status(400).json({ success: false, message: 'Category name and description are required' });
        return;
    }

    const updatedCategoryFromDB = await updateCategoryDescription(name, description);

    if (!updatedCategoryFromDB.success) {
        res.status(updatedCategoryFromDB.status || 500).json({ success: false, error: updatedCategoryFromDB.error });
        return;
    }

    const updatedCategory = updatedCategoryFromDB.data[0] as Category;

    res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: updatedCategory
    });
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    if (!req.params || !req.params.name) {
        res.status(400).json({ success: false, error: { message: 'Category name is required' } });
        return;
    }

    const { name } = req.params;

    const categoryFromDB = await getCategoryByName(name);

    if (!categoryFromDB.success) {
        res.status(categoryFromDB.status || 500).json({ success: false, error: categoryFromDB.error });
        return;
    }

    const category = categoryFromDB.data[0] as Category;

    if (!category) {
        res.status(404).json({ success: false, error: categoryFromDB.error || 'Category not found' });
        return;
    }

    const eventFromDB = await getEventBasedOnCategory(name);

    if (!eventFromDB.success) {
        res.status(eventFromDB.status || 500).json({ success: false, error: eventFromDB.error });
        return;
    }

    const event = eventFromDB.data;

    if (event.length > 0) {
        res.status(400).json({
            success: false,
            error: { message: 'Cannot delete category with associated events' }
        });
        return;
    }

    const removedCategoryResponseFromDB = await removeCategory(name);

    if (!removedCategoryResponseFromDB.success) {
        res.status(removedCategoryResponseFromDB.status || 500).json({
            success: false,
            error: removedCategoryResponseFromDB.error
        });
        return;
    }

    res.status(200).json({
        success: true,
        message: 'Category deleted successfully'
    });
};