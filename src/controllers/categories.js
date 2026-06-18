import { getProjectById } from '../models/projects.js';
import { getAllCategories, getCategoriesByProjectId, updateCategoryAssignments, createCategory, updateCategory, getCategoryById } from '../models/categories.js';
import { body, validationResult } from 'express-validator';



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

// Validation rules array for categories (Minimum 3 characters, Maximum 100 characters)
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required.')
        .isLength({ min: 3, max: 100 }).withMessage('The category name must be more than 3 characters long.')
];

/**
 * Displays the form to create a new category.
 */
const showNewCategoryForm = async (req, res) => {
    const title = 'Add New Category';
    res.render('new-category', { title });
};

/**
 * Processes incoming form submissions for a new category.
 */
const processNewCategoryForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-category');
    }

    const { name } = req.body;

    try {
        await createCategory(name);
        req.flash('success', 'New category created successfully!');
        res.redirect('/categories');
    } catch (error) {
        console.error('Error creating category:', error);
        req.flash('error', 'There was an error creating the category.');
        res.redirect('/new-category');
    }
};

/**
 * Displays the form to edit an existing category.
 */
const showEditCategoryForm = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const categoryData = await getCategoryById(categoryId);

        if (!categoryData) {
            return res.status(404).render('errors/404', { 
                title: 'Not Found', 
                message: 'Category not found.' 
            });
        }

        const title = `Edit Category: ${categoryData.name}`;
        res.render('update-category', { title, category: categoryData });
    } catch (error) {
        next(error);
    }
};

/**
 * Processes updates for an existing category.
 */
const processEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-category/${categoryId}`);
    }

    const { name } = req.body;

    try {
        await updateCategory(categoryId, name);
        req.flash('success', 'Category updated successfully!');
        res.redirect('/categories');
    } catch (error) {
        console.error('Error updating category:', error);
        req.flash('error', 'There was an error updating the category.');
        res.redirect(`/edit-category/${categoryId}`);
    }
};

export { 
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm, 
    processAssignCategoriesForm,
    categoryValidation,        
    showNewCategoryForm,       
    processNewCategoryForm,    
    showEditCategoryForm,      
    processEditCategoryForm    
};

