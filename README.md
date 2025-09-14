# Career Platform - Full Stack Application

A comprehensive career development platform built with Flask backend, React frontend, and MySQL database. Features include user authentication, profile management, AI-powered job recommendations, resume builder, and admin panel.

## Features

### User Features
- **User Authentication**: Secure signup/login with session management
- **Profile Management**: Comprehensive profile form with personal, academic, and professional details
- **Job Recommendations**: AI-powered job matching based on user skills and preferences
- **Resume Builder**: Create and download professional resumes in PDF format
- **Job Applications**: Apply to jobs with application tracking
- **Course Recommendations**: Personalized course suggestions for skill development

### Admin Features
- **Admin Panel**: Complete job management system
- **Job Management**: Create, edit, and delete job postings
- **Application Tracking**: Monitor job applications and user activity
- **Dashboard**: Analytics and statistics overview

## Technology Stack

### Backend
- **Flask**: Python web framework
- **MySQL**: Database for data persistence
- **Scikit-learn**: Machine learning for recommendations
- **ReportLab**: PDF generation for resumes
- **bcrypt**: Password hashing
- **Flask-Session**: Session management

### Frontend
- **React**: JavaScript library for UI
- **React Router**: Client-side routing
- **Styled Components**: CSS-in-JS styling
- **Axios**: HTTP client for API calls
- **React Hook Form**: Form management
- **React Toastify**: Notifications
- **Framer Motion**: Animations
- **jsPDF**: PDF generation
- **html2canvas**: HTML to canvas conversion

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- MySQL 8.0+
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd career-platform
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Database Setup**
   - Install MySQL and create a database named `career_platform`
   - Run the SQL script in MySQL Workbench:
   ```bash
   mysql -u root -p career_platform < database_schema.sql
   ```

5. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   SECRET_KEY=your-super-secret-key-change-this-in-production
   DB_HOST=localhost
   DB_NAME=career_platform
   DB_USER=root
   DB_PASSWORD=your-mysql-password
   DB_PORT=3306
   ```

6. **Run the Flask application**
   ```bash
   python app.py
   ```
   The backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Install Node.js dependencies**
   ```bash
   npm install
   ```

2. **Start the React development server**
   ```bash
   npm start
   ```
   The frontend will be available at `http://localhost:3000`

## Database Schema

The application uses the following main tables:

- **users**: User authentication and basic info
- **user_profiles**: Detailed user profile information
- **jobs**: Job postings and requirements
- **job_applications**: User job applications
- **courses**: Available courses and training
- **user_course_progress**: Course progress tracking
- **recommendations**: AI-generated recommendations

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/check-auth` - Check authentication status

### Profile Management
- `GET /api/profile` - Get user profile
- `POST /api/profile` - Create/update user profile

### Job Management
- `GET /api/job-recommendations` - Get personalized job recommendations
- `POST /api/apply-job` - Apply for a job

### Admin
- `GET /api/admin/jobs` - Get all jobs (admin)
- `POST /api/admin/jobs` - Create new job (admin)

## Usage

### For Users
1. **Register/Login**: Create an account or login with existing credentials
2. **Complete Profile**: Fill out your personal, academic, and professional details
3. **Get Recommendations**: Receive personalized job and course recommendations
4. **Build Resume**: Use the resume builder to create a professional resume
5. **Apply for Jobs**: Browse and apply to recommended job opportunities

### For Admins
1. **Admin Login**: Use admin credentials (admin/admin123)
2. **Manage Jobs**: Create, edit, and delete job postings
3. **Monitor Applications**: Track job applications and user activity
4. **View Analytics**: Access dashboard with platform statistics

## Machine Learning Features

The platform includes a recommendation engine that:
- Analyzes user skills and job requirements
- Calculates compatibility scores
- Provides explainable recommendations
- Suggests relevant courses for skill gaps

## File Structure

```
career-platform/
├── app.py                 # Flask backend application
├── requirements.txt       # Python dependencies
├── database_schema.sql    # Database schema
├── package.json          # Node.js dependencies
├── public/               # Static files
├── src/
│   ├── components/       # React components
│   │   ├── Auth/        # Authentication components
│   │   ├── Dashboard/   # Dashboard components
│   │   ├── Profile/     # Profile management
│   │   ├── Jobs/        # Job-related components
│   │   ├── Resume/      # Resume builder
│   │   ├── Admin/       # Admin panel
│   │   └── Common/      # Shared components
│   ├── contexts/        # React contexts
│   └── App.js          # Main App component
└── README.md           # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

## Future Enhancements

- Email notifications for job applications
- Advanced ML models for better recommendations
- Course progress tracking and certificates
- Company profiles and job posting management
- Mobile application
- Real-time chat for job interviews
- Advanced analytics and reporting
