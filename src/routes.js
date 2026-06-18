import express from 'express';

import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage, showOrganizationDetailsPage, showNewOrganizationForm, processNewOrganizationForm, organizationValidation, showEditOrganizationForm, processEditOrganizationForm } from './controllers/organizations.js';
import { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, projectValidation, showEditProjectForm, processEditProjectForm } from './controllers/projects.js';
import { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm, categoryValidation, showNewCategoryForm, processNewCategoryForm, showEditCategoryForm, processEditCategoryForm } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

// Home
router.get('/', showHomePage);

// Organizations
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/new-organization', showNewOrganizationForm);
router.get('/edit-organization/:id', showEditOrganizationForm);

// Projects
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/new-project', showNewProjectForm);
router.post('/new-project', projectValidation, processNewProjectForm);

// Routes to handle editing an existing project
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', projectValidation, processEditProjectForm);


// Categories
router.get('/categories', showCategoriesPage);
router.get('/new-category', showNewCategoryForm);
router.post('/new-category', categoryValidation, processNewCategoryForm);
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);
router.get('/edit-category/:id', showEditCategoryForm);
router.post('/edit-category/:id', categoryValidation, processEditCategoryForm);
router.get('/category/:id', showCategoryDetailsPage); 


// Error-handling routes
router.get('/test-error', testErrorPage);

// Form processing routes
router.post('/new-organization', organizationValidation, processNewOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

export default router;
