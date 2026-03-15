export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  theme: 'light' | 'dark';
}

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: any;
  mood?: string;
}

export interface MoodEntry {
  id: string;
  label: string;
  score: number;
  note?: string;
  timestamp: any;
}
