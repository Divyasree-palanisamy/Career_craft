-- Add comprehensive sample data for Career Platform

USE career_platform;

-- Insert more sample jobs
INSERT INTO jobs (title, company, location, job_type, experience_required, salary_min, salary_max, description, requirements, skills_required, benefits, status) VALUES
('Full Stack Developer', 'Tech Innovations', 'Bangalore', 'Full-time', 2, 700000, 1400000, 'Join our dynamic team to build cutting-edge web applications using modern technologies.', 'Bachelor degree in Computer Science or related field', 'React, Node.js, MongoDB, AWS', 'Health insurance, flexible hours, remote work', 'Active'),
('Data Analyst', 'Analytics Pro', 'Mumbai', 'Full-time', 1, 500000, 900000, 'Analyze large datasets to provide business insights and recommendations.', 'Bachelor degree in Statistics, Mathematics, or related field', 'Python, SQL, Excel, Tableau', 'Learning budget, mentorship program', 'Active'),
('UI/UX Designer', 'Design Studio', 'Delhi', 'Full-time', 2, 600000, 1100000, 'Create beautiful and intuitive user interfaces for our digital products.', 'Bachelor degree in Design or related field', 'Figma, Adobe Creative Suite, HTML, CSS', 'Creative freedom, design tools budget', 'Active'),
('DevOps Engineer', 'Cloud Solutions', 'Pune', 'Full-time', 3, 800000, 1500000, 'Manage and optimize our cloud infrastructure and CI/CD pipelines.', 'Bachelor degree in Computer Science', 'Docker, Kubernetes, AWS, Terraform', 'Certification support, conference attendance', 'Active'),
('Product Manager', 'Product Co', 'Hyderabad', 'Full-time', 4, 1000000, 1800000, 'Lead product development from conception to launch.', 'MBA or Bachelor degree with product experience', 'Agile, Scrum, Product Management tools', 'Stock options, leadership development', 'Active'),
('Mobile App Developer', 'App Masters', 'Chennai', 'Full-time', 2, 650000, 1200000, 'Develop native and cross-platform mobile applications.', 'Bachelor degree in Computer Science', 'React Native, Flutter, iOS, Android', 'Device allowance, app store credits', 'Active'),
('Cybersecurity Analyst', 'SecureTech', 'Bangalore', 'Full-time', 2, 700000, 1300000, 'Protect our systems and data from cyber threats.', 'Bachelor degree in Cybersecurity or related field', 'Security tools, penetration testing, compliance', 'Security training, certifications', 'Active'),
('Machine Learning Engineer', 'AI Solutions', 'Mumbai', 'Full-time', 3, 900000, 1600000, 'Build and deploy machine learning models for business applications.', 'Master degree in AI/ML or related field', 'Python, TensorFlow, PyTorch, MLOps', 'Research opportunities, GPU access', 'Active');

