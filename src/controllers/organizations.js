// Import any needed model functions
import { getAllOrganizations, getOrganizationDetails, createOrganization } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

// Define any controller functions
const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
};

const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);
    const title = 'Organization Details';

    res.render('organization', {title, organizationDetails, projects});
};

const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';

    res.render('new-organization', { title });
}

const processNewOrganizationForm = async (req, res) => {
    try {
        const { name, description, contactEmail } = req.body;
        const logoFilename = 'placeholder-logo.png'; 

        // 1. Create the organization in the database
        const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
        
        // 2. Set the flash message FIRST (before responding to the client)
        req.flash('success', 'Organization added successfully!');
        
        // 3. Redirect EXACTLY ONCE and use 'return' to stop execution here
        return res.redirect(`/organization/${organizationId}`);

    } catch (error) {
        console.error("Error occurred:", error);
        // Optional error handling: re-render the form showing the failure
        return res.status(500).render('new-organization', { 
            title: 'Add New Organization', 
            error: 'Failed to create organization.' 
        });
    }
};


// Export any controller functions
export { showOrganizationsPage, showOrganizationDetailsPage, showNewOrganizationForm, processNewOrganizationForm };