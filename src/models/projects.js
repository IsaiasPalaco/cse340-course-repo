import db from './db.js';

const getAllProjects = async () => {
    const query = `
        SELECT sp.*, o.name AS organization_name 
        FROM service_project sp
        JOIN organization o ON sp.organization_id = o.organization_id
        ORDER BY sp.date ASC;
    `;
    
    const result = await db.query(query);
    return result.rows;
};

export { getAllProjects };