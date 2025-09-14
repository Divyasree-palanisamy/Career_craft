from flask import Flask, request, jsonify, session, render_template
from flask_cors import CORS
from flask_session import Session
import mysql.connector
from mysql.connector import Error
import bcrypt
import os
from dotenv import load_dotenv
import json
from datetime import datetime
# Note: pandas, numpy, and scikit-learn removed for Windows compatibility
# Simple recommendation logic will be used instead
import uuid
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
import io
import base64

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_KEY_PREFIX'] = 'career_platform:'

# Initialize extensions
CORS(app, supports_credentials=True)
Session(app)

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'database': os.getenv('DB_NAME', 'career_platform'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'port': int(os.getenv('DB_PORT', 3306))
}

# Admin credentials
ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD = 'admin123'

def get_db_connection():
    """Create and return database connection"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def init_database():
    """Initialize database tables"""
    connection = get_db_connection()
    if not connection:
        return False
    
    try:
        cursor = connection.cursor()
        
        # Create users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('user', 'admin') DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        """)
        
        # Create user_profiles table
        cursor.execute("""
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
                databases TEXT,
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
            )
        """)
        
        # Create jobs table
        cursor.execute("""
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
            )
        """)
        
        # Create job_applications table
        cursor.execute("""
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
            )
        """)
        
        # Create courses table
        cursor.execute("""
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
            )
        """)
        
        # Create user_course_progress table
        cursor.execute("""
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
            )
        """)
        
        # Create recommendations table
        cursor.execute("""
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
            )
        """)
        
        # Create user_resumes table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_resumes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                resume_name VARCHAR(255) NOT NULL,
                resume_data JSON NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)
        
        connection.commit()
        print("Database tables created successfully!")
        
        # Insert sample data if tables are empty
        insert_sample_data(connection)
        
        return True
        
    except Error as e:
        print(f"Error creating tables: {e}")
        return False
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

