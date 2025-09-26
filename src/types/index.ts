export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type: 'text' | 'voice';
  audioUrl?: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  userType: 'parent' | 'kid' | 'teacher';
  messages: Message[];
  status: 'active' | 'escalated' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  type: 'parent' | 'kid' | 'teacher';
  age?: number;
  preferences: {
    voiceEnabled: boolean;
    accent: 'indian' | 'american' | 'british';
  };
}

export interface KnowledgeItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
}