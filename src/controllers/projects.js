import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllProjects, getProjectById, createProject } from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
// Import functions from express-validator
import { body, validationResult } from 'express-validator';

// Validation rules array for service projects
const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Project title is required.')
        .isLength({ min: 3, max: 200 }).withMessage('The title must be between 3 and 200 characters.'),
    
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required.')
        .isLength({ max: 1000 }).withMessage('The description cannot exceed 1000 characters.'),
    
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required.')
        .isLength({ max: 200 }).withMessage('The location cannot exceed 200 characters.'),
    
    body('date')
        .notEmpty().withMessage('Date is required.')
        .isISO8601().withMessage('Invalid date format.'),
    
    body('organizationId')
        .notEmpty().withMessage('Organization selection is required.')
        .isInt().withMessage('Invalid organization ID.')
];

/**
 * Renders the list page containing all service projects.
 */
const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getAllProjects();
        const title = 'Service Projects';

        res.render('projects', { title, projects });
    } catch (error) {
        next(error);
    }
};  

/**
 * Renders the detailed view page for a specific service project.
 */
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

/**
 * Displays the form to append a new service project.
 */
const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
}

/**
 * Processes incoming form submissions for new service projects.
 */
const processNewProjectForm = async (req, res) => {
    // Check for validation errors (Following the professor's exact instruction)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new project form
        return res.redirect('/new-project');
    }

    // Extract form data from req.body
    const { title, description, location, date, organizationId } = req.body;

    try {
        // Create the new project in the database
        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
};

// Export the validation array along with the controller methods
export { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, projectValidation };
