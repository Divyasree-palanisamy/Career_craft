import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Star,
  ArrowLeft,
  Filter,
  Search,
  ExternalLink,
  Bookmark,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const JobsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const JobsHeader = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const JobsTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
`;

const JobsSubtitle = styled.p`
  color: #1f2937;
  font-size: 1.1rem;
`;

const BackButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
  }
`;

const SearchAndFilter = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 300px;
  padding: 12px 16px 12px 45px;
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

const SearchIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;
`;

const FilterSelect = styled.select`
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

const JobCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const JobHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const JobTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
`;

const JobCompany = styled.p`
  color: #667eea;
  font-weight: 500;
  font-size: 1.1rem;
`;

const BookmarkButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.saved ? '#667eea' : '#9ca3af'};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }
`;

const JobMeta = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const JobMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1f2937;
  font-size: 0.9rem;
`;

const JobDescription = styled.p`
  color: #374151;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const JobSkills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
`;

const SkillTag = styled.span`
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const MatchScore = styled.div`
  background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 20px;
  display: inline-block;
`;

const MatchReason = styled.p`
  color: #1f2937;
  font-size: 0.9rem;
  margin-bottom: 20px;
  font-style: italic;
`;

const JobActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
    }
  }
  
  &.secondary {
    background: #f8f9fa;
    color: #495057;
    border: 1px solid #dee2e6;
    
    &:hover {
      background: #e9ecef;
      transform: translateY(-1px);
    }
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #1f2937;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
`;

const EmptyDescription = styled.p`
  font-size: 1rem;
  margin-bottom: 20px;
`;

const JobRecommendations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [savedJobs, setSavedJobs] = useState(new Set());

  useEffect(() => {
    fetchJobRecommendations();
  }, []);

  const fetchJobRecommendations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/job-recommendations', {
        withCredentials: true
      });
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error fetching job recommendations:', error);
      toast.error('Failed to load job recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      const response = await axios.post('/api/apply-job', {
        job_id: jobId
      }, {
        withCredentials: true
      });
      
      toast.success('Application submitted successfully!');
      // Update the job status in the UI
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === jobId 
            ? { ...job, applied: true, status: 'Applied' }
            : job
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to apply for job');
    }
  };

  const handleSaveJob = (jobId) => {
    setSavedJobs(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(jobId)) {
        newSaved.delete(jobId);
        toast.info('Job removed from saved');
      } else {
        newSaved.add(jobId);
        toast.success('Job saved successfully');
      }
      return newSaved;
    });
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.skills_required?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'applied' && job.applied) ||
                         (filterType === 'saved' && savedJobs.has(job.id)) ||
                         (filterType === 'recommended' && job.recommendation_score > 0.5);
    
    return matchesSearch && matchesFilter;
  });

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not specified';
    if (!min) return `Up to ₹${max}L`;
    if (!max) return `₹${min}L+`;
    return `₹${min}L - ₹${max}L`;
  };

  const getMatchColor = (score) => {
    if (score >= 0.8) return 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)';
    if (score >= 0.6) return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    return 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)';
  };

  if (loading) {
    return (
      <JobsContainer>
        <LoadingSpinner>
          <Spinner />
        </LoadingSpinner>
      </JobsContainer>
    );
  }

  return (
    <JobsContainer>
      <BackButton onClick={() => navigate('/dashboard')}>
        <ArrowLeft size={20} />
        Back to Dashboard
      </BackButton>

      <JobsHeader>
        <JobsTitle>Job Recommendations</JobsTitle>
        <JobsSubtitle>
          Discover opportunities tailored to your skills and preferences
        </JobsSubtitle>
      </JobsHeader>

      <SearchAndFilter>
        <SearchContainer>
          <SearchIcon>
            <Search size={20} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search jobs, companies, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        
        <FilterSelect
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Jobs</option>
          <option value="recommended">Recommended</option>
          <option value="saved">Saved Jobs</option>
          <option value="applied">Applied</option>
        </FilterSelect>
      </SearchAndFilter>

      {filteredJobs.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <Briefcase size={64} />
          </EmptyIcon>
          <EmptyTitle>No jobs found</EmptyTitle>
          <EmptyDescription>
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Complete your profile to get personalized job recommendations'
            }
          </EmptyDescription>
          {!searchTerm && filterType === 'all' && (
            <ActionButton 
              className="primary"
              onClick={() => navigate('/profile')}
            >
              Complete Profile
            </ActionButton>
          )}
        </EmptyState>
      ) : (
        filteredJobs.map(job => (
          <JobCard key={job.id}>
            <JobHeader>
              <div>
                <JobTitle>{job.title}</JobTitle>
                <JobCompany>{job.company}</JobCompany>
              </div>
              <BookmarkButton
                saved={savedJobs.has(job.id)}
                onClick={() => handleSaveJob(job.id)}
                title={savedJobs.has(job.id) ? 'Remove from saved' : 'Save job'}
              >
                {savedJobs.has(job.id) ? <Check size={24} /> : <Bookmark size={24} />}
              </BookmarkButton>
            </JobHeader>

            {job.recommendation_score && (
              <>
                <MatchScore style={{ background: getMatchColor(job.recommendation_score) }}>
                  {Math.round(job.recommendation_score * 100)}% Match
                </MatchScore>
                {job.recommendation_reason && (
                  <MatchReason>{job.recommendation_reason}</MatchReason>
                )}
              </>
            )}

            <JobMeta>
              <JobMetaItem>
                <MapPin size={16} />
                {job.location || 'Location not specified'}
              </JobMetaItem>
              <JobMetaItem>
                <Clock size={16} />
                {job.job_type || 'Full-time'}
              </JobMetaItem>
              <JobMetaItem>
                <DollarSign size={16} />
                {formatSalary(job.salary_min, job.salary_max)}
              </JobMetaItem>
              <JobMetaItem>
                <Users size={16} />
                {job.experience_required || 0} years experience
              </JobMetaItem>
            </JobMeta>

            <JobDescription>
              {job.description || 'No description available'}
            </JobDescription>

            {job.skills_required && (
              <JobSkills>
                {job.skills_required.split(',').map((skill, index) => (
                  <SkillTag key={index}>{skill.trim()}</SkillTag>
                ))}
              </JobSkills>
            )}

            <JobActions>
              <ActionButton 
                className="secondary"
                onClick={() => window.open(job.company_website || '#', '_blank')}
              >
                <ExternalLink size={16} />
                Company Info
              </ActionButton>
              <ActionButton 
                className="primary"
                onClick={() => handleApply(job.id)}
                disabled={job.applied}
              >
                {job.applied ? 'Applied' : 'Apply Now'}
              </ActionButton>
            </JobActions>
          </JobCard>
        ))
      )}
    </JobsContainer>
  );
};

export default JobRecommendations;
