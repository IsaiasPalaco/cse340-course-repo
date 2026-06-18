import db from './db.js';

/**
 * Retrieves all categories from the database.
 */
const getAllCategories = async () => {
    const query = `
        SELECT category_id, name 
        FROM category 
        ORDER BY name ASC;
    `;
    const result = await db.query(query);
    return result.rows;
};

/**
 * Retrieves all categories assigned to a specific project.
 */
const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.* 
        FROM category c
        JOIN project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name ASC;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
};

/**
 * Links a single category to a specific service project in the pivot table.
 * Used internally by updateCategoryAssignments.
 */
const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;
    await db.query(query, [categoryId, projectId]);
};

/**
 * Updates the categories assigned to a service project.
 * Clears old associations first, then populates new selections.
 */
const updateCategoryAssignments = async (projectId, categoryIds) => {
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
};

/**
 * Inserts a new category record into the database.
 */
const createCategory = async (name) => {
    const query = `
        INSERT INTO category (name)
        VALUES ($1)
        RETURNING category_id;
    `;
    const result = await db.query(query, [name]);
    
    if (result.rows.length === 0) {
        throw new Error('Failed to create category.');
    }
    return result.rows[0].category_id;
};

/**
 * Updates an existing category record name in the database by ID.
 */
const updateCategory = async (categoryId, name) => {
    const query = `
        UPDATE category
        SET name = $1
        WHERE category_id = $2
        RETURNING category_id;
    `;
    const result = await db.query(query, [name, categoryId]);

    if (result.rows.length === 0) {
        throw new Error('Failed to update category. Category not found.');
    }
    return result.rows[0].category_id;
};

/**
 * Retrieves a single category record by its unique ID.
 */
const getCategoryById = async (categoryId) => {
    const query = `
        SELECT category_id, name
        FROM category
        WHERE category_id = $1;
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows[0];
};

export {
    getAllCategories,
    getCategoriesByProjectId,
    updateCategoryAssignments,
    createCategory,     
    updateCategory,      
    getCategoryById      
};
