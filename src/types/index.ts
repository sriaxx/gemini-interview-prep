
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export interface InterviewSetup {
  jobTitle: string;
  jobDescription: string;
  techStack: string[];
  yearsOfExperience: number;
}

export interface Question {
  id: string;
  text: string;
  keywords?: string[];
}

export interface Answer {
  questionId: string;
  text: string;
}

export interface Feedback {
  questionId: string;
  score: number;
  matchedKeywords: string[];
  suggestions: string;
}

export interface InterviewSession {
  id: string;
  userId: string;
  setup: InterviewSetup;
  questions: Question[];
  answers?: Answer[];
  feedback?: Feedback[];
  status: 'created' | 'in-progress' | 'completed';
  createdAt: Date;
}

export type ApiResponse<T> = {
  data?: T;
  error?: string;
};