def insert_sample_data(connection):
    """Insert sample data into the database"""
    try:
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
                 'Python, JavaScript, React, Node.js', 'Health insurance, flexible hours', '2024-12-31'),
                ('Data Scientist', 'Data Analytics Inc', 'Mumbai', 'Full-time', 3, 800000, 1500000, 
                 'Join our data science team to work on exciting ML projects.', 
                 'Master degree in Data Science or related field', 
                 'Python, Machine Learning, SQL, Statistics', 'Remote work, learning budget', '2024-12-31'),
                ('Frontend Developer', 'Web Solutions', 'Delhi', 'Full-time', 1, 400000, 800000, 
                 'Create amazing user interfaces for our web applications.', 
                 'Bachelor degree in Computer Science', 
                 'HTML, CSS, JavaScript, React, Vue.js', 'Team events, gym membership', '2024-12-31')
            ]
            
            cursor.executemany(
                """INSERT INTO jobs (title, company, location, job_type, experience_required, 
                                   salary_min, salary_max, description, requirements, skills_required, 
                                   benefits, application_deadline) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                sample_jobs
            )
            print("Sample jobs inserted")
        
        connection.commit()
        print("Sample data insertion completed")
        
    except Error as e:
        print(f"Error inserting sample data: {e}")
    finally:
        if connection.is_connected():
            cursor.close()

# Initialize database on startup
init_database()

# Authentication routes
@app.route('/api/register', methods=['POST'])
def register():
    """User registration endpoint"""
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not all([username, email, password]):
            return jsonify({'error': 'All fields are required'}), 400
        
        # Hash password
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = connection.cursor()
        
        # Check if user already exists
        cursor.execute("SELECT id FROM users WHERE username = %s OR email = %s", (username, email))
        if cursor.fetchone():
            return jsonify({'error': 'Username or email already exists'}), 400
        
        # Insert new user
        cursor.execute(
            "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)",
            (username, email, password_hash)
        )
        connection.commit()
        
        return jsonify({'message': 'User registered successfully'}), 201
        
    except Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Registration failed: {str(e)}'}), 500
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not all([username, password]):
            return jsonify({'error': 'Username and password are required'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = connection.cursor(dictionary=True)
        
        # Check admin credentials first
        if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
            session['user_id'] = 'admin'
            session['username'] = username
            session['role'] = 'admin'
            return jsonify({
                'message': 'Admin login successful',
                'user': {'id': 'admin', 'username': username, 'role': 'admin'}
            }), 200
        
        # Check user credentials
        cursor.execute(
            "SELECT id, username, email, password_hash, role FROM users WHERE username = %s",
            (username,)
        )
        user = cursor.fetchone()
        
        if user and bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            session['user_id'] = user['id']
            session['username'] = user['username']
            session['role'] = user['role']
            return jsonify({
                'message': 'Login successful',
                'user': {
                    'id': user['id'],
                    'username': user['username'],
                    'email': user['email'],
                    'role': user['role']
                }
            }), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Login failed: {str(e)}'}), 500
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/logout', methods=['POST'])
def logout():
    """User logout endpoint"""
    session.clear()
    return jsonify({'message': 'Logged out successfully'}), 200

@app.route('/api/check-auth', methods=['GET'])
def check_auth():
    """Check if user is authenticated"""
    if 'user_id' in session:
        return jsonify({
            'authenticated': True,
            'user': {
                'id': session['user_id'],
                'username': session['username'],
                'role': session['role']
            }
        }), 200
    return jsonify({'authenticated': False}), 401

# Profile management routes
@app.route('/api/profile', methods=['GET', 'POST', 'PUT'])
def profile():
    """Get or update user profile"""
    if 'user_id' not in session:
        return jsonify({'error': 'Authentication required'}), 401
    
    user_id = session['user_id']
    print(f"Profile API called by user {user_id}, method: {request.method}")  # Debug log
    
    if request.method == 'GET':
        # Get user profile
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
        
        try:
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM user_profiles WHERE user_id = %s", (user_id,))
            profile = cursor.fetchone()
            
            if profile:
                # Convert JSON strings back to lists for skills
                for skill_field in ['technical_skills', 'soft_skills', 'programming_languages', 
                                  'frameworks', 'databases', 'tools']:
                    if profile[skill_field]:
                        try:
                            profile[skill_field] = json.loads(profile[skill_field])
                        except:
                            profile[skill_field] = []
                    else:
                        profile[skill_field] = []
                
                return jsonify(profile), 200
            else:
                return jsonify({'message': 'Profile not found'}), 404
                
        except Error as e:
            return jsonify({'error': f'Database error: {str(e)}'}), 500
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()
    
    elif request.method in ['POST', 'PUT']:
        # Create or update user profile
        data = request.get_json()
        print(f"Profile update data received: {data}")  # Debug log
        
        # Convert skills lists to JSON strings
        for skill_field in ['technical_skills', 'soft_skills', 'programming_languages', 
                          'frameworks', 'databases', 'tools']:
            if skill_field in data and isinstance(data[skill_field], list):
                data[skill_field] = json.dumps(data[skill_field])
        
        connection = get_db_connection()
        if not connection:
            print("Database connection failed in profile update")  # Debug log
            return jsonify({'error': 'Database connection failed'}), 500
        
        try:
            cursor = connection.cursor()
            
            # Check if table exists
            cursor.execute("SHOW TABLES LIKE 'user_profiles'")
            table_exists = cursor.fetchone()
            if not table_exists:
                print("user_profiles table does not exist, creating it...")  # Debug log
                cursor.execute("""
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
                        highest_qualification VARCHAR(100),
                        university VARCHAR(100),
                        graduation_year INT,
                        cgpa DECIMAL(3,2),
                        field_of_study VARCHAR(100),
                        technical_skills TEXT,
                        soft_skills TEXT,
                        programming_languages TEXT,
                        frameworks TEXT,
                        databases TEXT,
                        tools TEXT,
                        total_experience INT DEFAULT 0,
                        internships TEXT,
                        projects TEXT,
                        certifications TEXT,
                        career_interests TEXT,
                        preferred_locations TEXT,
                        salary_expectation INT,
                        work_mode ENUM('Remote', 'On-site', 'Hybrid'),
                        tech_stack TEXT,
                        batch_semester VARCHAR(20),
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                    )
                """)
                connection.commit()
            
            # Check if profile exists
            cursor.execute("SELECT id FROM user_profiles WHERE user_id = %s", (user_id,))
            existing_profile = cursor.fetchone()
            
            if existing_profile:
                # Update existing profile
                update_fields = []
                values = []
                
                for key, value in data.items():
                    if key != 'user_id':  # Don't update user_id
                        update_fields.append(f"{key} = %s")
                        values.append(value)
                
                if update_fields:
                    values.append(user_id)
                    query = f"UPDATE user_profiles SET {', '.join(update_fields)} WHERE user_id = %s"
                    cursor.execute(query, values)
            else:
                # Create new profile
                data['user_id'] = user_id
                fields = list(data.keys())
                placeholders = ['%s'] * len(fields)
                values = list(data.values())
                
                query = f"INSERT INTO user_profiles ({', '.join(fields)}) VALUES ({', '.join(placeholders)})"
                cursor.execute(query, values)
            
            connection.commit()
            
            # Generate recommendations after profile update (optional)
            try:
                generate_recommendations(user_id)
            except Exception as e:
                print(f"Warning: Failed to generate recommendations: {e}")
                # Don't fail the profile update if recommendations fail
            
            print("Profile updated successfully")  # Debug log
            return jsonify({'message': 'Profile updated successfully'}), 200
            
        except Error as e:
            print(f"Database error in profile update: {str(e)}")  # Debug log
            return jsonify({'error': f'Database error: {str(e)}'}), 500
        except Exception as e:
            print(f"General error in profile update: {str(e)}")  # Debug log
            return jsonify({'error': f'Error updating profile: {str(e)}'}), 500
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

def generate_recommendations(user_id):
    """Generate job and course recommendations for user"""
    try:
        connection = get_db_connection()
        if not connection:
            return
        
        cursor = connection.cursor(dictionary=True)
        
        # Get user profile
        cursor.execute("SELECT * FROM user_profiles WHERE user_id = %s", (user_id,))
        profile = cursor.fetchone()
        
        if not profile:
            return
        
        # Get all active jobs
        cursor.execute("SELECT * FROM jobs WHERE status = 'Active'")
        jobs = cursor.fetchall()
        
        # Get all courses
        cursor.execute("SELECT * FROM courses")
        courses = cursor.fetchall()
        
        # Clear existing recommendations
        cursor.execute("DELETE FROM recommendations WHERE user_id = %s", (user_id,))
        
        # Simple recommendation logic (can be enhanced with ML)
        user_skills = []
        if profile['programming_languages']:
            user_skills.extend(json.loads(profile['programming_languages']))
        if profile['frameworks']:
            user_skills.extend(json.loads(profile['frameworks']))
        if profile['databases']:
            user_skills.extend(json.loads(profile['databases']))
        if profile['tools']:
            user_skills.extend(json.loads(profile['tools']))
        
        user_skills = [skill.lower() for skill in user_skills]
        
        # Job recommendations
        for job in jobs:
            if job['skills_required']:
                job_skills = [skill.strip().lower() for skill in job['skills_required'].split(',')]
                matching_skills = set(user_skills) & set(job_skills)
                score = len(matching_skills) / len(job_skills) if job_skills else 0
                
                if score > 0.2:  # Only recommend if at least 20% match
                    reason = f"Matches {len(matching_skills)} out of {len(job_skills)} required skills"
                    cursor.execute(
                        "INSERT INTO recommendations (user_id, job_id, recommendation_type, score, reason) VALUES (%s, %s, %s, %s, %s)",
                        (user_id, job['id'], 'job', score, reason)
                    )
        
        # Course recommendations
        for course in courses:
            if course['skills_covered']:
                course_skills = [skill.strip().lower() for skill in course['skills_covered'].split(',')]
                matching_skills = set(user_skills) & set(course_skills)
                score = len(matching_skills) / len(course_skills) if course_skills else 0
                
                if score < 0.8:  # Recommend courses that don't fully match (for upskilling)
                    reason = f"Will help you learn {len(course_skills) - len(matching_skills)} new skills"
                    cursor.execute(
                        "INSERT INTO recommendations (user_id, course_id, recommendation_type, score, reason) VALUES (%s, %s, %s, %s, %s)",
                        (user_id, course['id'], 'course', 1 - score, reason)
                    )
        
        connection.commit()
        
    except Error as e:
        print(f"Error generating recommendations: {e}")
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

# Job recommendations and applications
@app.route('/api/job-recommendations', methods=['GET'])
def get_job_recommendations():
    """Get job recommendations for the authenticated user"""
    if 'user_id' not in session:
        return jsonify({'error': 'Authentication required'}), 401
    
    user_id = session['user_id']
    
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        
        # Get recommended jobs with recommendation details
        query = """
            SELECT j.*, r.score as recommendation_score, r.reason as recommendation_reason,
                   ja.status as application_status, ja.applied_at
            FROM jobs j
            LEFT JOIN recommendations r ON j.id = r.job_id AND r.user_id = %s AND r.recommendation_type = 'job'
            LEFT JOIN job_applications ja ON j.id = ja.job_id AND ja.user_id = %s
            WHERE j.status = 'Active'
            ORDER BY r.score DESC, j.created_at DESC
        """
        cursor.execute(query, (user_id, user_id))
        jobs = cursor.fetchall()
        
        # Convert to list and add applied flag
        jobs_list = []
        for job in jobs:
            job_dict = dict(job)
            job_dict['applied'] = job['application_status'] is not None
            jobs_list.append(job_dict)
        
        return jsonify({'jobs': jobs_list}), 200
        
    except Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/apply-job', methods=['POST'])
def apply_job():
    """Apply for a job"""
    if 'user_id' not in session:
        return jsonify({'error': 'Authentication required'}), 401
    
    user_id = session['user_id']
    data = request.get_json()
    job_id = data.get('job_id')
    
    if not job_id:
        return jsonify({'error': 'Job ID is required'}), 400
    
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor()
        
        # Check if job exists and is active
        cursor.execute("SELECT id, title, company FROM jobs WHERE id = %s AND status = 'Active'", (job_id,))
        job = cursor.fetchone()
        
        if not job:
            return jsonify({'error': 'Job not found or not available'}), 404
        
        # Check if user already applied
        cursor.execute("SELECT id FROM job_applications WHERE user_id = %s AND job_id = %s", (user_id, job_id))
        existing_application = cursor.fetchone()
        
        if existing_application:
            return jsonify({'error': 'You have already applied for this job'}), 400
        
        # Create application
        cursor.execute(
            "INSERT INTO job_applications (user_id, job_id, status) VALUES (%s, %s, %s)",
            (user_id, job_id, 'Applied')
        )
        connection.commit()
        
        # Send notification email (placeholder)
        send_application_notification(user_id, job_id, job[1], job[2])
        
        return jsonify({'message': 'Application submitted successfully'}), 201
        
    except Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

def send_application_notification(user_id, job_id, job_title, company_name):
    """Send application notification email"""
    try:
        # This is a placeholder for email functionality
        # In a real application, you would integrate with an email service
        print(f"Application notification: User {user_id} applied for {job_title} at {company_name}")
        
        # You can integrate with services like SendGrid, AWS SES, etc.
        # For now, we'll just log the application
        
    except Exception as e:
        print(f"Error sending notification: {e}")

# Admin routes
@app.route('/api/admin/jobs', methods=['GET', 'POST'])
def admin_jobs():
    """Admin job management"""
    if 'user_id' not in session or session.get('role') != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    print(f"Admin jobs API called by user {session['user_id']}, method: {request.method}")  # Debug log
    
    connection = get_db_connection()
    if not connection:
        print("Database connection failed in admin jobs")  # Debug log
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        
        if request.method == 'GET':
            # Check if jobs table exists
            cursor.execute("SHOW TABLES LIKE 'jobs'")
            table_exists = cursor.fetchone()
            if not table_exists:
                print("Jobs table does not exist, creating it...")  # Debug log
                cursor.execute("""
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
                        status ENUM('Active', 'Inactive', 'Closed') DEFAULT 'Active',
                        created_by INT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
                    )
                """)
                connection.commit()
            
            # Get all jobs
            cursor.execute("SELECT * FROM jobs ORDER BY created_at DESC")
            jobs = cursor.fetchall()
            print(f"Found {len(jobs)} jobs")  # Debug log
            return jsonify({'jobs': jobs}), 200
        
        elif request.method == 'POST':
            # Create new job
            data = request.get_json()
            print(f"Creating job with data: {data}")  # Debug log
            
            required_fields = ['title', 'company', 'description']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({'error': f'{field} is required'}), 400
            
            cursor.execute("""
                INSERT INTO jobs (title, company, location, job_type, experience_required, 
                                salary_min, salary_max, description, requirements, skills_required, 
                                benefits, application_deadline, created_by)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                data['title'], data['company'], data.get('location'), 
                data.get('job_type', 'Full-time'), data.get('experience_required', 0),
                data.get('salary_min'), data.get('salary_max'), data['description'],
                data.get('requirements'), data.get('skills_required'), data.get('benefits'),
                data.get('application_deadline'), session['user_id']
            ))
            
            connection.commit()
            print("Job created successfully")  # Debug log
            return jsonify({'message': 'Job created successfully'}), 201
            
    except Error as e:
        print(f"Database error in admin jobs: {str(e)}")  # Debug log
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        print(f"General error in admin jobs: {str(e)}")  # Debug log
        return jsonify({'error': f'Error in admin jobs: {str(e)}'}), 500
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/admin/users', methods=['GET'])
def admin_users():
    """Get all users for admin"""
    if 'user_id' not in session or session.get('role') != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    print(f"Admin users API called by user {session['user_id']}")  # Debug log
    
    try:
        connection = get_db_connection()
        if not connection:
            print("Database connection failed in admin users")  # Debug log
            return jsonify({'error': 'Database connection failed'}), 500
            
        cursor = connection.cursor(dictionary=True)
        
        # Check if users table exists
        cursor.execute("SHOW TABLES LIKE 'users'")
        table_exists = cursor.fetchone()
        if not table_exists:
            print("Users table does not exist")  # Debug log
            return jsonify({'error': 'Users table does not exist'}), 500
        
        cursor.execute("SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC")
        users = cursor.fetchall()
        print(f"Found {len(users)} users")  # Debug log
        return jsonify({'users': users}), 200
        
    except Error as e:
        print(f"Database error in admin users: {str(e)}")  # Debug log
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        print(f"General error in admin users: {str(e)}")  # Debug log
        return jsonify({'error': f'Error fetching users: {str(e)}'}), 500
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/admin/applications', methods=['GET'])
def admin_applications():
    """Get all job applications for admin"""
    if 'user_id' not in session or session.get('role') != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    print(f"Admin applications API called by user {session['user_id']}")  # Debug log
    
    try:
        connection = get_db_connection()
        if not connection:
            print("Database connection failed in admin applications")  # Debug log
            return jsonify({'error': 'Database connection failed'}), 500
            
        cursor = connection.cursor(dictionary=True)
        
        # Check if job_applications table exists
        cursor.execute("SHOW TABLES LIKE 'job_applications'")
        table_exists = cursor.fetchone()
        if not table_exists:
            print("Job applications table does not exist, creating it...")  # Debug log
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS job_applications (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    job_id INT NOT NULL,
                    status ENUM('Pending', 'Reviewed', 'Accepted', 'Rejected') DEFAULT 'Pending',
                    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    notes TEXT,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
                    UNIQUE KEY unique_application (user_id, job_id)
                )
            """)
            connection.commit()
        
        cursor.execute("""
            SELECT ja.*, u.username, u.email, j.title as job_title, j.company 
            FROM job_applications ja
            JOIN users u ON ja.user_id = u.id
            JOIN jobs j ON ja.job_id = j.id
            ORDER BY ja.applied_at DESC
        """)
        applications = cursor.fetchall()
        print(f"Found {len(applications)} applications")  # Debug log
        return jsonify({'applications': applications}), 200
        
    except Error as e:
        print(f"Database error in admin applications: {str(e)}")  # Debug log
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        print(f"General error in admin applications: {str(e)}")  # Debug log
        return jsonify({'error': f'Error fetching applications: {str(e)}'}), 500
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

# Resume management routes
@app.route('/api/resume', methods=['GET', 'POST', 'DELETE'])
def resume_management():
    """Resume management endpoints"""
    if 'user_id' not in session:
        return jsonify({'error': 'Authentication required'}), 401
    
    user_id = session['user_id']
    print(f"Resume API called by user {user_id}, method: {request.method}")  # Debug log
    
    if request.method == 'GET':
        try:
            connection = get_db_connection()
            if not connection:
                return jsonify({'error': 'Database connection failed'}), 500
                
            cursor = connection.cursor(dictionary=True)
            
            # Check if table exists, create if not
            cursor.execute("SHOW TABLES LIKE 'user_resumes'")
            table_exists = cursor.fetchone()
            if not table_exists:
                print("user_resumes table does not exist, creating it...")
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS user_resumes (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        user_id INT NOT NULL,
                        resume_name VARCHAR(255) NOT NULL,
                        resume_data JSON NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                    )
                """)
                connection.commit()
            
            cursor.execute("SELECT * FROM user_resumes WHERE user_id = %s ORDER BY created_at DESC", (user_id,))
            resumes = cursor.fetchall()
            
            # Parse JSON data for each resume
            for resume in resumes:
                if resume['resume_data']:
                    try:
                        resume['resume_data'] = json.loads(resume['resume_data'])
                    except:
                        resume['resume_data'] = {}
                        
            return jsonify(resumes), 200
            
        except Error as e:
            print(f"Database error in resume GET: {str(e)}")
            return jsonify({'error': f'Database error: {str(e)}'}), 500
        except Exception as e:
            print(f"General error in resume GET: {str(e)}")
            return jsonify({'error': f'Error fetching resumes: {str(e)}'}), 500
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    elif request.method == 'POST':
        try:
            data = request.get_json()
            print(f"Resume data received: {data}")  # Debug log
            
            connection = get_db_connection()
            if not connection:
                print("Database connection failed")  # Debug log
                return jsonify({'error': 'Database connection failed'}), 500
                
            cursor = connection.cursor()
            
            # Check if table exists
            cursor.execute("SHOW TABLES LIKE 'user_resumes'")
            table_exists = cursor.fetchone()
            if not table_exists:
                print("user_resumes table does not exist, creating it...")  # Debug log
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS user_resumes (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        user_id INT NOT NULL,
                        resume_name VARCHAR(255) NOT NULL,
                        resume_data JSON NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                    )
                """)
                connection.commit()
            
            cursor.execute("""
                INSERT INTO user_resumes (user_id, resume_name, resume_data)
                VALUES (%s, %s, %s)
            """, (user_id, data.get('name', 'Resume'), json.dumps(data)))
            
            connection.commit()
            print("Resume saved successfully")  # Debug log
            return jsonify({'message': 'Resume saved successfully'}), 201
            
        except Error as e:
            print(f"Database error in resume save: {str(e)}")  # Debug log
            return jsonify({'error': f'Database error: {str(e)}'}), 500
        except Exception as e:
            print(f"General error in resume save: {str(e)}")  # Debug log
            return jsonify({'error': f'Error saving resume: {str(e)}'}), 500
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    elif request.method == 'DELETE':
        try:
            resume_id = request.args.get('id')
            if not resume_id:
                return jsonify({'error': 'Resume ID required'}), 400
                
            connection = get_db_connection()
            if not connection:
                return jsonify({'error': 'Database connection failed'}), 500
                
            cursor = connection.cursor()
            
            cursor.execute("DELETE FROM user_resumes WHERE id = %s AND user_id = %s", (resume_id, user_id))
            
            if cursor.rowcount == 0:
                return jsonify({'error': 'Resume not found'}), 404
                
            connection.commit()
            return jsonify({'message': 'Resume deleted successfully'}), 200
            
        except Error as e:
            return jsonify({'error': f'Database error: {str(e)}'}), 500
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()

# Test endpoint to verify backend is working
@app.route('/api/courses', methods=['GET'])
def get_courses():
    """Get all available courses"""
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
            
        cursor = connection.cursor(dictionary=True)
        
        # Check if table exists, create if not
        cursor.execute("SHOW TABLES LIKE 'courses'")
        table_exists = cursor.fetchone()
        if not table_exists:
            print("courses table does not exist, creating it...")
            cursor.execute("""
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
                )
            """)
            connection.commit()
            
            # Insert sample courses
            sample_courses = [
                ('Complete Python Bootcamp', 'Learn Python from scratch to advanced level', 'Udemy', 12, 'Beginner', 'Python, OOP, Data Structures', 'https://udemy.com/python-bootcamp', 2999, 4.5),
                ('Machine Learning Fundamentals', 'Introduction to ML algorithms and techniques', 'Coursera', 16, 'Intermediate', 'Python, Scikit-learn, TensorFlow', 'https://coursera.org/ml-fundamentals', 0, 4.7),
                ('React Development', 'Build modern web applications with React', 'GeeksforGeeks', 8, 'Intermediate', 'React, JavaScript, HTML, CSS', 'https://geeksforgeeks.org/react-course', 1999, 4.3),
                ('Data Science with Python', 'Complete data science course with Python', 'Udemy', 20, 'Advanced', 'Python, Pandas, NumPy, Matplotlib', 'https://udemy.com/data-science-python', 3999, 4.6),
                ('AWS Cloud Practitioner', 'Learn AWS cloud services and deployment', 'Coursera', 10, 'Beginner', 'AWS, Cloud Computing, EC2, S3', 'https://coursera.org/aws-practitioner', 0, 4.4),
                ('Web Development Bootcamp', 'Complete web development curriculum', 'FreeCodeCamp', 24, 'Beginner', 'HTML, CSS, JavaScript, React, Node.js', 'https://freecodecamp.org', 0, 4.7),
                ('Cybersecurity Fundamentals', 'Learn cybersecurity basics and best practices', 'Coursera', 14, 'Intermediate', 'Security, Networking, Cryptography', 'https://coursera.org/cybersecurity', 0, 4.5),
                ('DevOps Engineering', 'Master DevOps tools and practices', 'Udemy', 18, 'Advanced', 'Docker, Kubernetes, CI/CD, AWS', 'https://udemy.com/devops', 3999, 4.8)
            ]
            
            cursor.executemany("""
                INSERT INTO courses (title, description, provider, duration_weeks, difficulty_level, skills_covered, course_url, price, rating) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, sample_courses)
            connection.commit()
            print("Sample courses inserted successfully")
        
        cursor.execute("SELECT * FROM courses ORDER BY rating DESC")
        courses = cursor.fetchall()
        
        # Format courses for frontend
        formatted_courses = []
        for course in courses:
            formatted_course = {
                'id': course['id'],
                'title': course['title'],
                'description': course['description'],
                'provider': course['provider'],
                'level': course['difficulty_level'],
                'duration': f"{course['duration_weeks']} weeks",
                'rating': float(course['rating']) if course['rating'] else 0,
                'students': 1000 + (course['id'] * 500),  # Mock student count
                'skills': course['skills_covered'].split(', ') if course['skills_covered'] else [],
                'link': course['course_url'],
                'price': 'Free' if course['price'] == 0 else f"₹{course['price']}"
            }
            formatted_courses.append(formatted_course)
        
        return jsonify({'courses': formatted_courses}), 200
        
    except Error as e:
        print(f"Database error in courses API: {str(e)}")
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        print(f"General error in courses API: {str(e)}")
        return jsonify({'error': f'Error fetching courses: {str(e)}'}), 500
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/test', methods=['GET'])
def test_endpoint():
    """Test endpoint to verify backend is working"""
    try:
        # Test database connection
        connection = get_db_connection()
        if connection:
            cursor = connection.cursor()
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            cursor.close()
            connection.close()
            
            return jsonify({
                'status': 'success',
                'message': 'Backend and database are working',
                'timestamp': str(datetime.now()),
                'tables': [table[0] for table in tables]
            }), 200
        else:
            return jsonify({
                'status': 'error',
                'message': 'Database connection failed',
                'timestamp': str(datetime.now())
            }), 500
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Backend error: {str(e)}',
            'timestamp': str(datetime.now())
        }), 500

if __name__ == '__main__':
    print("Starting Career Platform Backend...")
    print("Database initialization status:", init_database())
    app.run(debug=True, host='0.0.0.0', port=5000)
