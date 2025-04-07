
import { 
  InterviewSetup, 
  Question, 
  Answer, 
  Feedback, 
  InterviewSession,
  ApiResponse
} from '@/types';
import api from '@/lib/api';

// Create a new interview session
export const createInterview = async (
  userId: string, 
  setup: InterviewSetup
): Promise<ApiResponse<InterviewSession>> => {
  try {
    const response = await api.post('/interviews', { setup });
    
    // Convert the returned data to proper InterviewSession type
    const session: InterviewSession = {
      ...response.data,
      createdAt: new Date(response.data.createdAt),
    };
    
    return { data: session };
  } catch (error: any) {
    console.error("Error creating interview:", error);
    return { error: error.response?.data?.error || "Failed to create interview session. Please try again." };
  }
};

// Submit answers and get feedback
export const submitAnswers = async (
  sessionId: string,
  answers: Answer[]
): Promise<ApiResponse<InterviewSession>> => {
  try {
    const response = await api.post(`/interviews/${sessionId}/answers`, { answers });
    
    // Convert the returned data to proper InterviewSession type
    const updatedSession: InterviewSession = {
      ...response.data,
      createdAt: new Date(response.data.createdAt),
    };
    
    return { data: updatedSession };
  } catch (error: any) {
    console.error("Error submitting answers:", error);
    return { error: error.response?.data?.error || "Failed to submit answers. Please try again." };
  }
};

// Get session by ID
export const getInterviewSession = async (sessionId: string): Promise<InterviewSession | undefined> => {
  try {
    const response = await api.get(`/interviews/${sessionId}`);
    
    // Convert the returned data to proper InterviewSession type
    return {
      ...response.data,
      createdAt: new Date(response.data.createdAt),
    };
  } catch (error) {
    console.error("Error retrieving session:", error);
    return undefined;
  }
};

// Get all sessions for a user
export const getUserInterviewSessions = async (userId: string): Promise<InterviewSession[]> => {
  try {
    const response = await api.get('/interviews');
    
    // Convert the returned data to proper InterviewSession type
    return response.data.map((session: any) => ({
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
    await api.post('/interviews/sample');
  } catch (error) {
    console.error("Error creating sample data:", error);
  }
};
