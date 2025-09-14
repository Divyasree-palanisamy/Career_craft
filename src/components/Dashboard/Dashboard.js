import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import {
  User,
  Briefcase,
  FileText,
  BookOpen,
  TrendingUp,
  Settings,
  LogOut,
  ArrowRight
} from 'lucide-react';

const DashboardContainer = styled.div`
  min-height: 100vh;
  padding: 20px;
`;

const Navbar = styled.nav`
  background: white;
  border-radius: 16px;
  padding: 20px 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavbarBrand = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
`;

const NavbarNav = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const NavLink = styled.div`
  color: #6b7280;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }
`;

const NavUser = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
  }
`;

const DashboardHeader = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const DashboardTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
`;

const DashboardSubtitle = styled.p`
  color: #6b7280;
  font-size: 1.1rem;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const DashboardCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
  }
`;

const CardIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: white;
  background: ${props => props.bgColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
`;

const CardDescription = styled.p`
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const CardAction = styled.div`
  display: flex;
  align-items: center;
  color: #667eea;
  font-weight: 500;
  gap: 8px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
`;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    applications: 0,
    recommendations: 0,
    courses: 0,
    profileComplete: false
  });

  useEffect(() => {
    // Fetch user stats
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      // Fetch profile data to calculate completion percentage
      const profileResponse = await axios.get('/api/profile', {
        withCredentials: true
      });

      let profileCompletion = 0;
      if (profileResponse.data) {
        profileCompletion = calculateProfileCompletion(profileResponse.data);
      }

      setStats({
        applications: 0,
        recommendations: 0,
        courses: 0,
        profileComplete: profileCompletion
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set default values if profile fetch fails
      setStats({
        applications: 0,
        recommendations: 0,
        courses: 0,
        profileComplete: 0
      });
    }
  };

  const calculateProfileCompletion = (profile) => {
    // Required fields (higher weight)
    const requiredFields = [
      'first_name', 'last_name', 'highest_qualification'
    ];
    
    // Important fields (medium weight) - removed 'email' as it's not in profile data
    const importantFields = [
      'phone', 'university', 'field_of_study', 'graduation_year',
      'programming_languages', 'frameworks', 'database_skills', 'tools',
      'career_interests', 'preferred_locations', 'work_mode'
    ];
    
    // Optional fields (lower weight)
    const optionalFields = [
      'date_of_birth', 'gender', 'address', 'city', 'state', 'country', 'pincode',
      'cgpa', 'technical_skills', 'soft_skills', 'total_experience', 
      'internships', 'projects', 'certifications', 'salary_expectation',
      'tech_stack', 'batch_semester'
    ];

    let score = 0;
    let maxScore = 0;

    // Calculate required fields score (40% of total)
    maxScore += requiredFields.length * 4;
    requiredFields.forEach(field => {
      const value = profile[field];
      if (value !== null && value !== undefined && value !== '') {
        score += 4;
      }
    });

    // Calculate important fields score (40% of total)
    maxScore += importantFields.length * 2;
    importantFields.forEach(field => {
      const value = profile[field];
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            score += 2;
          }
        } else {
          score += 2;
        }
      }
    });

    // Calculate optional fields score (20% of total)
    maxScore += optionalFields.length * 1;
    optionalFields.forEach(field => {
      const value = profile[field];
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            score += 1;
          }
        } else {
          score += 1;
        }
      }
    });

    // Debug logging
    console.log('Profile completion calculation:', {
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      requiredFields: requiredFields.map(field => ({ field, value: profile[field], hasValue: profile[field] !== null && profile[field] !== undefined && profile[field] !== '' })),
      importantFields: importantFields.map(field => ({ field, value: profile[field], hasValue: profile[field] !== null && profile[field] !== undefined && profile[field] !== '' })),
      optionalFields: optionalFields.map(field => ({ field, value: profile[field], hasValue: profile[field] !== null && profile[field] !== undefined && profile[field] !== '' }))
    });

    return Math.min(Math.round((score / maxScore) * 100), 100);
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleCardClick = (path) => {
    navigate(path);
  };

  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : 'U';
  };

  return (
    <DashboardContainer>
      <Navbar>
        <NavbarBrand>Career Platform</NavbarBrand>
        <NavbarNav>
          <NavLink onClick={() => handleCardClick('/dashboard')}>Dashboard</NavLink>
          <NavLink onClick={() => handleCardClick('/profile')}>Profile</NavLink>
          <NavLink onClick={() => handleCardClick('/jobs')}>Jobs</NavLink>
          <NavLink onClick={() => handleCardClick('/resume')}>Resume</NavLink>
        </NavbarNav>
        <NavUser>
          <UserAvatar>{getInitials(user?.username)}</UserAvatar>
          <span>{user?.username}</span>
          <LogoutButton onClick={handleLogout} title="Logout">
            <LogOut size={20} />
          </LogoutButton>
        </NavUser>
      </Navbar>

      <DashboardHeader>
        <DashboardTitle>Welcome back, {user?.username}!</DashboardTitle>
        <DashboardSubtitle>
          Ready to take the next step in your career? Let's get started.
        </DashboardSubtitle>
      </DashboardHeader>

      <StatsGrid>
        <StatCard>
          <StatNumber>{stats.applications}</StatNumber>
          <StatLabel>Job Applications</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.recommendations}</StatNumber>
          <StatLabel>Recommendations</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.courses}</StatNumber>
          <StatLabel>Courses Enrolled</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.profileComplete}%</StatNumber>
          <StatLabel>Profile Complete</StatLabel>
        </StatCard>
      </StatsGrid>

      <DashboardGrid>
        <DashboardCard onClick={() => handleCardClick('/profile')}>
          <CardIcon bgColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
            <User size={24} />
          </CardIcon>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Fill out your personal, academic, and professional details to get personalized recommendations.
          </CardDescription>
          <CardAction>
            Get Started <ArrowRight size={16} />
          </CardAction>
        </DashboardCard>

        <DashboardCard onClick={() => handleCardClick('/jobs')}>
          <CardIcon bgColor="linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)">
            <Briefcase size={24} />
          </CardIcon>
          <CardTitle>Find Your Dream Job</CardTitle>
          <CardDescription>
            Discover job opportunities tailored to your skills and preferences with our AI-powered recommendations.
          </CardDescription>
          <CardAction>
            Browse Jobs <ArrowRight size={16} />
          </CardAction>
        </DashboardCard>

        <DashboardCard onClick={() => handleCardClick('/resume')}>
          <CardIcon bgColor="linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)">
            <FileText size={24} />
          </CardIcon>
          <CardTitle>Build Your Resume</CardTitle>
          <CardDescription>
            Create a professional resume with our smart builder or upload and enhance your existing resume.
          </CardDescription>
          <CardAction>
            Build Resume <ArrowRight size={16} />
          </CardAction>
        </DashboardCard>

        <DashboardCard onClick={() => handleCardClick('/courses')}>
          <CardIcon bgColor="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
            <BookOpen size={24} />
          </CardIcon>
          <CardTitle>Upskill Yourself</CardTitle>
          <CardDescription>
            Take recommended courses to improve your skills and increase your chances of landing your dream job.
          </CardDescription>
          <CardAction>
            View Courses <ArrowRight size={16} />
          </CardAction>
        </DashboardCard>
      </DashboardGrid>
    </DashboardContainer>
  );
};

export default Dashboard;
