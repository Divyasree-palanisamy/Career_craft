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

@app.route('/api/admin/users', methods=['GET'])
def admin_users():
    """Get all users for admin"""
    if not check_admin_auth():
        return jsonify({'error': 'Admin authentication required'}), 401
    
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC")
        users = cursor.fetchall()
        return jsonify({'users': users})
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/admin/applications', methods=['GET'])
def admin_applications():
    """Get all job applications for admin"""
    if not check_admin_auth():
        return jsonify({'error': 'Admin authentication required'}), 401
    
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT ja.*, u.username as user_name, j.title as job_title, j.company
            FROM job_applications ja
            JOIN users u ON ja.user_id = u.id
            JOIN jobs j ON ja.job_id = j.id
            ORDER BY ja.applied_at DESC
        """)
        applications = cursor.fetchall()
        return jsonify({'applications': applications})
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/courses', methods=['GET'])
def get_courses():
    """Get recommended courses"""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM courses ORDER BY created_at DESC")
        courses = cursor.fetchall()
        return jsonify({'courses': courses})
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/resume', methods=['GET', 'POST', 'DELETE'])
def resume_management():
    """Resume management endpoints"""
    if not check_auth():
        return jsonify({'error': 'Authentication required'}), 401
    
    if request.method == 'GET':
        try:
            connection = get_db_connection()
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM user_resumes WHERE user_id = %s ORDER BY created_at DESC", (session['user_id'],))
            resumes = cursor.fetchall()
            return jsonify({'resumes': resumes})
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
