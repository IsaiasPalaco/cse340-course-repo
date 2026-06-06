import db from './db.js';

// Get all categories ordered alphabetically
const getAllCategories = async () => {
    const result = await db.query('SELECT * FROM category ORDER BY name ASC');
    return result.rows;
};

// Get category details by its primary key
const getCategoryById = async (categoryId) => {
    const result = await db.query('SELECT * FROM category WHERE category_id = $1', [categoryId]);
    return result.rows[0];
};

// FIXED: Changed c.id to c.category_id to match the database schema layout
const getCategoriesByProjectId = async (projectId) => {
    const queryText = `
        SELECT c.category_id, c.name FROM category c
        JOIN project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name ASC
    `;
    const result = await db.query(queryText, [projectId]);
    return result.rows;
};

// Get all projects associated with a specific category
const getProjectsByCategoryId = async (categoryId) => {
    const queryText = `
        SELECT sp.project_id, sp.title, sp.description, sp.location, sp.date 
        FROM service_project sp
        JOIN project_category pc ON sp.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY sp.date ASC
    `;
    const result = await db.query(queryText, [categoryId]);
    return result.rows;
};

export { 
    getAllCategories, 
    getCategoryById, 
    getCategoriesByProjectId, 
    getProjectsByCategoryId 
};