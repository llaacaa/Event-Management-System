import { Request, Response } from 'express';

/**
 * Get all categories with pagination
 */
export const getCategories = async (req: Request, res: Response): Promise<void> => {
    // Extract pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    // TODO: Query categories from database with pagination
    // const { categories, count } = await yourCategoryService.getCategories(limit, offset);

    res.status(200).json({
        success: true,
        data: [], // Will be replaced with actual categories
        pagination: {
            page,
            limit,
            total: 0, // Will be total count
            totalPages: 0 // Will be calculated from total/limit
        }
    });
};

/**
 * Create a new category
 */
export const createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description } = req.body;

        // Basic validation
        if (!name) {
            res.status(400).json({ success: false, message: 'Category name is required' });
            return;
        }

        // TODO: Insert category into database
        // const newCategory = await yourCategoryService.createCategory({ name, description });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: { name, description }
        });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create category',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Update an existing category
 */
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        // Basic validation
        if (!name) {
            res.status(400).json({ success: false, message: 'Category name is required' });
            return;
        }

        // TODO: Update category in database
        // const updatedCategory = await yourCategoryService.updateCategory(id, { name, description });
        // if (!updatedCategory) {
        //   res.status(404).json({ success: false, message: 'Category not found' });
        //   return;
        // }

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: { id, name, description }
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

/**
 * Delete a category
 */
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // TODO: Check if category exists and if there are any events with this category
        // TODO: Delete category from database if no associated events

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