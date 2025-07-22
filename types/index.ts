export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  department?: string;
  position?: string;
  avatar?: string;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  targetAudience: {
    type: 'person' | 'position' | 'team' | 'company';
    value: string;
  };
  questions: Question[];
  status: 'draft' | 'active' | 'completed';
  completedCount: number;
  totalTargeted: number;
}

export interface SurveyCreate {
  title: string;
  description: string;
  targetAudience: {
    type: 'person' | 'position' | 'team' | 'company';
    value: string;
  };
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  description?: string;
  type: 'text' | 'audio' | 'video' | 'file';
  required: boolean;
  expectations: string[];
  acceptanceCriteria: string;
  order: number;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  userId: string;
  responses: QuestionResponse[];
  status: 'draft' | 'completed';
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionResponse {
  questionId: string;
  answer: string;
  type: 'text' | 'audio' | 'video' | 'file';
  feedback?: string;
  approved: boolean;
  createdAt: string;
}

export interface SurveyInstance {
  id: string;
  surveyId: string;
  respondent: {
    id: string;
    name: string;
    email: string;
    department: string;
    position: string;
    avatar: string;
  };
  responses: QuestionResponse[];
  status: 'completed' | 'in_progress';
  submittedAt: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  replies?: Comment[];
}

export interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: string;
  streaming?: boolean;
}

export interface KnowledgeQuery {
  query: string;
  filters?: {
    roles?: string[];
    people?: string[];
    teams?: string[];
  };
}