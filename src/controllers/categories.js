import { 
    getAllCategories, 
    getCategoryById, 
    getProjectsByCategoryId 
} from '../models/categories.js';

const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';
    res.render('categories', { title, categories });
};  

const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const categoryId = req.params.id;

        if (!/^\d+$/.test(categoryId)) {
            return res.status(400).render('errors/400', { title: 'Bad Request', message: 'Invalid Category ID.' });
        }

        const category = await getCategoryById(categoryId);
        
        if (!category) {
            return res.status(404).render('errors/404', { title: 'Not Found', message: 'Category not found.' });
        }

        const projects = await getProjectsByCategoryId(categoryId);

        res.render('category-details', { 
            title: category.name, 
            category, 
            projects 
        });
    } catch (error) {
        next(error);
    }
};

export { showCategoriesPage, showCategoryDetailsPage };