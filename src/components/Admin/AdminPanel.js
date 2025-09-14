import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import {
  Users,
  Briefcase,
  BookOpen,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  LogOut,
  Settings,
  TrendingUp,
  UserCheck,
  FileText,
  User
} from 'lucide-react';
import axios from 'axios';

const AdminContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
`;

const AdminHeader = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AdminTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
`;

const AdminSubtitle = styled.p`
  color: #6b7280;
  font-size: 1.1rem;
`;

const LogoutButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: #dc2626;
    transform: translateY(-2px);
  }
`;

const AdminTabs = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  background: white;
  border-radius: 16px;
  padding: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const AdminTab = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent'};
  color: ${props => props.active ? 'white' : '#6b7280'};
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    color: ${props => props.active ? 'white' : '#667eea'};
    background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(102, 126, 234, 0.1)'};
  }
`;

const AdminContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, ${props => props.gradient || '#667eea 0%, #764ba2 100%'});
  color: white;
  padding: 24px;
  border-radius: 16px;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  opacity: 0.9;
`;

const StatIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 16px;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin-bottom: 30px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const TableHeader = styled.th`
  background: #f8f9fa;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  color: #374151;
`;

const TableRow = styled.tr`
  &:hover {
    background: #f8f9fa;
  }
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-right: 8px;
  
  &.primary {
    background: #667eea;
    color: white;
    
    &:hover {
      background: #5a67d8;
    }
  }
  
  &.secondary {
    background: #f8f9fa;
    color: #495057;
    border: 1px solid #dee2e6;
    
    &:hover {
      background: #e9ecef;
    }
  }
  
  &.danger {
    background: #ef4444;
    color: white;
    
    &:hover {
      background: #dc2626;
    }
  }
