import { query } from "../utils/db";

export const getCategoriesWithPagination = async (offset: number = 0, limit?: number) => {
    let queryText = "SELECT * FROM categories";
    if (limit) {
        queryText += ` LIMIT ${limit} OFFSET ${offset}`;
    }

    const categoriesFromDB = await query(queryText);

    const totalFromDB = await query("SELECT COUNT(*) FROM categories");
    return { categoriesFromDB, totalFromDB };
};

export const addCategory = (name: string, description: string) => {
    const queryText = "INSERT INTO categories (name, description) VALUES ($1, $2)";
    const values = [name, description];

    return query(queryText, values);
};

export const updateCategoryDescription = (name: string, newDescription: string) => {
    const queryText = "UPDATE categories SET description = $1 WHERE name = $2 RETURNING *";
    const values = [newDescription, name];

    return query(queryText, values);
};

export const removeCategory = (name: string) => {
    const queryText = "DELETE FROM categories WHERE name = $1";
    const values = [name];

    return query(queryText, values);
};

export const getCategoryByName = (name: string) => {
    const queryText = "SELECT * FROM categories WHERE name = $1";
    const values = [name];

    return query(queryText, values);
};