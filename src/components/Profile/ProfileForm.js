import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';
import {
  User,
  GraduationCap,
  Briefcase,
  Code,
  Heart,
  MapPin,
  Save,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MessageBox from '../Common/MessageBox';
import axios from 'axios';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const ProfileHeader = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

const ProfileTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
`;

const ProfileSubtitle = styled.p`
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

const ProfileForm = styled.form`
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const FormSection = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || '1fr 1fr'};
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
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

const SkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const SkillTag = styled.span`
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RemoveSkillButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  
  &:hover {
    background: rgba(102, 126, 234, 0.2);
  }
`;

const AddSkillInput = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const SkillInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
`;

const AddSkillButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #5a67d8;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
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

const ProfileFormComponent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    // Personal Information
    first_name: '',
    last_name: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',

    // Academic Information
    highest_qualification: '',
    university: '',
    graduation_year: '',
    cgpa: '',
    field_of_study: '',

    // Skills
    technical_skills: [],
    soft_skills: [],
    programming_languages: [],
    frameworks: [],
    databases: [],
    tools: [],

    // Experience
    total_experience: 0,
    internships: '',
    projects: '',
    certifications: '',

    // Interests and Preferences
    career_interests: '',
    preferred_locations: '',
    salary_expectation: '',
    work_mode: '',

    // Tech Stack
    tech_stack: '',
    batch_semester: ''
  });

  const [newSkill, setNewSkill] = useState({
    technical_skills: '',
    soft_skills: '',
    programming_languages: '',
    frameworks: '',
    databases: '',
    tools: ''
  });

  useEffect(() => {
    // Load existing profile data if available
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const response = await axios.get('/api/profile', {
        withCredentials: true
      });
      if (response.data) {
        setFormData(response.data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSkill = (skillType) => {
    const skill = newSkill[skillType].trim();
    if (skill && !formData[skillType].includes(skill)) {
      setFormData(prev => ({
        ...prev,
        [skillType]: [...prev[skillType], skill]
      }));
      setNewSkill(prev => ({
        ...prev,
        [skillType]: ''
      }));
      setMessage({
        type: 'success',
        title: 'Skill Added!',
        text: `${skill} has been added to your ${skillType.replace('_', ' ')}.`
      });
      setTimeout(() => setMessage(null), 3000);
    } else if (skill && formData[skillType].includes(skill)) {
      setMessage({
        type: 'warning',
        title: 'Skill Already Exists',
        text: `${skill} is already in your ${skillType.replace('_', ' ')}.`
      });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const removeSkill = (skillType, skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      [skillType]: prev[skillType].filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/profile', formData, {
        withCredentials: true
      });
      setMessage({
        type: 'success',
        title: 'Profile Updated!',
        text: 'Your profile has been updated successfully. Redirecting to dashboard...'
      });

      // Redirect to dashboard after successful submission
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Unknown error occurred';
      setMessage({
        type: 'error',
        title: 'Update Failed',
        text: `Failed to update profile: ${errorMessage}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileContainer>
      <BackButton onClick={() => navigate('/dashboard')}>
        <ArrowLeft size={20} />
        Back to Dashboard
      </BackButton>

      <ProfileHeader>
        <ProfileTitle>Complete Your Profile</ProfileTitle>
        <ProfileSubtitle>
          Help us understand your background to provide personalized recommendations
        </ProfileSubtitle>
      </ProfileHeader>

      <ProfileForm onSubmit={handleSubmit}>
        {/* Personal Information */}
        <FormSection>
          <SectionTitle>
            <User size={24} />
            Personal Information
          </SectionTitle>

          <FormRow>
            <FormGroup>
              <FormLabel>First Name *</FormLabel>
              <FormInput
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Last Name *</FormLabel>
              <FormInput
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel>Phone Number</FormLabel>
              <FormInput
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Date of Birth</FormLabel>
              <FormInput
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleInputChange}
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel>Gender</FormLabel>
              <FormSelect
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </FormSelect>
            </FormGroup>
            <FormGroup>
              <FormLabel>City</FormLabel>
              <FormInput
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel>State</FormLabel>
              <FormInput
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Pincode</FormLabel>
              <FormInput
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <FormLabel>Address</FormLabel>
            <FormTextarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter your full address"
            />
          </FormGroup>
        </FormSection>

        {/* Academic Information */}
        <FormSection>
          <SectionTitle>
            <GraduationCap size={24} />
            Academic Information
          </SectionTitle>

          <FormRow>
            <FormGroup>
              <FormLabel>Highest Qualification *</FormLabel>
              <FormSelect
                name="highest_qualification"
                value={formData.highest_qualification}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Qualification</option>
                <option value="High School">High School</option>
                <option value="Diploma">Diploma</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="PhD">PhD</option>
              </FormSelect>
            </FormGroup>
            <FormGroup>
              <FormLabel>Field of Study</FormLabel>
              <FormInput
                type="text"
                name="field_of_study"
                value={formData.field_of_study}
                onChange={handleInputChange}
                placeholder="e.g., Computer Science, Engineering"
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel>University/College</FormLabel>
              <FormInput
                type="text"
                name="university"
                value={formData.university}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Graduation Year</FormLabel>
              <FormInput
                type="number"
                name="graduation_year"
                value={formData.graduation_year}
                onChange={handleInputChange}
                min="1990"
                max="2030"
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel>CGPA/Percentage</FormLabel>
              <FormInput
                type="text"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleInputChange}
                placeholder="e.g., 8.5 or 85%"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Batch/Semester</FormLabel>
              <FormInput
                type="text"
                name="batch_semester"
                value={formData.batch_semester}
                onChange={handleInputChange}
                placeholder="e.g., 2023-2027, 6th Semester"
              />
            </FormGroup>
          </FormRow>
        </FormSection>

        {/* Skills Section */}
        <FormSection>
          <SectionTitle>
            <Code size={24} />
            Skills & Technologies
          </SectionTitle>

          <FormGroup>
            <FormLabel>Programming Languages</FormLabel>
            <SkillsContainer>
              {formData.programming_languages.map((skill, index) => (
                <SkillTag key={index}>
                  {skill}
                  <RemoveSkillButton onClick={() => removeSkill('programming_languages', skill)}>
                    ×
                  </RemoveSkillButton>
                </SkillTag>
              ))}
            </SkillsContainer>
            <AddSkillInput>
              <SkillInput
                type="text"
                value={newSkill.programming_languages}
                onChange={(e) => setNewSkill(prev => ({ ...prev, programming_languages: e.target.value }))}
                placeholder="e.g., Python, JavaScript, Java"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill('programming_languages'))}
              />
              <AddSkillButton type="button" onClick={() => addSkill('programming_languages')}>
                Add
              </AddSkillButton>
            </AddSkillInput>
          </FormGroup>

          <FormGroup>
            <FormLabel>Frameworks & Libraries</FormLabel>
            <SkillsContainer>
              {formData.frameworks.map((skill, index) => (
                <SkillTag key={index}>
                  {skill}
                  <RemoveSkillButton onClick={() => removeSkill('frameworks', skill)}>
                    ×
                  </RemoveSkillButton>
                </SkillTag>
              ))}
            </SkillsContainer>
            <AddSkillInput>
              <SkillInput
                type="text"
                value={newSkill.frameworks}
                onChange={(e) => setNewSkill(prev => ({ ...prev, frameworks: e.target.value }))}
                placeholder="e.g., React, Django, Spring Boot"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill('frameworks'))}
              />
              <AddSkillButton type="button" onClick={() => addSkill('frameworks')}>
                Add
              </AddSkillButton>
            </AddSkillInput>
          </FormGroup>

          <FormGroup>
            <FormLabel>Databases</FormLabel>
            <SkillsContainer>
              {formData.databases.map((skill, index) => (
                <SkillTag key={index}>
                  {skill}
                  <RemoveSkillButton onClick={() => removeSkill('databases', skill)}>
                    ×
                  </RemoveSkillButton>
                </SkillTag>
              ))}
            </SkillsContainer>
            <AddSkillInput>
              <SkillInput
                type="text"
                value={newSkill.databases}
                onChange={(e) => setNewSkill(prev => ({ ...prev, databases: e.target.value }))}
                placeholder="e.g., MySQL, MongoDB, PostgreSQL"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill('databases'))}
              />
              <AddSkillButton type="button" onClick={() => addSkill('databases')}>
                Add
              </AddSkillButton>
            </AddSkillInput>
          </FormGroup>

          <FormGroup>
            <FormLabel>Tools & Technologies</FormLabel>
            <SkillsContainer>
              {formData.tools.map((skill, index) => (
                <SkillTag key={index}>
                  {skill}
                  <RemoveSkillButton onClick={() => removeSkill('tools', skill)}>
                    ×
                  </RemoveSkillButton>
                </SkillTag>
              ))}
            </SkillsContainer>
            <AddSkillInput>
              <SkillInput
                type="text"
                value={newSkill.tools}
                onChange={(e) => setNewSkill(prev => ({ ...prev, tools: e.target.value }))}
                placeholder="e.g., Git, Docker, AWS, VS Code"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill('tools'))}
              />
              <AddSkillButton type="button" onClick={() => addSkill('tools')}>
                Add
              </AddSkillButton>
            </AddSkillInput>
          </FormGroup>
        </FormSection>

        {/* Experience Section */}
        <FormSection>
          <SectionTitle>
            <Briefcase size={24} />
            Experience & Projects
          </SectionTitle>

          <FormRow>
            <FormGroup>
              <FormLabel>Total Experience (Years)</FormLabel>
              <FormInput
                type="number"
                name="total_experience"
                value={formData.total_experience}
                onChange={handleInputChange}
                min="0"
                max="50"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Work Mode Preference</FormLabel>
              <FormSelect
                name="work_mode"
                value={formData.work_mode}
                onChange={handleInputChange}
              >
                <option value="">Select Work Mode</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </FormSelect>
            </FormGroup>
          </FormRow>

          <FormGroup>
            <FormLabel>Internships</FormLabel>
            <FormTextarea
              name="internships"
              value={formData.internships}
              onChange={handleInputChange}
              placeholder="Describe your internship experiences"
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Projects</FormLabel>
            <FormTextarea
              name="projects"
              value={formData.projects}
              onChange={handleInputChange}
              placeholder="Describe your key projects and achievements"
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Certifications</FormLabel>
            <FormTextarea
              name="certifications"
              value={formData.certifications}
              onChange={handleInputChange}
              placeholder="List your certifications and courses"
            />
          </FormGroup>
        </FormSection>

        {/* Preferences Section */}
        <FormSection>
          <SectionTitle>
            <Heart size={24} />
            Career Preferences
          </SectionTitle>

          <FormGroup>
            <FormLabel>Career Interests</FormLabel>
            <FormTextarea
              name="career_interests"
              value={formData.career_interests}
              onChange={handleInputChange}
              placeholder="Describe your career interests and goals"
            />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <FormLabel>Preferred Locations</FormLabel>
              <FormInput
                type="text"
                name="preferred_locations"
                value={formData.preferred_locations}
                onChange={handleInputChange}
                placeholder="e.g., Bangalore, Mumbai, Remote"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Salary Expectation (LPA)</FormLabel>
              <FormInput
                type="number"
                name="salary_expectation"
                value={formData.salary_expectation}
                onChange={handleInputChange}
                placeholder="e.g., 6"
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <FormLabel>Tech Stack Interest</FormLabel>
            <FormTextarea
              name="tech_stack"
              value={formData.tech_stack}
              onChange={handleInputChange}
              placeholder="Describe your preferred tech stack and technologies you want to work with"
            />
          </FormGroup>
        </FormSection>

        <SubmitButton type="submit" disabled={loading}>
          <Save size={20} />
          {loading ? 'Saving Profile...' : 'Save Profile & Get Recommendations'}
        </SubmitButton>
      </ProfileForm>

      {message && (
        <MessageBox
          message={message}
          onClose={() => setMessage(null)}
        />
      )}
    </ProfileContainer>
  );
};

export default ProfileFormComponent;

                onChange={handleInputChange}

                required

              />

            </FormGroup>

            <FormGroup>

              <FormLabel>Last Name *</FormLabel>

              <FormInput

                type="text"

                name="last_name"

                value={formData.last_name}

                onChange={handleInputChange}

                required

              />

            </FormGroup>

          </FormRow>



          <FormRow>

            <FormGroup>

              <FormLabel>Phone Number</FormLabel>

              <FormInput

                type="tel"

                name="phone"

                value={formData.phone}

                onChange={handleInputChange}

              />

            </FormGroup>

            <FormGroup>

              <FormLabel>Date of Birth</FormLabel>

              <FormInput

                type="date"

                name="date_of_birth"

                value={formData.date_of_birth}

                onChange={handleInputChange}

              />

            </FormGroup>

          </FormRow>



          <FormRow>

            <FormGroup>

              <FormLabel>Gender</FormLabel>

              <FormSelect

                name="gender"

                value={formData.gender}

                onChange={handleInputChange}

              >

                <option value="">Select Gender</option>

                <option value="Male">Male</option>

                <option value="Female">Female</option>

                <option value="Other">Other</option>

              </FormSelect>

            </FormGroup>

            <FormGroup>

              <FormLabel>City</FormLabel>

              <FormInput

                type="text"

                name="city"

                value={formData.city}

                onChange={handleInputChange}

              />

            </FormGroup>

          </FormRow>



          <FormRow>

            <FormGroup>

              <FormLabel>State</FormLabel>

              <FormInput

                type="text"

                name="state"

                value={formData.state}

                onChange={handleInputChange}

              />

            </FormGroup>

            <FormGroup>

              <FormLabel>Pincode</FormLabel>

              <FormInput

                type="text"

                name="pincode"

                value={formData.pincode}

                onChange={handleInputChange}

              />

            </FormGroup>

          </FormRow>



          <FormGroup>

            <FormLabel>Address</FormLabel>

            <FormTextarea

              name="address"

              value={formData.address}

              onChange={handleInputChange}

              placeholder="Enter your full address"

            />

          </FormGroup>

        </FormSection>



        {/* Academic Information */}

        <FormSection>

          <SectionTitle>

            <GraduationCap size={24} />

            Academic Information

          </SectionTitle>

          

          <FormRow>

            <FormGroup>

              <FormLabel>Highest Qualification *</FormLabel>

              <FormSelect

                name="highest_qualification"

                value={formData.highest_qualification}

                onChange={handleInputChange}

                required

              >

                <option value="">Select Qualification</option>

                <option value="High School">High School</option>

                <option value="Diploma">Diploma</option>

                <option value="Bachelor's Degree">Bachelor's Degree</option>

                <option value="Master's Degree">Master's Degree</option>

                <option value="PhD">PhD</option>

              </FormSelect>

            </FormGroup>

            <FormGroup>

              <FormLabel>Field of Study</FormLabel>

              <FormInput

                type="text"

                name="field_of_study"

                value={formData.field_of_study}

                onChange={handleInputChange}

                placeholder="e.g., Computer Science, Engineering"

              />

            </FormGroup>

          </FormRow>



          <FormRow>

            <FormGroup>

              <FormLabel>University/College</FormLabel>

              <FormInput

                type="text"

                name="university"

                value={formData.university}

                onChange={handleInputChange}

              />

            </FormGroup>

            <FormGroup>

              <FormLabel>Graduation Year</FormLabel>

              <FormInput

                type="number"

                name="graduation_year"

                value={formData.graduation_year}

                onChange={handleInputChange}

                min="1990"

                max="2030"

              />

            </FormGroup>

          </FormRow>



          <FormRow>

            <FormGroup>

              <FormLabel>CGPA/Percentage</FormLabel>

              <FormInput

                type="text"

                name="cgpa"

                value={formData.cgpa}

                onChange={handleInputChange}

                placeholder="e.g., 8.5 or 85%"

              />

            </FormGroup>

            <FormGroup>

              <FormLabel>Batch/Semester</FormLabel>

              <FormInput

                type="text"

                name="batch_semester"

                value={formData.batch_semester}

                onChange={handleInputChange}

                placeholder="e.g., 2023-2027, 6th Semester"

              />

            </FormGroup>

          </FormRow>

        </FormSection>



        {/* Skills Section */}

        <FormSection>

          <SectionTitle>

            <Code size={24} />

            Skills & Technologies

          </SectionTitle>

          

          <FormGroup>

            <FormLabel>Programming Languages</FormLabel>

            <SkillsContainer>

              {formData.programming_languages.map((skill, index) => (

                <SkillTag key={index}>

                  {skill}

                  <RemoveSkillButton onClick={() => removeSkill('programming_languages', skill)}>

                    ×

                  </RemoveSkillButton>

                </SkillTag>

              ))}

            </SkillsContainer>

            <AddSkillInput>

              <SkillInput

                type="text"

                value={newSkill.programming_languages}

                onChange={(e) => setNewSkill(prev => ({ ...prev, programming_languages: e.target.value }))}

                placeholder="e.g., Python, JavaScript, Java"

                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill('programming_languages'))}

              />

              <AddSkillButton type="button" onClick={() => addSkill('programming_languages')}>

                Add

              </AddSkillButton>

            </AddSkillInput>

          </FormGroup>



          <FormGroup>

            <FormLabel>Frameworks & Libraries</FormLabel>

            <SkillsContainer>

              {formData.frameworks.map((skill, index) => (

                <SkillTag key={index}>

                  {skill}

                  <RemoveSkillButton onClick={() => removeSkill('frameworks', skill)}>

                    ×

                  </RemoveSkillButton>

                </SkillTag>

              ))}

            </SkillsContainer>

            <AddSkillInput>

              <SkillInput

                type="text"

                value={newSkill.frameworks}

                onChange={(e) => setNewSkill(prev => ({ ...prev, frameworks: e.target.value }))}

                placeholder="e.g., React, Django, Spring Boot"

                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill('frameworks'))}

              />

              <AddSkillButton type="button" onClick={() => addSkill('frameworks')}>

                Add

              </AddSkillButton>

            </AddSkillInput>

          </FormGroup>



          <FormGroup>

            <FormLabel>Databases</FormLabel>

            <SkillsContainer>

              {formData.databases.map((skill, index) => (

                <SkillTag key={index}>

                  {skill}

                  <RemoveSkillButton onClick={() => removeSkill('databases', skill)}>

                    ×

                  </RemoveSkillButton>

                </SkillTag>

              ))}

            </SkillsContainer>

            <AddSkillInput>

              <SkillInput

                type="text"

                value={newSkill.databases}

                onChange={(e) => setNewSkill(prev => ({ ...prev, databases: e.target.value }))}

                placeholder="e.g., MySQL, MongoDB, PostgreSQL"

                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill('databases'))}

              />

              <AddSkillButton type="button" onClick={() => addSkill('databases')}>

                Add

              </AddSkillButton>

            </AddSkillInput>

          </FormGroup>



          <FormGroup>

            <FormLabel>Tools & Technologies</FormLabel>

            <SkillsContainer>

              {formData.tools.map((skill, index) => (

                <SkillTag key={index}>

                  {skill}

                  <RemoveSkillButton onClick={() => removeSkill('tools', skill)}>

                    ×

                  </RemoveSkillButton>

                </SkillTag>

              ))}

            </SkillsContainer>

            <AddSkillInput>

              <SkillInput

                type="text"

                value={newSkill.tools}

                onChange={(e) => setNewSkill(prev => ({ ...prev, tools: e.target.value }))}

                placeholder="e.g., Git, Docker, AWS, VS Code"

                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill('tools'))}

              />

              <AddSkillButton type="button" onClick={() => addSkill('tools')}>

                Add

              </AddSkillButton>

            </AddSkillInput>

          </FormGroup>

        </FormSection>



        {/* Experience Section */}

        <FormSection>

          <SectionTitle>

            <Briefcase size={24} />

            Experience & Projects

          </SectionTitle>

          

          <FormRow>

            <FormGroup>

              <FormLabel>Total Experience (Years)</FormLabel>

              <FormInput

                type="number"

                name="total_experience"

                value={formData.total_experience}

                onChange={handleInputChange}

                min="0"

                max="50"

              />

            </FormGroup>

            <FormGroup>

              <FormLabel>Work Mode Preference</FormLabel>

              <FormSelect

                name="work_mode"

                value={formData.work_mode}

                onChange={handleInputChange}

              >

                <option value="">Select Work Mode</option>

                <option value="Remote">Remote</option>

                <option value="On-site">On-site</option>

                <option value="Hybrid">Hybrid</option>

              </FormSelect>

            </FormGroup>

          </FormRow>



          <FormGroup>

            <FormLabel>Internships</FormLabel>

            <FormTextarea

              name="internships"

              value={formData.internships}

              onChange={handleInputChange}

              placeholder="Describe your internship experiences"

            />

          </FormGroup>



          <FormGroup>

            <FormLabel>Projects</FormLabel>

            <FormTextarea

              name="projects"

              value={formData.projects}

              onChange={handleInputChange}

              placeholder="Describe your key projects and achievements"

            />

          </FormGroup>



          <FormGroup>

            <FormLabel>Certifications</FormLabel>

            <FormTextarea

              name="certifications"

              value={formData.certifications}

              onChange={handleInputChange}

              placeholder="List your certifications and courses"

            />

          </FormGroup>

        </FormSection>



        {/* Preferences Section */}

        <FormSection>

          <SectionTitle>

            <Heart size={24} />

            Career Preferences

          </SectionTitle>

          

          <FormGroup>

            <FormLabel>Career Interests</FormLabel>

            <FormTextarea

              name="career_interests"

              value={formData.career_interests}

              onChange={handleInputChange}

              placeholder="Describe your career interests and goals"

            />

          </FormGroup>



          <FormRow>

            <FormGroup>

              <FormLabel>Preferred Locations</FormLabel>

              <FormInput

                type="text"

                name="preferred_locations"

                value={formData.preferred_locations}

                onChange={handleInputChange}

                placeholder="e.g., Bangalore, Mumbai, Remote"

              />

            </FormGroup>

            <FormGroup>

              <FormLabel>Salary Expectation (LPA)</FormLabel>

              <FormInput

                type="number"

                name="salary_expectation"

                value={formData.salary_expectation}

                onChange={handleInputChange}

                placeholder="e.g., 6"

              />

            </FormGroup>

          </FormRow>



          <FormGroup>

            <FormLabel>Tech Stack Interest</FormLabel>

            <FormTextarea

              name="tech_stack"

              value={formData.tech_stack}

              onChange={handleInputChange}

              placeholder="Describe your preferred tech stack and technologies you want to work with"

            />

          </FormGroup>

        </FormSection>



        <SubmitButton type="submit" disabled={loading}>

          <Save size={20} />

          {loading ? 'Saving Profile...' : 'Save Profile & Get Recommendations'}

        </SubmitButton>

      </ProfileForm>



      {message && (

        <MessageBox 

          message={message} 

          onClose={() => setMessage(null)} 

        />

      )}

    </ProfileContainer>

  );

};



export default ProfileFormComponent;


