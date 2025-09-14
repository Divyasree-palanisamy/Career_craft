CREATE DATABASE career_platform;
use career_platform;

ALTER TABLE user_profiles
ADD COLUMN database_skills TEXT AFTER frameworks;




-- Add the missing user_resumes table
CREATE TABLE IF NOT EXISTS user_resumes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    resume_name VARCHAR(255) NOT NULL,
    resume_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
select * from users;
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    date_of_birth DATE,
    gender ENUM('Male', 'Female', 'Other'),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50),
    pincode VARCHAR(10),
    
    -- Academic Information
    highest_qualification VARCHAR(100),
    university VARCHAR(100),
    graduation_year INT,
    cgpa DECIMAL(3,2),
    field_of_study VARCHAR(100),
    
    -- Skills and Ratings
    technical_skills TEXT,
    soft_skills TEXT,
    programming_languages TEXT,
    frameworks TEXT,
    database_skills TEXT,
    tools TEXT,
    
    -- Experience
    total_experience INT DEFAULT 0,
    internships TEXT,
    projects TEXT,
    certifications TEXT,
    
    -- Interests and Preferences
    career_interests TEXT,
    preferred_locations TEXT,
    salary_expectation INT,
    work_mode ENUM('Remote', 'On-site', 'Hybrid'),
    
    -- Tech Stack
    tech_stack TEXT,
    batch_semester VARCHAR(20),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    company VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    job_type ENUM('Full-time', 'Part-time', 'Contract', 'Internship') DEFAULT 'Full-time',
    experience_required INT DEFAULT 0,
    salary_min INT,
    salary_max INT,
    description TEXT,
    requirements TEXT,
    skills_required TEXT,
    benefits TEXT,
    application_deadline DATE,
    status ENUM('Active', 'Closed', 'Draft') DEFAULT 'Active',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Job applications table
CREATE TABLE IF NOT EXISTS job_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    job_id INT NOT NULL,
    resume_path VARCHAR(255),
    cover_letter TEXT,
    status ENUM('Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Accepted') DEFAULT 'Applied',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    UNIQUE KEY unique_application (user_id, job_id)
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    provider VARCHAR(100),
    duration_weeks INT,
    difficulty_level ENUM('Beginner', 'Intermediate', 'Advanced'),
    skills_covered TEXT,
    course_url VARCHAR(500),
    price DECIMAL(10,2) DEFAULT 0,
    rating DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User course progress table
CREATE TABLE IF NOT EXISTS user_course_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    completed_modules TEXT,
    current_module INT DEFAULT 1,
    status ENUM('Not Started', 'In Progress', 'Completed') DEFAULT 'Not Started',
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    certificate_path VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_progress (user_id, course_id)
);

-- Recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    job_id INT,
    course_id INT,
    recommendation_type ENUM('job', 'course') NOT NULL,
    score DECIMAL(5,4),
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO jobs (title, company, location, job_type, experience_required, salary_min, salary_max, description, requirements, skills_required, status) VALUES
('Software Engineer', 'Tech Corp', 'Bangalore', 'Full-time', 2, 600000, 1200000, 'We are looking for a skilled software engineer to join our team.', 'Bachelor degree in Computer Science or related field', 'Python, JavaScript, React, Node.js', 'Active'),
('Data Scientist', 'Data Analytics Inc', 'Mumbai', 'Full-time', 3, 800000, 1500000, 'Join our data science team to work on exciting ML projects.', 'Master degree in Data Science or related field', 'Python, Machine Learning, SQL, Statistics', 'Active'),
('Frontend Developer', 'Web Solutions', 'Delhi', 'Full-time', 1, 400000, 800000, 'Create amazing user interfaces for our web applications.', 'Bachelor degree in Computer Science', 'HTML, CSS, JavaScript, React, Vue.js', 'Active'),
('Backend Developer', 'API Masters', 'Pune', 'Full-time', 2, 500000, 1000000, 'Build robust backend systems and APIs.', 'Bachelor degree in Computer Science', 'Python, Django, PostgreSQL, AWS', 'Active'),
('DevOps Engineer', 'Cloud Tech', 'Hyderabad', 'Full-time', 3, 700000, 1300000, 'Manage our cloud infrastructure and deployment pipelines.', 'Bachelor degree in Computer Science', 'Docker, Kubernetes, AWS, Linux', 'Active');

INSERT INTO courses (title, description, provider, duration_weeks, difficulty_level, skills_covered, course_url, price, rating) VALUES
('Complete Python Bootcamp', 'Learn Python from scratch to advanced level', 'Udemy', 12, 'Beginner', 'Python, OOP, Data Structures', 'https://udemy.com/python-bootcamp', 2999, 4.5),
('Machine Learning Fundamentals', 'Introduction to ML algorithms and techniques', 'Coursera', 16, 'Intermediate', 'Python, Scikit-learn, TensorFlow', 'https://coursera.org/ml-fundamentals', 0, 4.7),
('React Development', 'Build modern web applications with React', 'GeeksforGeeks', 8, 'Intermediate', 'React, JavaScript, HTML, CSS', 'https://geeksforgeeks.org/react-course', 1999, 4.3),
('Data Science with Python', 'Complete data science course with Python', 'Udemy', 20, 'Advanced', 'Python, Pandas, NumPy, Matplotlib', 'https://udemy.com/data-science-python', 3999, 4.6),
('AWS Cloud Practitioner', 'Learn AWS cloud services and deployment', 'Coursera', 10, 'Beginner', 'AWS, Cloud Computing, EC2, S3', 'https://coursera.org/aws-practitioner', 0, 4.4);
