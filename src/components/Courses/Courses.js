import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';
import {
  BookOpen,
  Clock,
  Users,
  Star,
  ArrowLeft,
  ExternalLink,
  Play,
  CheckCircle,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MessageBox from '../Common/MessageBox';

const CoursesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const CoursesHeader = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const CoursesTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
`;

const CoursesSubtitle = styled.p`
  color: #6b7280;
  font-size: 1.1rem;
`;

const BackButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
  }
`;

const CoursesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 30px;
`;

const CourseCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
  }
`;

const CourseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const CourseTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
`;

const CourseProvider = styled.p`
  color: #667eea;
  font-weight: 500;
  font-size: 0.9rem;
`;

const CourseLevel = styled.span`
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const CourseDescription = styled.p`
  color: #374151;
  line-height: 1.6;
  margin-bottom: 16px;
  font-size: 0.9rem;
`;

const CourseMeta = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const CourseMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 0.8rem;
`;

const CourseSkills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
`;

const SkillTag = styled.span`
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
`;

const CourseActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  
  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 15px rgba(102, 126, 234, 0.3);
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

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
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

const Courses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Load recommended courses
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      // Try to fetch from API first
      const response = await axios.get('/api/courses', {
        withCredentials: true
      });
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error('Error loading courses:', error);
      // Fallback to curated free courses
      const freeCourses = [
        {
          id: 1,
          title: "Python for Everybody",
          provider: "Coursera (Free)",
          level: "Beginner",
          duration: "40 hours",
          rating: 4.8,
          students: 1250000,
          description: "Learn Python programming from basics to advanced concepts. This course covers Python fundamentals, data structures, and web development.",
          skills: ["Python", "Data Structures", "Web Development", "Programming"],
          link: "https://www.coursera.org/specializations/python",
          type: "free",
          price: "Free"
        },
        {
          id: 2,
          title: "CS50's Introduction to Computer Science",
          provider: "Harvard (Free)",
          level: "Beginner",
          duration: "60 hours",
          rating: 4.9,
          students: 2000000,
          description: "Harvard's introduction to computer science and programming. Learn algorithms, data structures, and problem-solving.",
          skills: ["C", "Python", "SQL", "Algorithms", "Data Structures"],
          link: "https://www.edx.org/course/introduction-computer-science-harvardx-cs50x",
          type: "free",
          price: "Free"
        },
        {
          id: 3,
          title: "Machine Learning Course",
          provider: "Stanford (Free)",
          level: "Intermediate",
          duration: "55 hours",
          rating: 4.8,
          students: 4000000,
          description: "Andrew Ng's famous machine learning course covering supervised learning, unsupervised learning, and best practices.",
          skills: ["Machine Learning", "Python", "Octave", "Statistics"],
          link: "https://www.coursera.org/learn/machine-learning",
          type: "free",
          price: "Free"
        },
        {
          id: 4,
          title: "Web Development Bootcamp",
          provider: "FreeCodeCamp (Free)",
          level: "Beginner",
          duration: "300 hours",
          rating: 4.7,
          students: 5000000,
          description: "Complete web development curriculum covering HTML, CSS, JavaScript, React, Node.js, and databases.",
          skills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB"],
          link: "https://www.freecodecamp.org/learn/",
          type: "free",
          price: "Free"
        },
        {
          id: 5,
          title: "Data Science Fundamentals",
          provider: "IBM (Free)",
          level: "Beginner",
          duration: "45 hours",
          rating: 4.6,
          students: 800000,
          description: "Learn data science fundamentals including Python, SQL, data visualization, and machine learning basics.",
          skills: ["Python", "SQL", "Data Visualization", "Pandas", "NumPy"],
          link: "https://www.coursera.org/professional-certificates/ibm-data-science",
          type: "free",
          price: "Free"
        },
        {
          id: 6,
          title: "AWS Cloud Practitioner Essentials",
          provider: "AWS (Free)",
          level: "Beginner",
          duration: "20 hours",
          rating: 4.5,
          students: 1000000,
          description: "Learn AWS cloud fundamentals and prepare for the AWS Cloud Practitioner certification exam.",
          skills: ["AWS", "Cloud Computing", "DevOps", "Infrastructure"],
          link: "https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/",
          type: "free",
          price: "Free"
        }
      ];

      setCourses(freeCourses);
    }
  };

  const handleEnroll = (courseId) => {
    setMessage({
      type: 'success',
      title: 'Course Enrolled!',
      text: 'You have successfully enrolled in the course. Check your email for access details.'
    });

    // Auto-hide message after 5 seconds
    setTimeout(() => setMessage(null), 5000);
  };

  const handleViewCourse = (link) => {
    window.open(link, '_blank');
  };

  return (
    <CoursesContainer>
      <BackButton onClick={() => navigate('/dashboard')}>
        <ArrowLeft size={20} />
        Back to Dashboard
      </BackButton>

      <CoursesHeader>
        <CoursesTitle>Upskill Yourself</CoursesTitle>
        <CoursesSubtitle>
          Recommended courses to enhance your skills and advance your career
        </CoursesSubtitle>
      </CoursesHeader>

      {!courses || courses.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <BookOpen size={64} />
          </EmptyIcon>
          <EmptyTitle>No courses available</EmptyTitle>
          <EmptyDescription>
            Complete your profile to get personalized course recommendations
          </EmptyDescription>
        </EmptyState>
      ) : (
        <CoursesGrid>
          {courses && courses.map(course => (
            <CourseCard key={course.id}>
              <CourseHeader>
                <div>
                  <CourseTitle>{course.title}</CourseTitle>
                  <CourseProvider>{course.provider}</CourseProvider>
                </div>
                <CourseLevel>{course.level}</CourseLevel>
              </CourseHeader>

              <CourseDescription>
                {course.description}
              </CourseDescription>

              <CourseMeta>
                <CourseMetaItem>
                  <Clock size={14} />
                  {course.duration}
                </CourseMetaItem>
                <CourseMetaItem>
                  <Star size={14} />
                  {course.rating}
                </CourseMetaItem>
                <CourseMetaItem>
                  <Users size={14} />
                  {course.students ? course.students.toLocaleString() : '0'}
                </CourseMetaItem>
              </CourseMeta>

              <CourseSkills>
                {course.skills && course.skills.map((skill, index) => (
                  <SkillTag key={index}>{skill}</SkillTag>
                ))}
              </CourseSkills>

              <CourseActions>
                <ActionButton
                  className="secondary"
                  onClick={() => handleViewCourse(course.link)}
                >
                  <ExternalLink size={14} />
                  View Course
                </ActionButton>
                <ActionButton
                  className="primary"
                  onClick={() => handleEnroll(course.id)}
                >
                  <Play size={14} />
                  Enroll Now
                </ActionButton>
              </CourseActions>
            </CourseCard>
          ))}
        </CoursesGrid>
      )}

      {message && (
        <MessageBox
          message={message}
          onClose={() => setMessage(null)}
        />
      )}
    </CoursesContainer>
  );
};

export default Courses;
