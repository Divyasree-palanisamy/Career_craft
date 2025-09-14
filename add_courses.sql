-- Add 10+ Real Free Courses to Database
USE career_platform;

-- Clear existing courses first
DELETE FROM courses;

-- Insert real free courses from various platforms
INSERT INTO courses (title, description, provider, duration_weeks, difficulty_level, skills_covered, course_url, price, rating) VALUES

-- Coursera Free Courses
('Python for Everybody Specialization', 'Learn Python programming from basics to advanced concepts. Covers Python fundamentals, data structures, web development, and databases.', 'Coursera (University of Michigan)', 20, 'Beginner', 'Python, Data Structures, Web Development, SQL, Databases', 'https://www.coursera.org/specializations/python', 0, 4.8),

('Machine Learning Course', 'Andrew Ng''s famous machine learning course covering supervised learning, unsupervised learning, and best practices.', 'Coursera (Stanford)', 11, 'Intermediate', 'Machine Learning, Python, Octave, Statistics, Algorithms', 'https://www.coursera.org/learn/machine-learning', 0, 4.9),

('Google Data Analytics Certificate', 'Learn data analysis skills including SQL, R programming, data visualization, and statistical analysis.', 'Coursera (Google)', 26, 'Beginner', 'SQL, R Programming, Data Visualization, Statistics, Tableau', 'https://www.coursera.org/professional-certificates/google-data-analytics', 0, 4.7),

('IBM Data Science Professional Certificate', 'Comprehensive data science program covering Python, SQL, machine learning, and data analysis.', 'Coursera (IBM)', 20, 'Beginner', 'Python, SQL, Machine Learning, Data Analysis, Jupyter', 'https://www.coursera.org/professional-certificates/ibm-data-science', 0, 4.6),

-- Harvard CS50 Courses
('CS50''s Introduction to Computer Science', 'Harvard''s introduction to computer science and programming. Learn algorithms, data structures, and problem-solving.', 'Harvard University (edX)', 12, 'Beginner', 'C, Python, SQL, Algorithms, Data Structures, Web Development', 'https://www.edx.org/course/introduction-computer-science-harvardx-cs50x', 0, 4.9),

('CS50''s Web Programming with Python and JavaScript', 'Learn web development with Python, JavaScript, and SQL using frameworks like Django, React, and Bootstrap.', 'Harvard University (edX)', 12, 'Intermediate', 'Python, JavaScript, Django, React, SQL, HTML, CSS', 'https://www.edx.org/course/cs50s-web-programming-with-python-and-javascript', 0, 4.8),

-- FreeCodeCamp Courses
('Responsive Web Design', 'Learn HTML, CSS, and JavaScript to build responsive websites. Includes modern CSS techniques and accessibility.', 'FreeCodeCamp', 30, 'Beginner', 'HTML, CSS, JavaScript, Responsive Design, Accessibility', 'https://www.freecodecamp.org/learn/responsive-web-design/', 0, 4.7),

