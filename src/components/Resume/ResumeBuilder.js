import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import {
  FileText,
  Download,
  Upload,
  Edit3,
  Save,
  ArrowLeft,
  Eye,
  Plus,
  Trash2,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Award,
  Code
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ResumeContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
`;

const ResumeHeader = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

const ResumeTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
`;

const ResumeSubtitle = styled.p`
  color: #6b7280;
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

const ResumeControls = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
`;

const ControlButton = styled.button`
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
  
  &.success {
    background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(86, 171, 47, 0.3);
    }
  }
`;

const FileInput = styled.input`
  display: none;
`;

const ResumePreview = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  min-height: 800px;
  font-family: 'Times New Roman', serif;
  line-height: 1.6;
`;

const ResumeHeaderSection = styled.div`
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e5e7eb;
`;

const ResumeName = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
`;

const ResumeContact = styled.div`
  color: #6b7280;
  font-size: 1rem;
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
`;

const ResumeSection = styled.div`
  margin-bottom: 30px;
`;

const ResumeSectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ResumeItem = styled.div`
  margin-bottom: 20px;
`;

const ItemTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
`;

const ItemSubtitle = styled.p`
  color: #667eea;
  font-weight: 500;
  margin-bottom: 4px;
`;

const ItemDate = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 8px;
`;

const ItemDescription = styled.p`
  color: #374151;
  margin-bottom: 8px;
`;

const SkillsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SkillTag = styled.span`
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const EditForm = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
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

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AddButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  
  &:hover {
    background: #5a67d8;
  }
`;

const RemoveButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-left: 10px;
  
  &:hover {
    background: #dc2626;
  }
`;

const SaveModal = styled.div`
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

const SaveModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  width: 90%;
  max-width: 400px;
`;

const SaveModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SaveModalTitle = styled.h2`
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

const SaveModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SaveModalInput = styled.input`
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

const SaveModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const SaveModalButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
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
    }
  }
`;

const ResumeBuilder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const resumeRef = useRef(null);
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: {
      technical: [],
      soft: []
    },
    projects: [],
    certifications: []
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savedResumes, setSavedResumes] = useState([]);
  const [showSavedResumes, setShowSavedResumes] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [resumeName, setResumeName] = useState('');

  useEffect(() => {
    loadResumeData();
  }, []);

  const loadResumeData = async () => {
    try {
      // Load from profile data
      const response = await axios.get('/api/profile', {
        withCredentials: true
      });

      if (response.data) {
        const profile = response.data;
        setResumeData({
          personalInfo: {
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            email: user?.email || '',
            phone: profile.phone || '',
            address: profile.address || '',
            city: profile.city || '',
            state: profile.state || '',
            pincode: profile.pincode || ''
          },
          summary: profile.career_interests || '',
          experience: profile.internships ? [{
            title: 'Experience',
            company: 'Various',
            location: '',
            startDate: '',
            endDate: '',
            description: profile.internships
          }] : [],
          education: [{
            degree: profile.highest_qualification || '',
            school: profile.university || '',
            location: '',
            startDate: '',
            endDate: profile.graduation_year ? profile.graduation_year.toString() : '',
            gpa: profile.cgpa || ''
          }],
          skills: {
            technical: [
              ...(profile.programming_languages ? JSON.parse(profile.programming_languages) : []),
              ...(profile.frameworks ? JSON.parse(profile.frameworks) : []),
              ...(profile.databases ? JSON.parse(profile.databases) : []),
              ...(profile.tools ? JSON.parse(profile.tools) : [])
            ],
            soft: profile.soft_skills ? JSON.parse(profile.soft_skills) : []
          },
          projects: profile.projects ? [{
            title: 'Projects',
            description: profile.projects,
            technologies: profile.tech_stack || ''
          }] : [],
          certifications: profile.certifications ? [{
            name: 'Certifications',
            issuer: '',
            date: '',
            description: profile.certifications
          }] : []
        });
      }
    } catch (error) {
      console.error('Error loading resume data:', error);
    }
  };

  const handleInputChange = (section, field, value, index = null) => {
    setResumeData(prev => {
      const newData = { ...prev };

      if (index !== null) {
        // For arrays
        newData[section] = [...newData[section]];
        newData[section][index] = { ...newData[section][index], [field]: value };
      } else if (section === 'personalInfo') {
        // For personal info
        newData.personalInfo = { ...newData.personalInfo, [field]: value };
      } else if (section === 'skills') {
        // For skills
        newData.skills = { ...newData.skills, [field]: value };
      } else {
        // For simple fields
        newData[section] = value;
      }

      return newData;
    });
  };

  const addItem = (section) => {
    const newItem = {
      experience: { title: '', company: '', location: '', startDate: '', endDate: '', description: '' },
      education: { degree: '', school: '', location: '', startDate: '', endDate: '', gpa: '' },
      projects: { title: '', description: '', technologies: '' },
      certifications: { name: '', issuer: '', date: '', description: '' }
    };

    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], newItem[section]]
    }));
  };

  const removeItem = (section, index) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const addSkill = (skillType) => {
    const skill = prompt(`Enter ${skillType} skill:`);
    if (skill && skill.trim()) {
      setResumeData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          [skillType]: [...prev.skills[skillType], skill.trim()]
        }
      }));
    }
  };

  const removeSkill = (skillType, index) => {
    setResumeData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [skillType]: prev.skills[skillType].filter((_, i) => i !== index)
      }
    }));
  };

  const generatePDF = async () => {
    if (!resumeRef.current) return;

    setLoading(true);
    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}_Resume.pdf`);
      toast.success('Resume downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setLoading(false);
    }
  };

  const saveResume = async () => {
    if (!resumeName.trim()) {
      toast.error('Please enter a resume name');
      return;
    }

    try {
      setLoading(true);
      const resumeToSave = {
        ...resumeData,
        name: resumeName.trim(),
        savedAt: new Date().toISOString()
      };

      // Save resume data to backend
      await axios.post('/api/resume', resumeToSave, {
        withCredentials: true
      });

      // Add to local saved resumes
      setSavedResumes(prev => [...prev, resumeToSave]);
      toast.success('Resume saved successfully!');
      setEditing(false);
      setShowSaveModal(false);
      setResumeName('');
    } catch (error) {
      console.error('Error saving resume:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Unknown error occurred';
      toast.error(`Failed to save resume: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClick = () => {
    setResumeName(`Resume_${Date.now()}`);
    setShowSaveModal(true);
  };

  const loadSavedResumes = async () => {
    try {
      // Load saved resumes from backend
      const response = await axios.get('/api/resume', {
        withCredentials: true
      });
      setSavedResumes(response.data || []);
    } catch (error) {
      console.error('Error loading saved resumes:', error);
    }
  };

  const loadResume = (resume) => {
    setResumeData(resume);
    setShowSavedResumes(false);
    setEditing(false);
    toast.success('Resume loaded successfully!');
  };

  const deleteResume = async (resumeId) => {
    try {
      await axios.delete(`/api/resume/${resumeId}`, {
        withCredentials: true
      });
      setSavedResumes(prev => prev.filter(r => r.id !== resumeId));
      toast.success('Resume deleted successfully!');
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error('Failed to delete resume');
    }
  };

  const uploadResume = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      // Handle PDF upload and parsing
      toast.info('PDF parsing feature coming soon!');
    } else {
      toast.error('Please upload a PDF file');
    }
  };

  return (
    <ResumeContainer>
      <BackButton onClick={() => navigate('/dashboard')}>
        <ArrowLeft size={20} />
        Back to Dashboard
      </BackButton>

      <ResumeHeader>
        <ResumeTitle>Resume Builder</ResumeTitle>
        <ResumeSubtitle>
          Create a professional resume that stands out to employers
        </ResumeSubtitle>
      </ResumeHeader>

      <ResumeControls>
        <ControlButton
          className={editing ? 'secondary' : 'primary'}
          onClick={() => setEditing(!editing)}
        >
          {editing ? <Eye size={16} /> : <Edit3 size={16} />}
          {editing ? 'Preview' : 'Edit Resume'}
        </ControlButton>

        {editing && (
          <ControlButton className="success" onClick={handleSaveClick} disabled={loading}>
            <Save size={16} />
            {loading ? 'Saving...' : 'Save Resume'}
          </ControlButton>
        )}

        <ControlButton
          className="secondary"
          onClick={() => {
            setShowSavedResumes(!showSavedResumes);
            if (!showSavedResumes) loadSavedResumes();
          }}
        >
          <FileText size={16} />
          {showSavedResumes ? 'Hide Saved' : 'Saved Resumes'}
        </ControlButton>

        <ControlButton className="primary" onClick={generatePDF} disabled={loading}>
          <Download size={16} />
          {loading ? 'Generating...' : 'Download PDF'}
        </ControlButton>

        <FileInput
          type="file"
          accept=".pdf"
          onChange={uploadResume}
          id="resume-upload"
        />
        <ControlButton
          className="secondary"
          onClick={() => document.getElementById('resume-upload').click()}
        >
          <Upload size={16} />
          Upload PDF
        </ControlButton>
      </ResumeControls>

      {showSavedResumes && (
        <EditForm>
          <ResumeSectionTitle>
            <FileText size={20} />
            Saved Resumes
          </ResumeSectionTitle>
          {savedResumes.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>
              No saved resumes found. Create and save your first resume!
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {savedResumes.map((resume, index) => (
                <div key={index} style={{
                  border: '1px solid #e5e7eb',
                  padding: '16px',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', color: '#1f2937' }}>
                      {resume.name || `Resume ${index + 1}`}
                    </h4>
                    <p style={{ margin: '0', color: '#6b7280', fontSize: '0.9rem' }}>
                      {resume.personalInfo?.firstName} {resume.personalInfo?.lastName}
                    </p>
                    <p style={{ margin: '0', color: '#6b7280', fontSize: '0.8rem' }}>
                      Saved: {new Date(resume.savedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <ControlButton
                      className="primary"
                      onClick={() => loadResume(resume)}
                      style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                    >
                      Load
                    </ControlButton>
                    <ControlButton
                      className="secondary"
                      onClick={() => deleteResume(resume.id)}
                      style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                    >
                      Delete
                    </ControlButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </EditForm>
      )}

      {editing ? (
        <EditForm>
          {/* Personal Information */}
          <ResumeSectionTitle>
            <User size={20} />
            Personal Information
          </ResumeSectionTitle>

          <FormRow>
            <FormGroup>
              <FormLabel>First Name</FormLabel>
              <FormInput
                type="text"
                value={resumeData.personalInfo.firstName}
                onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Last Name</FormLabel>
              <FormInput
                type="text"
                value={resumeData.personalInfo.lastName}
                onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel>Email</FormLabel>
              <FormInput
                type="email"
                value={resumeData.personalInfo.email}
                onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Phone</FormLabel>
              <FormInput
                type="tel"
                value={resumeData.personalInfo.phone}
                onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <FormLabel>Address</FormLabel>
            <FormInput
              type="text"
              value={resumeData.personalInfo.address}
              onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
            />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <FormLabel>City</FormLabel>
              <FormInput
                type="text"
                value={resumeData.personalInfo.city}
                onChange={(e) => handleInputChange('personalInfo', 'city', e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>State</FormLabel>
              <FormInput
                type="text"
                value={resumeData.personalInfo.state}
                onChange={(e) => handleInputChange('personalInfo', 'state', e.target.value)}
              />
            </FormGroup>
          </FormRow>

          {/* Summary */}
          <ResumeSectionTitle>
            <FileText size={20} />
            Professional Summary
          </ResumeSectionTitle>
          <FormGroup>
            <FormTextarea
              value={resumeData.summary}
              onChange={(e) => handleInputChange('summary', null, e.target.value)}
              placeholder="Write a brief summary of your professional background and career goals..."
            />
          </FormGroup>

          {/* Skills */}
          <ResumeSectionTitle>
            <Code size={20} />
            Skills
          </ResumeSectionTitle>

          <FormGroup>
            <FormLabel>Technical Skills</FormLabel>
            <SkillsList>
              {resumeData.skills.technical.map((skill, index) => (
                <SkillTag key={index}>
                  {skill}
                  <RemoveButton onClick={() => removeSkill('technical', index)}>×</RemoveButton>
                </SkillTag>
              ))}
            </SkillsList>
            <AddButton onClick={() => addSkill('technical')}>
              <Plus size={16} />
              Add Technical Skill
            </AddButton>
          </FormGroup>

          <FormGroup>
            <FormLabel>Soft Skills</FormLabel>
            <SkillsList>
              {resumeData.skills.soft.map((skill, index) => (
                <SkillTag key={index}>
                  {skill}
                  <RemoveButton onClick={() => removeSkill('soft', index)}>×</RemoveButton>
                </SkillTag>
              ))}
            </SkillsList>
            <AddButton onClick={() => addSkill('soft')}>
              <Plus size={16} />
              Add Soft Skill
            </AddButton>
          </FormGroup>

          {/* Experience */}
          <ResumeSectionTitle>
            <Briefcase size={20} />
            Experience
          </ResumeSectionTitle>

          {resumeData.experience.map((exp, index) => (
            <div key={index} style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <FormRow>
                <FormGroup>
                  <FormLabel>Job Title</FormLabel>
                  <FormInput
                    type="text"
                    value={exp.title}
                    onChange={(e) => handleInputChange('experience', 'title', e.target.value, index)}
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Company</FormLabel>
                  <FormInput
                    type="text"
                    value={exp.company}
                    onChange={(e) => handleInputChange('experience', 'company', e.target.value, index)}
                  />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <FormLabel>Start Date</FormLabel>
                  <FormInput
                    type="text"
                    value={exp.startDate}
                    onChange={(e) => handleInputChange('experience', 'startDate', e.target.value, index)}
                    placeholder="MM/YYYY"
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>End Date</FormLabel>
                  <FormInput
                    type="text"
                    value={exp.endDate}
                    onChange={(e) => handleInputChange('experience', 'endDate', e.target.value, index)}
                    placeholder="MM/YYYY or Present"
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <FormLabel>Description</FormLabel>
                <FormTextarea
                  value={exp.description}
                  onChange={(e) => handleInputChange('experience', 'description', e.target.value, index)}
                  placeholder="Describe your responsibilities and achievements..."
                />
              </FormGroup>

              <RemoveButton onClick={() => removeItem('experience', index)}>
                <Trash2 size={16} />
                Remove
              </RemoveButton>
            </div>
          ))}

          <AddButton onClick={() => addItem('experience')}>
            <Plus size={16} />
            Add Experience
          </AddButton>

          {/* Education */}
          <ResumeSectionTitle>
            <GraduationCap size={20} />
            Education
          </ResumeSectionTitle>

          {resumeData.education.map((edu, index) => (
            <div key={index} style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <FormRow>
                <FormGroup>
                  <FormLabel>Degree</FormLabel>
                  <FormInput
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleInputChange('education', 'degree', e.target.value, index)}
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>School/University</FormLabel>
                  <FormInput
                    type="text"
                    value={edu.school}
                    onChange={(e) => handleInputChange('education', 'school', e.target.value, index)}
                  />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <FormLabel>Graduation Year</FormLabel>
                  <FormInput
                    type="text"
                    value={edu.endDate}
                    onChange={(e) => handleInputChange('education', 'endDate', e.target.value, index)}
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>GPA/Percentage</FormLabel>
                  <FormInput
                    type="text"
                    value={edu.gpa}
                    onChange={(e) => handleInputChange('education', 'gpa', e.target.value, index)}
                  />
                </FormGroup>
              </FormRow>

              <RemoveButton onClick={() => removeItem('education', index)}>
                <Trash2 size={16} />
                Remove
              </RemoveButton>
            </div>
          ))}

          <AddButton onClick={() => addItem('education')}>
            <Plus size={16} />
            Add Education
          </AddButton>
        </EditForm>
      ) : (
        <ResumePreview ref={resumeRef}>
          <ResumeHeaderSection>
            <ResumeName>
              {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
            </ResumeName>
            <ResumeContact>
              {resumeData.personalInfo.email && (
                <span><Mail size={16} /> {resumeData.personalInfo.email}</span>
              )}
              {resumeData.personalInfo.phone && (
                <span><Phone size={16} /> {resumeData.personalInfo.phone}</span>
              )}
              {(resumeData.personalInfo.city || resumeData.personalInfo.state) && (
                <span><MapPin size={16} /> {resumeData.personalInfo.city}, {resumeData.personalInfo.state}</span>
              )}
            </ResumeContact>
          </ResumeHeaderSection>

          {resumeData.summary && (
            <ResumeSection>
              <ResumeSectionTitle>
                <FileText size={20} />
                Professional Summary
              </ResumeSectionTitle>
              <ItemDescription>{resumeData.summary}</ItemDescription>
            </ResumeSection>
          )}

          {resumeData.skills.technical.length > 0 && (
            <ResumeSection>
              <ResumeSectionTitle>
                <Code size={20} />
                Technical Skills
              </ResumeSectionTitle>
              <SkillsList>
                {resumeData.skills.technical.map((skill, index) => (
                  <SkillTag key={index}>{skill}</SkillTag>
                ))}
              </SkillsList>
            </ResumeSection>
          )}

          {resumeData.experience.length > 0 && (
            <ResumeSection>
              <ResumeSectionTitle>
                <Briefcase size={20} />
                Experience
              </ResumeSectionTitle>
              {resumeData.experience.map((exp, index) => (
                <ResumeItem key={index}>
                  <ItemTitle>{exp.title}</ItemTitle>
                  <ItemSubtitle>{exp.company}</ItemSubtitle>
                  <ItemDate>{exp.startDate} - {exp.endDate}</ItemDate>
                  <ItemDescription>{exp.description}</ItemDescription>
                </ResumeItem>
              ))}
            </ResumeSection>
          )}

          {resumeData.education.length > 0 && (
            <ResumeSection>
              <ResumeSectionTitle>
                <GraduationCap size={20} />
                Education
              </ResumeSectionTitle>
              {resumeData.education.map((edu, index) => (
                <ResumeItem key={index}>
                  <ItemTitle>{edu.degree}</ItemTitle>
                  <ItemSubtitle>{edu.school}</ItemSubtitle>
                  <ItemDate>{edu.endDate} {edu.gpa && `• GPA: ${edu.gpa}`}</ItemDate>
                </ResumeItem>
              ))}
            </ResumeSection>
          )}

          {resumeData.projects.length > 0 && (
            <ResumeSection>
              <ResumeSectionTitle>
                <Award size={20} />
                Projects
              </ResumeSectionTitle>
              {resumeData.projects.map((project, index) => (
                <ResumeItem key={index}>
                  <ItemTitle>{project.title}</ItemTitle>
                  <ItemDescription>{project.description}</ItemDescription>
                  {project.technologies && (
                    <ItemDescription><strong>Technologies:</strong> {project.technologies}</ItemDescription>
                  )}
                </ResumeItem>
              ))}
            </ResumeSection>
          )}
        </ResumePreview>
      )}

      {showSaveModal && (
        <SaveModal>
          <SaveModalContent>
            <SaveModalHeader>
              <SaveModalTitle>Save Resume</SaveModalTitle>
              <CloseButton onClick={() => setShowSaveModal(false)}>×</CloseButton>
            </SaveModalHeader>
            <SaveModalForm onSubmit={(e) => { e.preventDefault(); saveResume(); }}>
              <SaveModalInput
                type="text"
                value={resumeName}
                onChange={(e) => setResumeName(e.target.value)}
                placeholder="Enter resume name"
                autoFocus
              />
              <SaveModalButtons>
                <SaveModalButton
                  type="button"
                  className="secondary"
                  onClick={() => setShowSaveModal(false)}
                >
                  Cancel
                </SaveModalButton>
                <SaveModalButton
                  type="submit"
                  className="primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Resume'}
                </SaveModalButton>
              </SaveModalButtons>
            </SaveModalForm>
          </SaveModalContent>
        </SaveModal>
      )}
    </ResumeContainer>
  );
};

export default ResumeBuilder;
