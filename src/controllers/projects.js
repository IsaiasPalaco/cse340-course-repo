import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllProjects, getProjectById } from '../models/projects.js';

const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getAllProjects();
        const title = 'Service Projects';

        res.render('projects', { title, projects });
    } catch (error) {
        next(error);
    }
};  

const showProjectDetailsPage = async (req, res, next) => {
    try {
        const projectId = req.params.id;

        if (!/^\d+$/.test(projectId)) {
            return res.status(400).render('errors/400', { 
                title: 'Bad Request', 
                message: 'Invalid Project ID.' 
            });
        }

        const project = await getProjectById(projectId);

        if (!project) {
            return res.status(404).render('errors/404', { 
                title: 'Not Found', 
                message: 'Project not found.' 
            });
        }

        const categories = await getCategoriesByProjectId(projectId);
        
        res.render('project', { 
            title: project.title, 
            project, 
            categories 
        });
    } catch (error) {
        next(error);
    }
};

export { showProjectsPage, showProjectDetailsPage };