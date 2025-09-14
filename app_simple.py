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
import uuid

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
    'host': 'localhost',
    'database': 'career_platform',
    'user': 'root',
    'password': 'Divya@2004',
    'port': 3306
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
                resume_data JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)
        
        connection.commit()
        print("Database tables created successfully!")
        return True
        
    except Error as e:
        print(f"Error creating tables: {e}")
        return False
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

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
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
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

@app.route('/api/admin/users', methods=['GET'])
def admin_users():
    """Get all users for admin"""
    if 'user_id' not in session or session.get('role') != 'admin':
        return jsonify({'error': 'Admin authentication required'}), 401
    
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC")
        users = cursor.fetchall()
        return jsonify({'users': users}), 200
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


@app.route('/api/profile', methods=['GET', 'POST', 'PUT'])
def profile():
    """Get or update user profile"""
    if 'user_id' not in session:
        return jsonify({'error': 'Authentication required'}), 401
    
    user_id = session['user_id']
    
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
                                  'frameworks', 'database_skills', 'tools']:
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
        
        # Handle empty date values
        if 'date_of_birth' in data and data['date_of_birth'] == '':
            data['date_of_birth'] = None
        
        # Handle empty numeric values
        if 'graduation_year' in data and data['graduation_year'] == '':
            data['graduation_year'] = None
        
        if 'salary_expectation' in data and data['salary_expectation'] == '':
            data['salary_expectation'] = None
        
        if 'total_experience' in data and data['total_experience'] == '':
            data['total_experience'] = 0
        
        # Handle work_mode enum validation
        if 'work_mode' in data and data['work_mode'] not in ['Remote', 'On-site', 'Hybrid']:
            data['work_mode'] = None
        
        # Handle gender enum validation
        if 'gender' in data and data['gender'] not in ['Male', 'Female', 'Other']:
            data['gender'] = None
        
        # Handle batch_semester length validation
        if 'batch_semester' in data and data['batch_semester']:
            if len(str(data['batch_semester'])) > 20:
                data['batch_semester'] = str(data['batch_semester'])[:20]
        
        # Remove any datetime fields that might cause issues
        datetime_fields = ['created_at', 'updated_at', 'savedAt']
        for field in datetime_fields:
            if field in data:
                del data[field]
        
        # Convert skills lists to JSON strings
        for skill_field in ['technical_skills', 'soft_skills', 'programming_languages', 
                          'frameworks', 'database_skills', 'tools']:
            if skill_field in data and isinstance(data[skill_field], list):
                data[skill_field] = json.dumps(data[skill_field])
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
        
        try:
            cursor = connection.cursor()
            
            # Check if profile exists
            cursor.execute("SELECT id FROM user_profiles WHERE user_id = %s", (user_id,))
            existing_profile = cursor.fetchone()
            
            if existing_profile:
                # Update existing profile
                update_fields = []
                values = []
                
                for key, value in data.items():
                    if key != 'user_id':  # Don't update user_id
                        # Skip None values for optional fields
                        if value is not None:
                            update_fields.append(f"{key} = %s")
                            values.append(value)
                
                if update_fields:
                    values.append(user_id)
                    query = f"UPDATE user_profiles SET {', '.join(update_fields)} WHERE user_id = %s"
                    cursor.execute(query, values)
            else:
                # Create new profile - only include non-None values
                filtered_data = {k: v for k, v in data.items() if v is not None}
                filtered_data['user_id'] = user_id
                
                fields = list(filtered_data.keys())
                placeholders = ['%s'] * len(fields)
                values = list(filtered_data.values())
                
                query = f"INSERT INTO user_profiles ({', '.join(fields)}) VALUES ({', '.join(placeholders)})"
                cursor.execute(query, values)
            
            connection.commit()
            return jsonify({'message': 'Profile updated successfully'}), 200
            
        except Error as e:
            print(f"Database error in profile update: {str(e)}")  # Debug log
            return jsonify({'error': f'Database error: {str(e)}'}), 500
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

