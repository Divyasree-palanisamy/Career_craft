import mysql.connector
import bcrypt

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'database': 'career_platform',
    'user': 'root',
    'password': 'Divya@2004',
    'port': 3306
}

def insert_sample_data():
    """Insert sample data into the database"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        cursor = connection.cursor()
        
        # Check if users table has any data
        cursor.execute("SELECT COUNT(*) FROM users")
        user_count = cursor.fetchone()[0]
        
        if user_count == 0:
            print("Inserting sample users...")
            # Insert sample users
            sample_users = [
                ('john_doe', 'john@example.com', bcrypt.hashpw('password123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), 'user'),
                ('jane_smith', 'jane@example.com', bcrypt.hashpw('password123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), 'user'),
                ('mike_wilson', 'mike@example.com', bcrypt.hashpw('password123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), 'user')
            ]
            
            cursor.executemany(
                "INSERT INTO users (username, email, password_hash, role) VALUES (%s, %s, %s, %s)",
                sample_users
            )
            print("Sample users inserted")
        
        # Check if jobs table has any data
        cursor.execute("SELECT COUNT(*) FROM jobs")
        job_count = cursor.fetchone()[0]
        
        if job_count == 0:
            print("Inserting sample jobs...")
            # Insert sample jobs
            sample_jobs = [
                ('Software Engineer', 'Tech Corp', 'Bangalore', 'Full-time', 2, 600000, 1200000, 
                 'We are looking for a skilled software engineer to join our team.', 
                 'Bachelor degree in Computer Science or related field', 
                 'Python, JavaScript, React, Node.js', 'Health insurance, flexible hours', '2024-12-31', 'Active'),
                ('Data Scientist', 'Data Analytics Inc', 'Mumbai', 'Full-time', 3, 800000, 1500000, 
                 'Join our data science team to work on exciting ML projects.', 
                 'Master degree in Data Science or related field', 
                 'Python, Machine Learning, SQL, Statistics', 'Remote work, learning budget', '2024-12-31', 'Active'),
                ('Frontend Developer', 'Web Solutions', 'Delhi', 'Full-time', 1, 400000, 800000, 
                 'Create amazing user interfaces for our web applications.', 
                 'Bachelor degree in Computer Science', 
                 'HTML, CSS, JavaScript, React, Vue.js', 'Team events, gym membership', '2024-12-31', 'Active')
            ]
            
            cursor.executemany(
                """INSERT INTO jobs (title, company, location, job_type, experience_required, 
                                   salary_min, salary_max, description, requirements, skills_required, 
                                   benefits, application_deadline, status) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                sample_jobs
            )
            print("Sample jobs inserted")
        
        # Check if courses table has any data
        cursor.execute("SELECT COUNT(*) FROM courses")
        course_count = cursor.fetchone()[0]
        
        if course_count == 0:
            print("Inserting sample courses...")
            # Insert sample courses
            sample_courses = [
                ('Complete Python Bootcamp', 'Learn Python from scratch to advanced level', 'Udemy', 12, 'Beginner', 'Python, OOP, Data Structures', 'https://udemy.com/python-bootcamp', 2999, 4.5),
                ('Machine Learning Fundamentals', 'Introduction to ML algorithms and techniques', 'Coursera', 16, 'Intermediate', 'Python, Scikit-learn, TensorFlow', 'https://coursera.org/ml-fundamentals', 0, 4.7),
                ('React Development', 'Build modern web applications with React', 'GeeksforGeeks', 8, 'Intermediate', 'React, JavaScript, HTML, CSS', 'https://geeksforgeeks.org/react-course', 1999, 4.3),
                ('Data Science with Python', 'Complete data science course with Python', 'Udemy', 20, 'Advanced', 'Python, Pandas, NumPy, Matplotlib', 'https://udemy.com/data-science-python', 3999, 4.6),
                ('AWS Cloud Practitioner', 'Learn AWS cloud services and deployment', 'Coursera', 10, 'Beginner', 'AWS, Cloud Computing, EC2, S3', 'https://coursera.org/aws-practitioner', 0, 4.4)
            ]
            
            cursor.executemany("""
                INSERT INTO courses (title, description, provider, duration_weeks, difficulty_level, skills_covered, course_url, price, rating) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, sample_courses)
            print("Sample courses inserted")
        
        connection.commit()
        print("Sample data insertion completed successfully!")
        
    except Exception as e:
        print(f"Error inserting sample data: {e}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == "__main__":
    insert_sample_data()
