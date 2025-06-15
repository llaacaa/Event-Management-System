import { Request, Response } from 'express';
import {
    addCategory,
    getCategoriesWithPagination, getCategoryByName,
    removeCategory,
    updateCategoryDescription
} from "../services/categories";
import { getEventBasedOnCategory } from "../services/events";

export const getCategories = async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const categoryInfo = await getCategoriesWithPagination(offset, limit);

    const { categories, total } = categoryInfo;

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

export const createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            res.status(400).json({ success: false, message: 'Category name and description are required' });
            return;
        }

        const newCategory = await addCategory(name, description);

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: newCategory
        });
    } catch (error) {
        if (error instanceof Error && error.message.includes('duplicate')) {
            res.status(409).json({
                success: false,
                message: 'A category with this name already exists',
                error: error.message
            });
            return;
        }

        console.error('Error creating category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create category',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            res.status(400).json({ success: false, message: 'Category name and description are required' });
            return;
        }

        const updatedCategory = await updateCategoryDescription(name, description);

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: updatedCategory
        });
    } catch (error) {
        console.error(`Error updating category ${req.params.id}:`, error);
        res.status(500).json({
            success: false,
            message: 'Failed to update category',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.params;

        if (!name) {
            res.status(400).json({ success: false, message: 'Category name is required' });
            return;
        }

        const category = await getCategoryByName(name);

        if (!category) {
            res.status(404).json({ success: false, message: 'Category not found' });
            return;
        }

        const event = await getEventBasedOnCategory(name);

        if (event) {
            res.status(400).json({
                success: false,
                message: 'Cannot delete category with associated events'
            });
            return;
        }

        await removeCategory(name);

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.error(`Error deleting category ${req.params.id}:`, error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete category',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};