@app.route('/api/courses', methods=['GET'])
def get_courses():
    """Get recommended courses"""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
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
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/course/<int:course_id>', methods=['GET'])
def get_course_details(course_id):
    """Get specific course details"""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM courses WHERE id = %s", (course_id,))
        course = cursor.fetchone()
        
        if not course:
            return jsonify({'error': 'Course not found'}), 404
        
        # Format course for frontend
        formatted_course = {
            'id': course['id'],
            'title': course['title'],
            'description': course['description'],
            'provider': course['provider'],
            'duration': course['duration_weeks'],
            'level': course['difficulty_level'],
            'skills': course['skills_covered'].split(', ') if course['skills_covered'] else [],
            'link': course['course_url'],
            'price': course['price'],
            'rating': course['rating'],
            'content': f"""
            <h2>{course['title']}</h2>
            <p><strong>Provider:</strong> {course['provider']}</p>
            <p><strong>Duration:</strong> {course['duration_weeks']} weeks</p>
            <p><strong>Level:</strong> {course['difficulty_level']}</p>
            <p><strong>Skills Covered:</strong> {course['skills_covered']}</p>
            <p><strong>Description:</strong></p>
            <p>{course['description']}</p>
            <p><strong>Course Link:</strong> <a href="{course['course_url']}" target="_blank">Start Course</a></p>
            """
        }
        
        return jsonify({'course': formatted_course}), 200
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/admin/courses', methods=['GET', 'POST'])
def admin_courses():
    """Admin course management"""
    if 'user_id' not in session or session.get('role') != 'admin':
        return jsonify({'error': 'Admin authentication required'}), 401
    
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        if request.method == 'GET':
            cursor.execute("SELECT * FROM courses ORDER BY created_at DESC")
            courses = cursor.fetchall()
            return jsonify({'courses': courses}), 200
        
        elif request.method == 'POST':
            data = request.get_json()
            
            required_fields = ['title', 'description', 'provider']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({'error': f'{field} is required'}), 400
            
            cursor.execute("""
                INSERT INTO courses (title, description, provider, duration_weeks, difficulty_level, 
                                   skills_covered, course_url, price, rating)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                data['title'], data['description'], data['provider'],
                data.get('duration_weeks', 0), data.get('difficulty_level', 'Beginner'),
                data.get('skills_covered', ''), data.get('course_url', ''),
                data.get('price', 0), data.get('rating', 0)
            ))
            
            connection.commit()
            return jsonify({'message': 'Course created successfully'}), 201
            
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

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
        
        # Get all active jobs
        cursor.execute("SELECT * FROM jobs WHERE status = 'Active' ORDER BY created_at DESC")
        jobs = cursor.fetchall()
        
        # Convert to list and add applied flag
        jobs_list = []
        for job in jobs:
            job_dict = dict(job)
            job_dict['applied'] = False  # Default to not applied
            jobs_list.append(job_dict)
        
        return jsonify({'jobs': jobs_list}), 200
        
    except Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/resume', methods=['GET', 'POST', 'DELETE'])
def resume_management():
    """Resume management endpoints"""
    if 'user_id' not in session:
        return jsonify({'error': 'Authentication required'}), 401
    
    if request.method == 'GET':
        try:
            connection = get_db_connection()
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM user_resumes WHERE user_id = %s ORDER BY created_at DESC", (session['user_id'],))
            resumes = cursor.fetchall()
            
            # Parse resume data for each resume
            for resume in resumes:
                if resume['resume_data']:
                    try:
                        resume['resume_data'] = json.loads(resume['resume_data'])
                    except:
                        resume['resume_data'] = {}
                        
            return jsonify({'resumes': resumes}), 200
        except Error as e:
            return jsonify({'error': str(e)}), 500
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()
    
    elif request.method == 'POST':
        try:
            data = request.get_json()
            connection = get_db_connection()
            cursor = connection.cursor()
            
            cursor.execute("""
                INSERT INTO user_resumes (user_id, resume_data, resume_name)
                VALUES (%s, %s, %s)
            """, (session['user_id'], json.dumps(data), data.get('name', 'Resume')))
            
            connection.commit()
            return jsonify({'message': 'Resume saved successfully'})
        except Error as e:
            return jsonify({'error': str(e)}), 500
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()

@app.route('/api/admin/jobs', methods=['GET', 'POST', 'PUT', 'DELETE'])
def admin_jobs():
    """Admin job management"""
    if 'user_id' not in session or session.get('role') != 'admin':
        return jsonify({'error': 'Admin authentication required'}), 401
    
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        if request.method == 'GET':
            cursor.execute("SELECT * FROM jobs ORDER BY created_at DESC")
            jobs = cursor.fetchall()
            return jsonify({'jobs': jobs}), 200
        
        elif request.method == 'POST':
            data = request.get_json()
            
            required_fields = ['title', 'company', 'description']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({'error': f'{field} is required'}), 400
            
            cursor.execute("""
                INSERT INTO jobs (title, company, location, job_type, experience_required, 
                                salary_min, salary_max, description, requirements, skills_required, 
                                benefits, application_deadline, status, created_by)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                data['title'], data.get('company', ''), data.get('location', ''),
                data.get('job_type', 'Full-time'), data.get('experience_required', 0),
                data.get('salary_min'), data.get('salary_max'), data['description'],
                data.get('requirements', ''), data.get('skills_required', ''),
                data.get('benefits', ''), data.get('application_deadline'),
                data.get('status', 'Active'), session['user_id']
            ))
            
            connection.commit()
            return jsonify({'message': 'Job created successfully'}), 201
        
        elif request.method == 'PUT':
            data = request.get_json()
            job_id = data.get('id')
            
            if not job_id:
                return jsonify({'error': 'Job ID is required'}), 400
            
            cursor.execute("""
                UPDATE jobs SET title=%s, company=%s, location=%s, job_type=%s,
                              experience_required=%s, salary_min=%s, salary_max=%s,
                              description=%s, requirements=%s, skills_required=%s,
                              benefits=%s, application_deadline=%s, status=%s
                WHERE id=%s
            """, (
                data['title'], data.get('company', ''), data.get('location', ''),
                data.get('job_type', 'Full-time'), data.get('experience_required', 0),
                data.get('salary_min'), data.get('salary_max'), data['description'],
                data.get('requirements', ''), data.get('skills_required', ''),
                data.get('benefits', ''), data.get('application_deadline'),
                data.get('status', 'Active'), job_id
            ))
            
            connection.commit()
            return jsonify({'message': 'Job updated successfully'}), 200
        
        elif request.method == 'DELETE':
            job_id = request.args.get('id')
            
            if not job_id:
                return jsonify({'error': 'Job ID is required'}), 400
            
            cursor.execute("DELETE FROM jobs WHERE id=%s", (job_id,))
            connection.commit()
            return jsonify({'message': 'Job deleted successfully'}), 200
            
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/admin/applications', methods=['GET'])
def admin_applications():
    """Admin job applications management"""
    if 'user_id' not in session or session.get('role') != 'admin':
        return jsonify({'error': 'Admin authentication required'}), 401
    
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT ja.*, u.username, u.email, j.title as job_title, j.company
            FROM job_applications ja
            JOIN users u ON ja.user_id = u.id
            JOIN jobs j ON ja.job_id = j.id
            ORDER BY ja.applied_at DESC
        """)
        applications = cursor.fetchall()
        
        return jsonify({'applications': applications}), 200
        
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/apply-job', methods=['POST'])
def apply_job():
    """Apply for a job"""
    if 'user_id' not in session:
        return jsonify({'error': 'Authentication required'}), 401
    
    try:
        data = request.get_json()
        job_id = data.get('job_id')
        
        if not job_id:
            return jsonify({'error': 'Job ID is required'}), 400
        
        connection = get_db_connection()
        cursor = connection.cursor()
        
        # Check if already applied
        cursor.execute("SELECT id FROM job_applications WHERE user_id=%s AND job_id=%s", 
                      (session['user_id'], job_id))
        if cursor.fetchone():
            return jsonify({'error': 'You have already applied for this job'}), 400
        
        # Insert application
        cursor.execute("""
            INSERT INTO job_applications (user_id, job_id, cover_letter, status)
            VALUES (%s, %s, %s, 'Applied')
        """, (session['user_id'], job_id, data.get('cover_letter', '')))
        
        connection.commit()
        return jsonify({'message': 'Application submitted successfully'}), 201
        
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/my-applications', methods=['GET'])
def my_applications():
    """Get user's job applications"""
    if 'user_id' not in session:
        return jsonify({'error': 'Authentication required'}), 401
    
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT ja.*, j.title, j.company, j.location, j.job_type
            FROM job_applications ja
            JOIN jobs j ON ja.job_id = j.id
            WHERE ja.user_id = %s
            ORDER BY ja.applied_at DESC
        """, (session['user_id'],))
        
        applications = cursor.fetchall()
        return jsonify({'applications': applications}), 200
        
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/test', methods=['GET'])
def test():
    """Test endpoint"""
    return jsonify({'message': 'Career Platform API is working!', 'status': 'success'}), 200

if __name__ == '__main__':
    print("🚀 Starting Career Platform...")
    print("📱 Frontend will be available at: http://localhost:3000")
    print("🔧 Backend API available at: http://localhost:5000")
    print("👤 Admin Login: admin / admin123")
    print("=" * 50)
    app.run(debug=True, host='0.0.0.0', port=5000)
