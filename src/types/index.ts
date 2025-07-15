export interface Flashcard {
  id: string;
  japanese: string;
  chinese: string;
  category: 'traffic' | 'weather' | 'food';
  romaji?: string; // 罗马音（可选）
}

export interface LearningProgress {
  cardId: string;
  isKnown: boolean;
  lastReviewed: number; // timestamp
  reviewCount: number;
}

export interface TestResult {
  cardId: string;
  isCorrect: boolean;
  timestamp: number;
  testType: 'multiple-choice' | 'fill-blank';
} 