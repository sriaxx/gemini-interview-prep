
import { 
  InterviewSetup, 
  Question, 
  Answer, 
  Feedback, 
  InterviewSession,
  ApiResponse
} from '@/types';

// Mock storage keys
const SESSIONS_STORAGE_KEY = 'interview_sessions';

// Mock data for demonstration purposes
const mockKeywords: Record<string, string[]> = {
  "react": ["components", "hooks", "state", "props", "virtual DOM", "jsx", "react router", "context", "redux"],
  "javascript": ["closures", "promises", "async/await", "prototypes", "ES6", "map", "filter", "arrow functions"],
  "frontend": ["responsive", "accessibility", "CSS", "HTML", "responsive design", "user experience", "UI/UX"],
  "backend": ["API", "database", "server", "middleware", "authentication", "authorization", "RESTful"],
  "node": ["express", "npm", "package.json", "middleware", "server", "modules"],
  "database": ["SQL", "NoSQL", "schema", "query", "index", "normalization", "MongoDB", "PostgreSQL"],
  "system design": ["scalability", "reliability", "availability", "performance", "security", "microservices"],
};

// Get sessions from localStorage
const getSessions = (): InterviewSession[] => {
  try {
    const sessions = localStorage.getItem(SESSIONS_STORAGE_KEY);
    return sessions ? JSON.parse(sessions) : [];
  } catch (error) {
    console.error("Error retrieving sessions:", error);
    return [];
  }
};

// Save sessions to localStorage
const saveSessions = (sessions: InterviewSession[]): void => {
  localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
};

// Mock session creation
export const createInterview = async (
  userId: string, 
  setup: InterviewSetup
): Promise<ApiResponse<InterviewSession>> => {
  try {
    // In a real app, this would call Gemini API to generate questions
    // For now, we'll use mock questions based on the job title and tech stack
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulating API delay
    
    const session: InterviewSession = {
      id: `session_${Date.now()}`,
      userId,
      setup,
      questions: generateMockQuestions(setup),
      status: 'created',
      createdAt: new Date(),
    };
    
    // Save to localStorage
    const sessions = getSessions();
    sessions.push(session);
    saveSessions(sessions);
    
    return { data: session };
  } catch (error) {
    console.error("Error creating interview:", error);
    return { error: "Failed to create interview session. Please try again." };
  }
};

// Mock questions generator
const generateMockQuestions = (setup: InterviewSetup): Question[] => {
  const { jobTitle, techStack } = setup;
  const questions: Question[] = [];
  
  // Generate 5 technical questions based on tech stack
  techStack.forEach((tech, index) => {
    if (index < 3) { // Limit to 3 tech stack questions
      questions.push({
        id: `q_tech_${index}`,
        text: `Explain your experience with ${tech} and how you've used it in previous projects.`,
        keywords: mockKeywords[tech.toLowerCase()] || [],
      });
    }
  });
  
  // Add job-specific questions
  questions.push({
    id: `q_job_1`,
    text: `What makes you a good candidate for this ${jobTitle} position?`,
    keywords: ["experience", "skills", "projects", "achievements"],
  });
  
  questions.push({
    id: `q_job_2`,
    text: `Describe a challenging problem you solved as a ${jobTitle}.`,
    keywords: ["problem solving", "challenges", "solution", "impact"],
  });
  
  // Add behavioral question
  questions.push({
    id: `q_behavior_1`,
    text: "Tell me about a time when you had to meet a tight deadline. How did you handle it?",
    keywords: ["time management", "prioritization", "stress", "teamwork", "communication"],
  });
  
  // Add general technical question
  questions.push({
    id: `q_general_1`,
    text: "How do you stay updated with the latest trends and technologies in your field?",
    keywords: ["continuous learning", "professional development", "resources", "community"],
  });
  
  return questions;
};

// Submit answers and get feedback
export const submitAnswers = async (
  sessionId: string,
  answers: Answer[]
): Promise<ApiResponse<InterviewSession>> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Find the session
    const sessions = getSessions();
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex === -1) {
      return { error: "Interview session not found" };
    }
    
    const session = sessions[sessionIndex];
    
    // Generate feedback
    const feedback = generateMockFeedback(session.questions, answers);
    
    // Update session
    const updatedSession: InterviewSession = {
      ...session,
      answers,
      feedback,
      status: 'completed',
    };
    
    // Save updated session
    sessions[sessionIndex] = updatedSession;
    saveSessions(sessions);
    
    return { data: updatedSession };
  } catch (error) {
    console.error("Error submitting answers:", error);
    return { error: "Failed to submit answers. Please try again." };
  }
};

// Mock feedback generator
const generateMockFeedback = (questions: Question[], answers: Answer[]): Feedback[] => {
  return answers.map(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    
    if (!question || !question.keywords || question.keywords.length === 0) {
      return {
        questionId: answer.questionId,
        score: 3,
        matchedKeywords: [],
        suggestions: "Your answer was satisfactory. Consider providing more specific examples next time."
      };
    }
    
    const answerText = answer.text.toLowerCase();
    const matchedKeywords = question.keywords.filter(keyword => 
      answerText.includes(keyword.toLowerCase())
    );
    
    // Calculate score based on keyword matches
    const keywordMatchRatio = matchedKeywords.length / question.keywords.length;
    const score = Math.min(Math.round(keywordMatchRatio * 5) + 1, 5);
    
    // Generate suggestions
    let suggestions = "";
    if (score <= 2) {
      suggestions = "Your answer could be improved significantly. Consider addressing these keywords: " + 
        question.keywords.filter(k => !matchedKeywords.includes(k)).slice(0, 3).join(", ");
    } else if (score <= 4) {
      suggestions = "Good answer, but you could strengthen it by mentioning: " + 
        question.keywords.filter(k => !matchedKeywords.includes(k)).slice(0, 2).join(", ");
    } else {
      suggestions = "Excellent answer that covered most key points.";
    }
    
    return {
      questionId: answer.questionId,
      score,
      matchedKeywords,
      suggestions
    };
  });
};

// Get session by ID
export const getInterviewSession = (sessionId: string): InterviewSession | undefined => {
  const sessions = getSessions();
  return sessions.find(s => s.id === sessionId);
};

// Get all sessions for a user
export const getUserInterviewSessions = (userId: string): InterviewSession[] => {
  const sessions = getSessions();
  return sessions.filter(s => s.userId === userId);
};

// Initialize with sample data if needed (for development)
export const initializeWithSampleData = (userId: string): void => {
  const sessions = getSessions();
  if (sessions.length === 0) {
    const sampleSession: InterviewSession = {
      id: `sample_session_${Date.now()}`,
      userId,
      setup: {
        jobTitle: "Frontend Developer",
        jobDescription: "Building responsive web applications using React",
        techStack: ["React", "JavaScript", "CSS"],
        yearsOfExperience: 2
      },
      questions: [
        {
          id: "sample_q1",
          text: "Explain the virtual DOM in React and why it's important.",
          keywords: ["efficiency", "performance", "rendering", "comparison", "updates"]
        },
        {
          id: "sample_q2",
          text: "What are React hooks and how have you used them?",
          keywords: ["useState", "useEffect", "custom hooks", "state management"]
        }
      ],
      status: 'created',
      createdAt: new Date()
    };
    
    sessions.push(sampleSession);
    saveSessions(sessions);
  }
};
