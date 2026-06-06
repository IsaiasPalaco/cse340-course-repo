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

// NOVA FUNÇÃO ADICIONADA: Busca um único projeto por ID trazendo também o nome da organização parceira
const getProjectById = async (projectId) => {
    const query = `
        SELECT sp.*, o.name AS organization_name 
        FROM service_project sp
        JOIN organization o ON sp.organization_id = o.organization_id
        WHERE sp.project_id = $1;
    `;
    
    const result = await db.query(query, [projectId]);
    return result.rows[0]; // Retorna apenas o primeiro objeto encontrado (ou undefined)
};

// Export the model functions (Incluindo a nova função no export)
export { 
    getAllProjects, 
    getProjectsByOrganizationId, 
    getProjectById 
};