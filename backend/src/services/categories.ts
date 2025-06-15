import { query } from "../utils/db";
import { Category, TotalCount } from "../types/types";


export const getCategoriesWithPagination = async (offset: number = 0, limit?: number) => {
    let queryText = "SELECT * FROM categories";
    if (limit) {
        queryText += ` LIMIT ${limit} OFFSET ${offset}`;
    }

    const categories: Category[] = await query(queryText);

    const total: TotalCount[] = await query("SELECT COUNT(*) FROM categories");

    return { categories, total: Number(total[0].count) };
};

export const addCategory = async (name: string, description: string): Promise<Category> => {
    const queryText = "INSERT INTO categories (name, description) VALUES ($1, $2)";
    const values = [name, description];

    const result: Category[] = await query(queryText, values);
    return result[0];
};

export const updateCategoryDescription = async (name:string, newDescription: string): Promise<Category> => {
    const queryText = "UPDATE categories SET description = $1 WHERE name = $2 RETURNING *";
    const values = [newDescription, name];

    const result: Category[] = await query(queryText, values);
    if (result.length === 0) {
        throw new Error("Category not found");
    }
    return result[0];
}

export const removeCategory = async (name: string): Promise<void> => {
    const queryText = "DELETE FROM categories WHERE name = $1";
    const values = [name];

    await query(queryText, values);
}

export const getCategoryByName = async (name: string): Promise<Category | null> => {
    const queryText = "SELECT * FROM categories WHERE name = $1";
    const values = [name];

    const result: Category[] = await query(queryText, values);
    return result.length > 0 ? result[0] : null;
}