`;

const FormModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  
  &:hover {
    color: #374151;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const CourseForm = ({ course, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    provider: course?.provider || '',
    duration_weeks: course?.duration_weeks || '',
    difficulty_level: course?.difficulty_level || 'Beginner',
    skills_covered: course?.skills_covered || '',
    course_url: course?.course_url || '',
    price: course?.price || 0,
    rating: course?.rating || 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'rating' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Course Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Provider *
          </label>
          <input
            type="text"
            name="provider"
            value={formData.provider}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            resize: 'vertical'
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Duration (weeks) *
          </label>
          <input
            type="number"
            name="duration_weeks"
            value={formData.duration_weeks}
            onChange={handleChange}
            required
            min="1"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Difficulty Level *
          </label>
          <select
            name="difficulty_level"
            value={formData.difficulty_level}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Price (₹)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Skills Covered
          </label>
          <input
            type="text"
            name="skills_covered"
            value={formData.skills_covered}
            onChange={handleChange}
            placeholder="e.g., Python, React, Machine Learning"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Rating (0-5)
          </label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            min="0"
            max="5"
            step="0.1"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Course URL
        </label>
        <input
          type="url"
          name="course_url"
          value={formData.course_url}
          onChange={handleChange}
          placeholder="https://example.com/course"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '10px 20px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            backgroundColor: 'white',
            color: '#374151',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: '#3b82f6',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {course ? 'Update Course' : 'Create Course'}
        </button>
      </div>
    </form>
  );
};

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    totalCourses: 0
  });
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseEnrollments, setCourseEnrollments] = useState([]);
  const [showEnrollmentsModal, setShowEnrollmentsModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    location: '',
    job_type: 'Full-time',
    experience_required: 0,
    salary_min: '',
    salary_max: '',
    description: '',
    requirements: '',
    skills_required: '',
    benefits: '',
    application_deadline: ''
  });

  useEffect(() => {
    fetchStats();
    if (activeTab === 'jobs') {
      fetchJobs();
    } else if (activeTab === 'applications') {
      fetchApplications();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'courses') {
      fetchCourses();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const [usersResponse, jobsResponse, applicationsResponse] = await Promise.all([
        axios.get('/api/admin/users', { withCredentials: true }),
        axios.get('/api/admin/jobs', { withCredentials: true }),
        axios.get('/api/admin/applications', { withCredentials: true })
      ]);

      setStats({
        totalUsers: usersResponse.data.users?.length || 0,
        totalJobs: jobsResponse.data.jobs?.length || 0,
        totalApplications: applicationsResponse.data.applications?.length || 0,
        totalCourses: 12 // Static for now
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback to static data if API fails
      setStats({
        totalUsers: 0,
        totalJobs: 0,
        totalApplications: 0,
        totalCourses: 0
      });
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get('/api/admin/jobs', {
        withCredentials: true
      });
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await axios.get('/api/admin/applications', {
        withCredentials: true
      });
      setApplications(response.data.applications || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users', {
        withCredentials: true
      });
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/admin/courses', {
        withCredentials: true
      });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleCreateCourse = async (courseData) => {
    try {
      const response = await axios.post('/api/admin/courses', courseData, {
        withCredentials: true
      });
      setShowCreateCourseModal(false);
      fetchCourses();
      alert('Course created successfully!');
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Error creating course: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  const handleUpdateCourse = async (courseId, courseData) => {
    try {
      await axios.put(`/api/admin/courses/${courseId}`, courseData, {
        withCredentials: true
      });
      setShowCourseModal(false);
      fetchCourses();
      alert('Course updated successfully!');
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Error updating course: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`/api/admin/courses/${courseId}`, {
          withCredentials: true
        });
        fetchCourses();
        alert('Course deleted successfully!');
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Error deleting course: ' + (error.response?.data?.error || 'Unknown error'));
      }
    }
  };

  const handleViewCourseEnrollments = async (course) => {
    try {
      const response = await axios.get(`/api/admin/courses/${course.id}/enrollments`, {
        withCredentials: true
      });
      setCourseEnrollments(response.data);
      setSelectedCourse(course);
      setShowEnrollmentsModal(true);
    } catch (error) {
      console.error('Error fetching course enrollments:', error);
      alert('Error fetching enrollments: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingJob) {
        // Update existing job
        await axios.put(`/api/admin/jobs/${editingJob.id}`, jobForm, {
          withCredentials: true
        });
        toast.success('Job updated successfully!');
      } else {
        // Create new job
        await axios.post('/api/admin/jobs', jobForm, {
          withCredentials: true
        });
        toast.success('Job created successfully!');
      }

      setShowJobModal(false);
      setEditingJob(null);
      setJobForm({
        title: '',
        company: '',
        location: '',
        job_type: 'Full-time',
        experience_required: 0,
        salary_min: '',
        salary_max: '',
        description: '',
        requirements: '',
        skills_required: '',
        benefits: '',
        application_deadline: ''
      });
      fetchJobs();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save job');
    } finally {
      setLoading(false);
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      company: job.company,
      location: job.location || '',
      job_type: job.job_type || 'Full-time',
      experience_required: job.experience_required || 0,
      salary_min: job.salary_min || '',
      salary_max: job.salary_max || '',
      description: job.description || '',
      requirements: job.requirements || '',
      skills_required: job.skills_required || '',
      benefits: job.benefits || '',
      application_deadline: job.application_deadline || ''
    });
    setShowJobModal(true);
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await axios.delete(`/api/admin/jobs/${jobId}`, {
          withCredentials: true
        });
        toast.success('Job deleted successfully!');
        fetchJobs();
      } catch (error) {
        toast.error('Failed to delete job');
      }
    }
  };

  const handleViewUser = async (user) => {
    console.log('Viewing user:', user); // Debug log
    try {
      // Fetch user profile data
      const response = await axios.get(`/api/admin/user-profile/${user.id}`, {
        withCredentials: true
      });
      console.log('Profile data received:', response.data); // Debug log
      setSelectedUser({
        ...user,
        profile: response.data
      });
      setShowUserModal(true);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      console.error('Error response:', error.response?.data); // Debug log
      console.error('User ID being requested:', user.id); // Debug log

      // If profile fetch fails, show basic user info with error message
      setSelectedUser({
        ...user,
        profile: null,
        profileError: error.response?.data?.error || 'Failed to load profile'
      });
      setShowUserModal(true);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const renderDashboard = () => (
    <div>
      <StatsGrid>
        <StatCard gradient="#667eea 0%, #764ba2 100%">
          <StatIcon><Users size={32} /></StatIcon>
          <StatNumber>{stats.totalUsers}</StatNumber>
          <StatLabel>Total Users</StatLabel>
        </StatCard>
        <StatCard gradient="#56ab2f 0%, #a8e6cf 100%">
          <StatIcon><Briefcase size={32} /></StatIcon>
          <StatNumber>{stats.totalJobs}</StatNumber>
          <StatLabel>Active Jobs</StatLabel>
        </StatCard>
        <StatCard gradient="#f093fb 0%, #f5576c 100%">
          <StatIcon><FileText size={32} /></StatIcon>
          <StatNumber>{stats.totalApplications}</StatNumber>
          <StatLabel>Applications</StatLabel>
        </StatCard>
        <StatCard gradient="#ffecd2 0%, #fcb69f 100%">
          <StatIcon><BookOpen size={32} /></StatIcon>
          <StatNumber>{stats.totalCourses}</StatNumber>
          <StatLabel>Courses</StatLabel>
        </StatCard>
      </StatsGrid>

      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
        <BarChart3 size={64} style={{ marginBottom: '20px', opacity: 0.5 }} />
        <h3>Dashboard Overview</h3>
        <p>Welcome to the admin panel. Use the tabs above to manage different aspects of the platform.</p>
      </div>
    </div>
  );

  const renderJobs = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Job Management</h2>
        <ActionButton
          className="primary"
          onClick={() => setShowJobModal(true)}
        >
          <Plus size={16} />
          Add New Job
        </ActionButton>
      </div>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader>Title</TableHeader>
              <TableHeader>Company</TableHeader>
              <TableHeader>Location</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <TableRow key={job.id}>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.company}</TableCell>
                <TableCell>{job.location || 'N/A'}</TableCell>
                <TableCell>{job.job_type}</TableCell>
                <TableCell>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    backgroundColor: job.status === 'Active' ? '#d1fae5' : '#fee2e2',
                    color: job.status === 'Active' ? '#065f46' : '#991b1b'
                  }}>
                    {job.status}
                  </span>
                </TableCell>
                <TableCell>
                  <ActionButton
                    className="secondary"
                    onClick={() => handleEditJob(job)}
                  >
                    <Edit size={14} />
                    Edit
                  </ActionButton>
                  <ActionButton
                    className="danger"
                    onClick={() => handleDeleteJob(job.id)}
                  >
                    <Trash2 size={14} />
                    Delete
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </div>
  );

  const renderApplications = () => (
    <div>
      <h2>Job Applications</h2>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader>Applicant</TableHeader>
              <TableHeader>Job Title</TableHeader>
              <TableHeader>Company</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Applied Date</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <TableRow key={app.id}>
                <TableCell>{app.user_name}</TableCell>
                <TableCell>{app.job_title}</TableCell>
                <TableCell>{app.company}</TableCell>
                <TableCell>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    backgroundColor: '#dbeafe',
                    color: '#1e40af'
                  }}>
                    {app.status}
                  </span>
                </TableCell>
                <TableCell>{app.applied_at}</TableCell>
                <TableCell>
                  <ActionButton className="secondary">
                    <Eye size={14} />
                    View
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </div>
  );

  const renderUsers = () => (
    <div>
      <h2>User Management</h2>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader>Username</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Role</TableHeader>
              <TableHeader>Joined Date</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    backgroundColor: user.role === 'admin' ? '#fef3c7' : '#d1fae5',
                    color: user.role === 'admin' ? '#92400e' : '#065f46'
                  }}>
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    backgroundColor: '#dbeafe',
                    color: '#1e40af'
                  }}>
                    Active
                  </span>
                </TableCell>
                <TableCell>
                  <ActionButton
                    className="secondary"
                    onClick={() => handleViewUser(user)}
                  >
                    <Eye size={14} />
                    View
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </div>
  );

  const renderCourses = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Course Management</h2>
        <ActionButton onClick={() => setShowCreateCourseModal(true)}>
          <Plus size={16} />
          Add Course
        </ActionButton>
      </div>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader>Title</TableHeader>
              <TableHeader>Provider</TableHeader>
              <TableHeader>Duration</TableHeader>
              <TableHeader>Difficulty</TableHeader>
              <TableHeader>Price</TableHeader>
              <TableHeader>Rating</TableHeader>
              <TableHeader>Students</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <TableRow key={course.id}>
                <TableCell>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{course.title}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {course.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{course.provider}</TableCell>
                <TableCell>{course.duration_weeks} weeks</TableCell>
                <TableCell>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    backgroundColor: course.difficulty_level === 'Beginner' ? '#d1fae5' :
                      course.difficulty_level === 'Intermediate' ? '#fef3c7' : '#fecaca',
                    color: course.difficulty_level === 'Beginner' ? '#065f46' :
                      course.difficulty_level === 'Intermediate' ? '#92400e' : '#991b1b'
                  }}>
                    {course.difficulty_level}
                  </span>
                </TableCell>
                <TableCell>
                  {course.price > 0 ? `₹${course.price}` : 'Free'}
                </TableCell>
                <TableCell>
                  {course.rating ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>⭐</span>
                      <span>{course.rating}</span>
                    </div>
                  ) : 'N/A'}
                </TableCell>
                <TableCell>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    backgroundColor: '#dbeafe',
                    color: '#1e40af'
                  }}>
                    {course.enrolled_students || 0}
                  </span>
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <ActionButton
                      className="secondary"
                      onClick={() => handleViewCourseEnrollments(course)}
                    >
                      <Users size={14} />
                      Students
                    </ActionButton>
                    <ActionButton
                      className="secondary"
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowCourseModal(true);
                      }}
                    >
                      <Edit size={14} />
                      Edit
                    </ActionButton>
                    <ActionButton
                      className="danger"
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      <Trash2 size={14} />
                      Delete
                    </ActionButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </div>
  );

  return (
    <AdminContainer>
      <AdminHeader>
        <div>
          <AdminTitle>Admin Panel</AdminTitle>
          <AdminSubtitle>Manage your career platform</AdminSubtitle>
        </div>
        <LogoutButton onClick={handleLogout}>
          <LogOut size={20} />
          Logout
        </LogoutButton>
      </AdminHeader>

      <AdminTabs>
        <AdminTab
          active={activeTab === 'dashboard'}
          onClick={() => setActiveTab('dashboard')}
        >
          <BarChart3 size={20} />
          Dashboard
        </AdminTab>
        <AdminTab
          active={activeTab === 'jobs'}
          onClick={() => setActiveTab('jobs')}
        >
          <Briefcase size={20} />
          Jobs
        </AdminTab>
        <AdminTab
          active={activeTab === 'applications'}
          onClick={() => setActiveTab('applications')}
        >
          <FileText size={20} />
          Applications
        </AdminTab>
        <AdminTab
          active={activeTab === 'courses'}
          onClick={() => setActiveTab('courses')}
        >
          <BookOpen size={20} />
          Courses
        </AdminTab>
        <AdminTab
          active={activeTab === 'users'}
          onClick={() => setActiveTab('users')}
        >
          <Users size={20} />
          Users
        </AdminTab>
      </AdminTabs>

      <AdminContent>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'jobs' && renderJobs()}
        {activeTab === 'applications' && renderApplications()}
        {activeTab === 'courses' && renderCourses()}
        {activeTab === 'users' && renderUsers()}
      </AdminContent>

      {showJobModal && (
        <FormModal onClick={(e) => e.target === e.currentTarget && setShowJobModal(false)}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{editingJob ? 'Edit Job' : 'Add New Job'}</ModalTitle>
              <CloseButton onClick={() => setShowJobModal(false)}>×</CloseButton>
            </ModalHeader>

            <form onSubmit={handleJobSubmit}>
              <FormGroup>
                <FormLabel>Job Title *</FormLabel>
                <FormInput
                  type="text"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Company *</FormLabel>
                <FormInput
                  type="text"
                  value={jobForm.company}
                  onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Location</FormLabel>
                <FormInput
                  type="text"
                  value={jobForm.location}
                  onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Job Type</FormLabel>
                <FormSelect
                  value={jobForm.job_type}
                  onChange={(e) => setJobForm({ ...jobForm, job_type: e.target.value })}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel>Experience Required (Years)</FormLabel>
                <FormInput
                  type="number"
                  value={jobForm.experience_required}
                  onChange={(e) => setJobForm({ ...jobForm, experience_required: parseInt(e.target.value) || 0 })}
                  min="0"
                />
              </FormGroup>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <FormGroup>
                  <FormLabel>Min Salary (LPA)</FormLabel>
                  <FormInput
                    type="number"
                    value={jobForm.salary_min}
                    onChange={(e) => setJobForm({ ...jobForm, salary_min: parseInt(e.target.value) || '' })}
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Max Salary (LPA)</FormLabel>
                  <FormInput
                    type="number"
                    value={jobForm.salary_max}
                    onChange={(e) => setJobForm({ ...jobForm, salary_max: parseInt(e.target.value) || '' })}
                  />
                </FormGroup>
              </div>

              <FormGroup>
                <FormLabel>Job Description *</FormLabel>
                <FormTextarea
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Requirements</FormLabel>
                <FormTextarea
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Skills Required (comma-separated)</FormLabel>
                <FormInput
                  type="text"
                  value={jobForm.skills_required}
                  onChange={(e) => setJobForm({ ...jobForm, skills_required: e.target.value })}
                  placeholder="e.g., Python, JavaScript, React"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Benefits</FormLabel>
                <FormTextarea
                  value={jobForm.benefits}
                  onChange={(e) => setJobForm({ ...jobForm, benefits: e.target.value })}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Application Deadline</FormLabel>
                <FormInput
                  type="date"
                  value={jobForm.application_deadline}
                  onChange={(e) => setJobForm({ ...jobForm, application_deadline: e.target.value })}
                />
              </FormGroup>

              <SubmitButton type="submit" disabled={loading}>
                {loading ? 'Saving...' : (editingJob ? 'Update Job' : 'Create Job')}
              </SubmitButton>
            </form>
          </ModalContent>
        </FormModal>
      )}

      {showUserModal && selectedUser && (
        <FormModal onClick={(e) => e.target === e.currentTarget && setShowUserModal(false)}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>User Profile - {selectedUser.username}</ModalTitle>
              <CloseButton onClick={() => setShowUserModal(false)}>×</CloseButton>
            </ModalHeader>

            <div style={{ display: 'grid', gap: '20px' }}>
              {/* Basic User Information */}
              <div style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={20} />
                  Basic Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <strong>Username:</strong> {selectedUser.username}
                  </div>
                  <div>
                    <strong>Email:</strong> {selectedUser.email}
                  </div>
                  <div>
                    <strong>Role:</strong>
                    <span style={{
                      marginLeft: '8px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: selectedUser.role === 'admin' ? '#fef3c7' : '#d1fae5',
                      color: selectedUser.role === 'admin' ? '#92400e' : '#065f46'
                    }}>
                      {selectedUser.role}
                    </span>
                  </div>
                  <div>
                    <strong>Joined:</strong> {new Date(selectedUser.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Profile Information */}
              {selectedUser.profile ? (
                <div style={{
                  background: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h3 style={{ margin: '0 0 15px 0', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserCheck size={20} />
                    Profile Information
                  </h3>
                  <div style={{ display: 'grid', gap: '15px' }}>
                    {(selectedUser.profile.first_name || selectedUser.profile.last_name) && (
                      <div>
                        <strong>Name:</strong> {selectedUser.profile.first_name} {selectedUser.profile.last_name}
                      </div>
                    )}
                    {selectedUser.profile.phone && (
                      <div>
                        <strong>Phone:</strong> {selectedUser.profile.phone}
                      </div>
                    )}
                    {selectedUser.profile.highest_qualification && (
                      <div>
                        <strong>Education:</strong> {selectedUser.profile.highest_qualification}
                        {selectedUser.profile.university && ` from ${selectedUser.profile.university}`}
                      </div>
                    )}
                    {selectedUser.profile.field_of_study && (
                      <div>
                        <strong>Field of Study:</strong> {selectedUser.profile.field_of_study}
                      </div>
                    )}
                    {selectedUser.profile.total_experience > 0 && (
                      <div>
                        <strong>Experience:</strong> {selectedUser.profile.total_experience} years
                      </div>
                    )}
                    {selectedUser.profile.city && (
                      <div>
                        <strong>Location:</strong> {selectedUser.profile.city}
                        {selectedUser.profile.state && `, ${selectedUser.profile.state}`}
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  {(selectedUser.profile.programming_languages?.length > 0 ||
                    selectedUser.profile.frameworks?.length > 0 ||
                    selectedUser.profile.database_skills?.length > 0) && (
                      <div style={{ marginTop: '20px' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>Skills:</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {selectedUser.profile.programming_languages?.map((skill, index) => (
                            <span key={index} style={{
                              background: '#dbeafe',
                              color: '#1e40af',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '12px'
                            }}>
                              {skill}
                            </span>
                          ))}
                          {selectedUser.profile.frameworks?.map((skill, index) => (
                            <span key={index} style={{
                              background: '#d1fae5',
                              color: '#065f46',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '12px'
                            }}>
                              {skill}
                            </span>
                          ))}
                          {selectedUser.profile.database_skills?.map((skill, index) => (
                            <span key={index} style={{
                              background: '#fef3c7',
                              color: '#92400e',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '12px'
                            }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Career Interests */}
                  {selectedUser.profile.career_interests && (
                    <div style={{ marginTop: '20px' }}>
                      <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>Career Interests:</h4>
                      <p style={{ margin: '0', color: '#6b7280', lineHeight: '1.5' }}>
                        {selectedUser.profile.career_interests}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{
                  background: '#fef2f2',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid #fecaca',
                  textAlign: 'center'
                }}>
                  <p style={{ margin: '0', color: '#991b1b' }}>
                    {selectedUser.profileError || 'No profile information available for this user.'}
                  </p>
                  <p style={{ margin: '10px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                    This user may not have completed their profile setup yet.
                  </p>
                </div>
              )}
            </div>
          </ModalContent>
        </FormModal>
      )}

      {/* Course Management Modals */}
      {showCreateCourseModal && (
        <FormModal onClick={(e) => e.target === e.currentTarget && setShowCreateCourseModal(false)}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Add New Course</ModalTitle>
              <CloseButton onClick={() => setShowCreateCourseModal(false)}>×</CloseButton>
            </ModalHeader>
            <CourseForm
              onSubmit={handleCreateCourse}
              onCancel={() => setShowCreateCourseModal(false)}
            />
          </ModalContent>
        </FormModal>
      )}

      {showCourseModal && selectedCourse && (
        <FormModal onClick={(e) => e.target === e.currentTarget && setShowCourseModal(false)}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Edit Course</ModalTitle>
              <CloseButton onClick={() => setShowCourseModal(false)}>×</CloseButton>
            </ModalHeader>
            <CourseForm
              course={selectedCourse}
              onSubmit={(data) => handleUpdateCourse(selectedCourse.id, data)}
              onCancel={() => setShowCourseModal(false)}
            />
          </ModalContent>
        </FormModal>
      )}

      {showEnrollmentsModal && selectedCourse && (
        <FormModal onClick={(e) => e.target === e.currentTarget && setShowEnrollmentsModal(false)}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Course Enrollments - {selectedCourse.title}</ModalTitle>
              <CloseButton onClick={() => setShowEnrollmentsModal(false)}>×</CloseButton>
            </ModalHeader>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {courseEnrollments.length > 0 ? (
                <TableContainer>
                  <Table>
                    <thead>
                      <tr>
                        <TableHeader>Student</TableHeader>
                        <TableHeader>Email</TableHeader>
                        <TableHeader>Progress</TableHeader>
                        <TableHeader>Status</TableHeader>
                        <TableHeader>Started</TableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      {courseEnrollments.map(enrollment => (
                        <TableRow key={enrollment.id}>
                          <TableCell>
                            {enrollment.first_name && enrollment.last_name
                              ? `${enrollment.first_name} ${enrollment.last_name}`
                              : enrollment.username
                            }
                          </TableCell>
                          <TableCell>{enrollment.email}</TableCell>
                          <TableCell>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{
                                width: '60px',
                                height: '8px',
                                backgroundColor: '#e5e7eb',
                                borderRadius: '4px',
                                overflow: 'hidden'
                              }}>
                                <div style={{
                                  width: `${enrollment.progress_percentage || 0}%`,
                                  height: '100%',
                                  backgroundColor: enrollment.progress_percentage >= 100 ? '#10b981' : '#3b82f6',
                                  transition: 'width 0.3s ease'
                                }} />
                              </div>
                              <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                {enrollment.progress_percentage || 0}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              backgroundColor: enrollment.status === 'Completed' ? '#d1fae5' :
                                enrollment.status === 'In Progress' ? '#fef3c7' : '#f3f4f6',
                              color: enrollment.status === 'Completed' ? '#065f46' :
                                enrollment.status === 'In Progress' ? '#92400e' : '#6b7280'
                            }}>
                              {enrollment.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            {enrollment.started_at ? new Date(enrollment.started_at).toLocaleDateString() : 'Not started'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </Table>
                </TableContainer>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  <Users size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                  <p>No students enrolled in this course yet.</p>
                </div>
              )}
            </div>
          </ModalContent>
        </FormModal>
      )}
    </AdminContainer>
  );
};

export default AdminPanel;