-- Insert more comprehensive courses
INSERT INTO courses (title, description, provider, duration_weeks, difficulty_level, skills_covered, course_url, price, rating) VALUES
('Python for Everybody', 'Complete Python programming course from beginner to advanced', 'Coursera', 16, 'Beginner', 'Python, Programming Fundamentals, Data Structures', 'https://www.coursera.org/specializations/python', 0, 4.8),
('CS50\'s Introduction to Computer Science', 'Harvard\'s famous computer science course', 'edX', 12, 'Beginner', 'C, Python, Algorithms, Data Structures', 'https://www.edx.org/course/introduction-computer-science-harvardx-cs50x', 0, 4.9),
('Machine Learning Course', 'Comprehensive machine learning course with hands-on projects', 'Coursera', 20, 'Intermediate', 'Machine Learning, Python, Scikit-learn, TensorFlow', 'https://www.coursera.org/learn/machine-learning', 0, 4.7),
('Web Development Bootcamp', 'Complete web development course covering frontend and backend', 'Udemy', 24, 'Beginner', 'HTML, CSS, JavaScript, React, Node.js', 'https://www.udemy.com/course/the-complete-web-developer-zero-to-mastery/', 2999, 4.6),
('Data Science Fundamentals', 'Learn data science from scratch with real-world projects', 'Coursera', 18, 'Intermediate', 'Python, Pandas, NumPy, Matplotlib, SQL', 'https://www.coursera.org/specializations/data-science-fundamentals', 0, 4.5),
('AWS Cloud Practitioner Essentials', 'Learn AWS cloud services and best practices', 'AWS Training', 8, 'Beginner', 'AWS, Cloud Computing, EC2, S3, RDS', 'https://aws.amazon.com/training/course-descriptions/cloud-practitioner/', 0, 4.4),
('Azure Fundamentals', 'Microsoft Azure cloud platform fundamentals', 'Microsoft Learn', 10, 'Beginner', 'Azure, Cloud Computing, Virtual Machines, Storage', 'https://docs.microsoft.com/en-us/learn/certifications/azure-fundamentals/', 0, 4.3),
('JavaScript Algorithms and Data Structures', 'Master JavaScript algorithms and data structures', 'freeCodeCamp', 14, 'Intermediate', 'JavaScript, Algorithms, Data Structures, Problem Solving', 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', 0, 4.8),
('Docker & Kubernetes Fundamentals', 'Containerization and orchestration with Docker and Kubernetes', 'Linux Academy', 12, 'Intermediate', 'Docker, Kubernetes, Containerization, DevOps', 'https://linuxacademy.com/course/docker-essentials/', 0, 4.6),
('SQL for Data Science', 'Learn SQL for data analysis and data science', 'Coursera', 8, 'Beginner', 'SQL, Database Design, Data Analysis, PostgreSQL', 'https://www.coursera.org/learn/sql-for-data-science', 0, 4.7),
('Git & GitHub Crash Course', 'Version control with Git and GitHub', 'YouTube', 4, 'Beginner', 'Git, GitHub, Version Control, Collaboration', 'https://www.youtube.com/watch?v=RGOj5yH7evk', 0, 4.5),
('Introduction to Cybersecurity', 'Cybersecurity fundamentals and best practices', 'Coursera', 12, 'Beginner', 'Cybersecurity, Network Security, Risk Management', 'https://www.coursera.org/learn/intro-cyber-security', 0, 4.4),
('React Basics', 'Learn React.js for building modern web applications', 'Scrimba', 10, 'Intermediate', 'React, JavaScript, JSX, Components, Hooks', 'https://scrimba.com/learn/learnreact', 0, 4.6),
('Node.js Essentials', 'Server-side JavaScript with Node.js', 'Udemy', 16, 'Intermediate', 'Node.js, Express, MongoDB, REST APIs', 'https://www.udemy.com/course/nodejs-essentials/', 1999, 4.5),
('MongoDB Basics', 'NoSQL database with MongoDB', 'MongoDB University', 8, 'Beginner', 'MongoDB, NoSQL, Database Design, CRUD Operations', 'https://university.mongodb.com/courses/M001/about', 0, 4.4),
('Data Structures & Algorithms in Java', 'Master data structures and algorithms using Java', 'Coursera', 20, 'Intermediate', 'Java, Data Structures, Algorithms, Problem Solving', 'https://www.coursera.org/specializations/data-structures-algorithms', 0, 4.7),
('Cloud Computing Concepts', 'Understanding cloud computing fundamentals', 'Coursera', 14, 'Beginner', 'Cloud Computing, AWS, Azure, GCP, Virtualization', 'https://www.coursera.org/learn/cloud-computing', 0, 4.3),
('Digital Marketing Fundamentals', 'Learn digital marketing strategies and tools', 'Google Digital Garage', 6, 'Beginner', 'Digital Marketing, SEO, Social Media, Analytics', 'https://learndigital.withgoogle.com/digitalgarage', 0, 4.2),
('Python for Data Analysis', 'Data analysis with Python and pandas', 'Coursera', 12, 'Intermediate', 'Python, Pandas, Data Analysis, Visualization', 'https://www.coursera.org/learn/python-for-data-analysis', 0, 4.6),
('Introduction to Linux', 'Linux operating system fundamentals', 'Linux Academy', 8, 'Beginner', 'Linux, Command Line, File System, Shell Scripting', 'https://linuxacademy.com/course/linux-essentials/', 0, 4.4);

-- Insert sample job applications
INSERT INTO job_applications (user_id, job_id, cover_letter, status) VALUES
(1, 1, 'I am very interested in this Software Engineer position. I have 2 years of experience in Python and JavaScript development.', 'Applied'),
(1, 2, 'I would love to work as a Data Scientist. I have strong background in machine learning and statistics.', 'Under Review'),
(1, 3, 'I am passionate about frontend development and have experience with React and Vue.js.', 'Shortlisted');

-- Insert sample user course progress
INSERT INTO user_course_progress (user_id, course_id, progress_percentage, status, started_at) VALUES
(1, 1, 75.5, 'In Progress', '2024-01-15 10:00:00'),
(1, 2, 100.0, 'Completed', '2024-01-01 09:00:00'),
(1, 3, 25.0, 'In Progress', '2024-02-01 14:00:00');

-- Insert sample recommendations
INSERT INTO recommendations (user_id, job_id, course_id, recommendation_type, score, reason) VALUES
(1, 1, NULL, 'job', 0.85, 'Your Python and JavaScript skills match this job perfectly'),
(1, NULL, 1, 'course', 0.90, 'This course will help you improve your Python skills'),
(1, 2, NULL, 'job', 0.75, 'Your data science background makes you a good fit for this role'),
(1, NULL, 3, 'course', 0.80, 'This machine learning course aligns with your career goals');

-- Update some existing data
UPDATE users SET role = 'admin' WHERE id = 1;

-- Insert more sample users
INSERT INTO users (username, email, password_hash, role) VALUES
('john_doe', 'john@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8/8K.8K.', 'user'),
('jane_smith', 'jane@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8/8K.8K.', 'user'),
('mike_wilson', 'mike@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8/8K.8K.', 'user');

-- Insert sample user profiles
INSERT INTO user_profiles (user_id, first_name, last_name, email, phone, highest_qualification, university, graduation_year, technical_skills, programming_languages, frameworks, database_skills, total_experience, career_interests, salary_expectation, work_mode) VALUES
(2, 'John', 'Doe', 'john@example.com', '9876543210', 'Bachelor of Technology', 'IIT Delhi', 2022, '["Web Development", "Data Analysis"]', '["Python", "JavaScript", "Java"]', '["React", "Django", "Spring"]', '["MySQL", "MongoDB", "PostgreSQL"]', 1, 'Software Development', 800000, 'Hybrid'),
(3, 'Jane', 'Smith', 'jane@example.com', '9876543211', 'Master of Science', 'IIM Bangalore', 2021, '["Data Science", "Machine Learning"]', '["Python", "R", "SQL"]', '["TensorFlow", "PyTorch", "Scikit-learn"]', '["PostgreSQL", "MongoDB"]', 2, 'Data Science', 1000000, 'Remote'),
(4, 'Mike', 'Wilson', 'mike@example.com', '9876543212', 'Bachelor of Engineering', 'NIT Surathkal', 2023, '["Mobile Development", "UI/UX"]', '["JavaScript", "Dart", "Swift"]', '["React Native", "Flutter", "iOS"]', '["Firebase", "SQLite"]', 0, 'Mobile Development', 600000, 'On-site');

-- Insert more job applications
INSERT INTO job_applications (user_id, job_id, cover_letter, status) VALUES
(2, 1, 'I am excited about this Full Stack Developer position. I have experience with React and Node.js.', 'Applied'),
(2, 4, 'I would love to work as a DevOps Engineer. I have experience with Docker and AWS.', 'Under Review'),
(3, 2, 'I am very interested in this Data Analyst role. I have strong analytical skills.', 'Shortlisted'),
(3, 8, 'I would like to apply for the Machine Learning Engineer position. I have ML experience.', 'Applied'),
(4, 6, 'I am passionate about mobile development and have experience with React Native.', 'Applied'),
(4, 3, 'I would love to work as a UI/UX Designer. I have design experience.', 'Under Review');

-- Insert more course progress
INSERT INTO user_course_progress (user_id, course_id, progress_percentage, status, started_at) VALUES
(2, 4, 60.0, 'In Progress', '2024-01-20 11:00:00'),
(2, 9, 100.0, 'Completed', '2024-01-10 10:00:00'),
(3, 3, 80.0, 'In Progress', '2024-01-25 15:00:00'),
(3, 5, 100.0, 'Completed', '2024-01-05 09:00:00'),
(4, 13, 40.0, 'In Progress', '2024-02-10 16:00:00'),
(4, 14, 100.0, 'Completed', '2024-01-30 14:00:00');

-- Insert more recommendations
INSERT INTO recommendations (user_id, job_id, course_id, recommendation_type, score, reason) VALUES
(2, 1, NULL, 'job', 0.88, 'Your full-stack development skills are perfect for this role'),
(2, NULL, 4, 'course', 0.85, 'This web development course will enhance your skills'),
(3, 2, NULL, 'job', 0.92, 'Your data science background makes you ideal for this position'),
(3, NULL, 3, 'course', 0.90, 'This machine learning course will advance your career'),
(4, 6, NULL, 'job', 0.87, 'Your mobile development skills match this job perfectly'),
(4, NULL, 13, 'course', 0.83, 'This React course will help you become a better developer');

COMMIT;
