import db from './db.js';

/**
 * Retrieves all service projects alongside their partner organization names.
 * Sorted by project date in ascending order.
 */
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

/**
 * Retrieves all service projects associated with a specific organization ID.
 */
const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          date
        FROM service_project
        WHERE organization_id = $1
        ORDER BY date;
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      return result.rows;
};

/**
 * Retrieves a single service project by its unique project ID.
 * Includes the partner organization's name.
 */
const getProjectById = async (projectId) => {
    const query = `
        SELECT sp.*, o.name AS organization_name 
        FROM service_project sp
        JOIN organization o ON sp.organization_id = o.organization_id
        WHERE sp.project_id = $1;
    `;
    
    const result = await db.query(query, [projectId]);
    return result.rows[0]; // Returns only the first object found (or undefined)
};

/**
 * Inserts a new service project record into the database.
 */
const createProject = async (title, description, location, date, organizationId) => {
    const query = `
      INSERT INTO service_project (title, description, location, date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
}

/**
 * Updates an existing service project record in the database.
 * Ensures the project can be linked to a different organization if modified.
 */
const updateProject = async (projectId, title, description, location, date, organizationId) => {
    const query = `
        UPDATE service_project
        SET title = $1, description = $2, location = $3, date = $4, organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId, projectId];
    const result = await db.query(query, queryParams);

    // If no row matches the given projectId, throw an Error
    if (result.rows.length === 0) {
        throw new Error('Failed to update project. Project not found.');
    }

    return result.rows[0].project_id;
};


export { 
    getAllProjects, 
    getProjectsByOrganizationId, 
    getProjectById,
    createProject,
    updateProject
};

