export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  studyPoints: number;
  streak: number;
  lastStudyDate?: string;
  targetHours: number;
  categoryTargets: Record<string, number>; // minutes per category
}

export interface FocusSession {
  id: string;
  userId: string;
  duration: number; // in minutes
  category: string; // e.g., 'Mathematics', 'Physics', 'Computer Science', 'Language', 'Other'
  timestamp: string;
  notes: string;
  completed: boolean;
}

export interface SyllabusTopic {
  id: string;
  userId: string;
  subject: string;
  chapter: string;
  topic: string;
  status: 'pending' | 'in_progress' | 'mastered';
  lastReviewed?: string;
  notes?: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface StudyNote {
  id: string;
  userId: string;
  title: string;
  content: string;
  summary?: string;
  flashcards?: Flashcard[];
  timestamp: string;
  category: string;
}

export interface ExamTask {
  id: string;
  text: string;
  done: boolean;
}

export interface ExamGoal {
  id: string;
  userId: string;
  title: string;
  date: string;
  subject: string;
  preparationLevel: number; // 0 - 100
  tasks: ExamTask[];
}

export interface RoomMember {
  userId: string;
  userName: string;
  avatar: string;
  xp: number;
  currentActivity?: string; // e.g. "Focusing (Mathematics)", "Offline"
}

export interface RoomMessage {
  id: string;
  userName: string;
  text: string;
  timestamp: string;
}

export interface StudyRoom {
  id: string;
  name: string;
  description: string;
  members: RoomMember[];
  chat: RoomMessage[];
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  avatar: string;
  xp: number;
  streak: number;
  rank?: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AIQuiz {
  topic: string;
  questions: QuizQuestion[];
}

export interface SoftSkillScenario {
  id: string;
  title: string;
  description: string;
  role: string;
  systemPrompt: string;
}
