import db from './db.js';
const getAllCategories = async () => {
    const result = await db.query('SELECT * FROM category ORDER BY name ASC');
    return result.rows;
};
export { getAllCategories };