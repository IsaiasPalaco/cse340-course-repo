import { getProjectById } from '../models/projects.js';
import { getAllCategories, getCategoriesByProjectId, updateCategoryAssignments } from '../models/categories.js';

/**
 * Renders the category overview page.
 */
const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        const title = 'Categories';
        res.render('categories', { title, categories });
    } catch (error) {
        next(error);
    }
};

/**
 * Renders the detailed view page for a specific category.
 */
const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        // Fetch projects or categories details depending on your implementation
        const title = 'Category Details';
        res.render('category', { title, categoryId });
    } catch (error) {
        next(error);
    }
};

/**
 * Displays the form to assign categories to a specific project.
 */
const showAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;

        // Fetch project and category information safely
        const projectDetails = await getProjectById(projectId);
        const categories = await getAllCategories();
        const assignedCategories = await getCategoriesByProjectId(projectId);

        const title = 'Assign Categories to Project';

        res.render('assign-categories', { 
            title, 
            projectId, 
            projectDetails, 
            categories, 
            assignedCategories 
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Processes the category assignment checklist form submission.
 */
const processAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        
        // Extract checked category IDs from the form body checkpoints
        const selectedCategoryIds = req.body.categoryIds || [];
        
        // Ensure inputs are always safely wrapped inside an array structure
        const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
        
        await updateCategoryAssignments(projectId, categoryIdsArray);
        
        req.flash('success', 'Categories updated successfully.');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        next(error);
    }
};

// Export all the category controller methods
export { 
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm, 
    processAssignCategoriesForm 
};
