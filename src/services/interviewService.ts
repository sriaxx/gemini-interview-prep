
import { 
  InterviewSetup, 
  Question, 
  Answer, 
  Feedback, 
  InterviewSession,
  ApiResponse
} from '@/types';
import supabase from '@/lib/supabase';
import { toast } from "sonner";

// Function to generate questions using keywords (temporary mock)
const mockKeywords: Record<string, string[]> = {
  "react": ["components", "hooks", "state", "props", "virtual DOM", "jsx", "react router", "context", "redux"],
  "javascript": ["closures", "promises", "async/await", "prototypes", "ES6", "map", "filter", "arrow functions"],
  "frontend": ["responsive", "accessibility", "CSS", "HTML", "responsive design", "user experience", "UI/UX"],
  "backend": ["API", "database", "server", "middleware", "authentication", "authorization", "RESTful"],
  "node": ["express", "npm", "package.json", "middleware", "server", "modules"],
  "database": ["SQL", "NoSQL", "schema", "query", "index", "normalization", "MongoDB", "PostgreSQL"],
  "system design": ["scalability", "reliability", "availability", "performance", "security", "microservices"],
};

// Create a new interview session
export const createInterview = async (
  userId: string, 
  setup: InterviewSetup
): Promise<ApiResponse<InterviewSession>> => {
  try {
    // In a real app, this would call Gemini API to generate questions
    // For now, we'll use mock questions based on the job title and tech stack
    const questions = generateMockQuestions(setup);
    
    const newSession: Omit<InterviewSession, 'id' | 'createdAt'> = {
      userId,
      setup,
      questions,
      status: 'created',
    };
    
    // Insert new session into Supabase
    const { data, error } = await supabase
      .from('interview_sessions')
      .insert(newSession)
      .select()
      .single();
    
    if (error) throw error;
    
    // Convert the returned data to proper InterviewSession type
    const session: InterviewSession = {
      ...data,
      createdAt: new Date(data.createdAt),
    };
    
    return { data: session };
  } catch (error: any) {
    console.error("Error creating interview:", error);
    return { error: error.message || "Failed to create interview session. Please try again." };
  }
};

// Mock questions generator
const generateMockQuestions = (setup: InterviewSetup): Question[] => {
  const { jobTitle, techStack } = setup;
  const questions: Question[] = [];
  
  // Generate technical questions based on tech stack
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
    // Get the current session
    const { data: session, error: sessionError } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();
    
    if (sessionError) throw sessionError;
    
    // Generate feedback
    const feedback = generateMockFeedback(session.questions, answers);
    
    // Update session with answers and feedback
    const { data, error } = await supabase
      .from('interview_sessions')
      .update({
        answers,
        feedback,
        status: 'completed'
      })
      .eq('id', sessionId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Convert the returned data to proper InterviewSession type
    const updatedSession: InterviewSession = {
      ...data,
      createdAt: new Date(data.createdAt),
    };
    
    return { data: updatedSession };
  } catch (error: any) {
    console.error("Error submitting answers:", error);
    return { error: error.message || "Failed to submit answers. Please try again." };
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
export const getInterviewSession = async (sessionId: string): Promise<InterviewSession | undefined> => {
  try {
    const { data, error } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();
    
    if (error) throw error;
    
    // Convert the returned data to proper InterviewSession type
    return {
      ...data,
      createdAt: new Date(data.createdAt),
    };
  } catch (error) {
    console.error("Error retrieving session:", error);
    return undefined;
  }
};

// Get all sessions for a user
export const getUserInterviewSessions = async (userId: string): Promise<InterviewSession[]> => {
  try {
    const { data, error } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });
    
    if (error) throw error;
    
    // Convert the returned data to proper InterviewSession type
    return data.map(session => ({
      ...session,
      createdAt: new Date(session.createdAt),
    }));
  } catch (error) {
    console.error("Error retrieving user sessions:", error);
    return [];
  }
};

// Initialize with sample data if needed (for development)
export const initializeWithSampleData = async (userId: string): Promise<void> => {
  try {
    // Check if user has any sessions
    const { data: existingSessions, error: checkError } = await supabase
      .from('interview_sessions')
      .select('id')
      .eq('userId', userId)
      .limit(1);
    
    if (checkError) throw checkError;
    
    // If user already has sessions, don't create a sample
    if (existingSessions && existingSessions.length > 0) {
      return;
    }
    
    // Create a sample session
    const sampleSession = {
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
    };
    
    const { error: insertError } = await supabase
      .from('interview_sessions')
      .insert(sampleSession);
    
    if (insertError) throw insertError;
    
  } catch (error) {
    console.error("Error creating sample data:", error);
  }
};