('JavaScript Algorithms and Data Structures', 'Master JavaScript fundamentals including ES6, regular expressions, debugging, and data structures.', 'FreeCodeCamp', 30, 'Beginner', 'JavaScript, ES6, Algorithms, Data Structures, Regular Expressions', 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', 0, 4.8),

('Front End Development Libraries', 'Learn React, Redux, jQuery, Bootstrap, and Sass to build modern web applications.', 'FreeCodeCamp', 25, 'Intermediate', 'React, Redux, jQuery, Bootstrap, Sass, Frontend Development', 'https://www.freecodecamp.org/learn/front-end-development-libraries/', 0, 4.6),

('Back End Development and APIs', 'Learn Node.js, Express, MongoDB, and API development to build server-side applications.', 'FreeCodeCamp', 25, 'Intermediate', 'Node.js, Express, MongoDB, APIs, Backend Development', 'https://www.freecodecamp.org/learn/back-end-development-and-apis/', 0, 4.5),

-- AWS Free Courses
('AWS Cloud Practitioner Essentials', 'Learn AWS cloud fundamentals and prepare for the AWS Cloud Practitioner certification exam.', 'AWS Training', 4, 'Beginner', 'AWS, Cloud Computing, EC2, S3, RDS, CloudFormation', 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/', 0, 4.5),

('AWS Technical Essentials', 'Deep dive into AWS services including compute, storage, databases, and networking.', 'AWS Training', 6, 'Intermediate', 'AWS, EC2, S3, RDS, VPC, CloudWatch, IAM', 'https://aws.amazon.com/training/course-descriptions/aws-technical-essentials/', 0, 4.6),

-- Microsoft Learn Courses
('Azure Fundamentals', 'Learn cloud concepts, Azure services, security, privacy, compliance, and pricing.', 'Microsoft Learn', 8, 'Beginner', 'Azure, Cloud Computing, Security, Compliance, Pricing', 'https://docs.microsoft.com/en-us/learn/paths/azure-fundamentals/', 0, 4.4),

('Python for Beginners', 'Learn Python programming from scratch with hands-on exercises and real-world examples.', 'Microsoft Learn', 10, 'Beginner', 'Python, Programming, Data Types, Functions, OOP', 'https://docs.microsoft.com/en-us/learn/paths/python-language/', 0, 4.3),

-- MIT OpenCourseWare
('Introduction to Computer Science and Programming', 'MIT''s introductory computer science course covering Python programming and computational thinking.', 'MIT OpenCourseWare', 16, 'Beginner', 'Python, Computer Science, Algorithms, Problem Solving', 'https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/', 0, 4.9),

-- Khan Academy
('Computer Programming', 'Learn JavaScript, HTML/CSS, and SQL through interactive programming challenges.', 'Khan Academy', 12, 'Beginner', 'JavaScript, HTML, CSS, SQL, Programming Fundamentals', 'https://www.khanacademy.org/computing/computer-programming', 0, 4.2),

-- Udacity Free Courses
('Intro to Machine Learning', 'Learn machine learning fundamentals including supervised and unsupervised learning algorithms.', 'Udacity', 8, 'Intermediate', 'Machine Learning, Python, Scikit-learn, Pandas, NumPy', 'https://www.udacity.com/course/intro-to-machine-learning--ud120', 0, 4.4),

-- Google Digital Garage
('Fundamentals of Digital Marketing', 'Learn digital marketing essentials including SEO, SEM, social media, and analytics.', 'Google Digital Garage', 6, 'Beginner', 'Digital Marketing, SEO, SEM, Social Media, Analytics', 'https://learndigital.withgoogle.com/digitalgarage', 0, 4.3),

-- Stanford Online
('Introduction to Databases', 'Learn database design, SQL, and database management systems fundamentals.', 'Stanford Online', 10, 'Intermediate', 'SQL, Database Design, Relational Databases, Normalization', 'https://lagunita.stanford.edu/courses/DB/2014/SelfPaced/about', 0, 4.7),

-- Additional Tech Courses
('Git and GitHub Complete Guide', 'Master version control with Git and GitHub for collaborative software development.', 'GitHub Learning Lab', 4, 'Beginner', 'Git, GitHub, Version Control, Collaboration, Open Source', 'https://lab.github.com/', 0, 4.5),

('Docker for Beginners', 'Learn containerization with Docker, including images, containers, and Docker Compose.', 'Docker Official', 6, 'Beginner', 'Docker, Containers, DevOps, Microservices, Deployment', 'https://docs.docker.com/get-started/', 0, 4.4),

('Kubernetes Basics', 'Learn Kubernetes fundamentals for container orchestration and management.', 'Kubernetes Official', 8, 'Intermediate', 'Kubernetes, Container Orchestration, DevOps, Microservices', 'https://kubernetes.io/docs/tutorials/kubernetes-basics/', 0, 4.3);

-- Verify courses were inserted
SELECT COUNT(*) as total_courses FROM courses;
SELECT title, provider, difficulty_level, rating FROM courses ORDER BY rating DESC LIMIT 10;


