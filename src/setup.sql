-- =====================================================================
-- 1. CLEANUP EXISTING STRUCTURES (Prevents "relation already exists" errors)
-- =====================================================================
DROP TABLE IF EXISTS project_category CASCADE;
DROP TABLE IF EXISTS service_project CASCADE;
DROP TABLE IF EXISTS category CASCADE;
DROP TABLE IF EXISTS organization CASCADE;

-- =====================================================================
-- 2. TABLE DATABASE SCHEMA SCRIPT
-- =====================================================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organization(organization_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL
);

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Pivot table handling the Many-to-Many relationship between projects and categories
CREATE TABLE project_category (
    project_id INTEGER REFERENCES service_project(project_id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES category(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

-- =====================================================================
-- 3. SEED DATA INSERTIONS
-- =====================================================================
INSERT INTO organization (name, description, contact_email, logo_filename) VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

INSERT INTO service_project (organization_id, title, description, location, date) VALUES
(1, 'Park Bench Install', 'Building benches for local park.', 'Central Park', '2026-06-15'),
(1, 'Playground Repair', 'Fixing safety hazards in playground.', 'Oak Street Park', '2026-06-20'),
(1, 'Community Garden Shed', 'Constructing a storage shed.', 'Main St Garden', '2026-07-01'),
(1, 'Bus Stop Shelter', 'Installing weather protection.', 'North Ave', '2026-07-10'),
(1, 'Library Ramp', 'Building handicap access.', 'City Library', '2026-07-15'),
(2, 'Urban Garden Planting', 'Planting seasonal vegetables.', 'West Side Plot', '2026-06-12'),
(2, 'Composting Workshop', 'Teaching locals how to compost.', 'Community Hall', '2026-06-18'),
(2, 'School Garden Setup', 'Setting up irrigation for school.', 'Lincoln Elementary', '2026-06-25'),
(2, 'Seed Exchange Fair', 'Trading heirloom seeds.', 'City Square', '2026-07-05'),
(2, 'Farmers Market Prep', 'Helping farmers set up stalls.', 'Downtown', '2026-07-12'),
(3, 'Food Drive Sorting', 'Sorting donations for pantry.', 'Warehouse B', '2026-06-14'),
(3, 'Senior Living Center', 'Reading and activities for seniors.', 'Senior Living Center', '2026-06-22'),
(3, 'After School Tutoring', 'Math and reading help.', 'Youth Center', '2026-07-02'),
(3, 'Blood Drive Support', 'Helping register donors.', 'Red Cross Center', '2026-07-08'),
(3, 'Charity Fun Run', 'Staffing water stations.', 'City Park', '2026-07-20');

INSERT INTO category (name) VALUES 
('Environmental'), 
('Educational'), 
('Community Service');

-- =====================================================================
-- 4. DYNAMIC RELATIONSHIP MAPPING (No Hardcoded IDs)
-- =====================================================================

-- Map projects belonging to 'Environmental' category (ID: 1)
INSERT INTO project_category (project_id, category_id)
SELECT project_id, 1 FROM service_project 
WHERE title IN ('Urban Garden Planting', 'Composting Workshop', 'School Garden Setup');

-- Map projects belonging to 'Educational' category (ID: 2)
INSERT INTO project_category (project_id, category_id)
SELECT project_id, 2 FROM service_project 
WHERE title IN ('Composting Workshop', 'After School Tutoring');

-- Map projects belonging to 'Community Service' category (ID: 3)
INSERT INTO project_category (project_id, category_id)
SELECT project_id, 3 FROM service_project 
WHERE title IN ('Park Bench Install', 'Playground Repair', 'Food Drive Sorting', 'Senior Living Center');

-- =====================================================================
-- 5. VALIDATION QUERIES (Optional audit to verify data population)
-- =====================================================================
SELECT pc.category_id, c.name AS category_name, sp.title AS project_title 
FROM project_category pc
JOIN service_project sp ON pc.project_id = sp.project_id
JOIN category c ON pc.category_id = c.category_id
ORDER BY pc.category_id ASC;