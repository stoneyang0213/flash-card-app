import type { LearningProgress, TestResult, Flashcard } from '../types';
import { flashcardsData } from '../data/flashcards';

type Category = Flashcard['category'];

export interface GeneralStats {
  totalCards: number;
  cardsLearned: number;
  cardsToReview: number;
  masteryRate: number;
}

export interface CategoryStats {
  category: Category;
  total: number;
  learned: number;
  progress: number;
}

export interface TestStats {
    totalTests: number;
    totalQuestions: number;
    correctAnswers: number;
    overallAccuracy: number;
    mcqAccuracy: number;
    fillBlankAccuracy: number;
}

export function calculateGeneralStats(progress: LearningProgress[]): GeneralStats {
  const totalCards = flashcardsData.length;
  const cardsLearned = progress.filter(p => p.isKnown).length;
  const cardsToReview = progress.length - cardsLearned;
  const masteryRate = totalCards > 0 ? (cardsLearned / totalCards) * 100 : 0;

  return { totalCards, cardsLearned, cardsToReview, masteryRate };
}

export function calculateCategoryStats(progress: LearningProgress[]): CategoryStats[] {
  const categories = [...new Set(flashcardsData.map(c => c.category))];
  
  return categories.map(category => {
    const cardsInCategory = flashcardsData.filter(c => c.category === category);
    const total = cardsInCategory.length;
    
    const learnedInCategory = progress.filter(p => {
      const card = flashcardsData.find(c => c.id === p.cardId);
      return card && card.category === category && p.isKnown;
    }).length;

    const progressPercentage = total > 0 ? (learnedInCategory / total) * 100 : 0;

    return {
      category,
      total,
      learned: learnedInCategory,
      progress: progressPercentage,
    };
  });
}

export function calculateTestStats(results: TestResult[]): TestStats {
    const totalQuestions = results.length;
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const overallAccuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    const mcqResults = results.filter(r => r.testType === 'multiple-choice');
    const mcqCorrect = mcqResults.filter(r => r.isCorrect).length;
    const mcqAccuracy = mcqResults.length > 0 ? (mcqCorrect / mcqResults.length) * 100 : 0;

    const fillBlankResults = results.filter(r => r.testType === 'fill-blank');
    const fillBlankCorrect = fillBlankResults.filter(r => r.isCorrect).length;
    const fillBlankAccuracy = fillBlankResults.length > 0 ? (fillBlankCorrect / fillBlankResults.length) * 100 : 0;
    
    // This is a simplified way to count tests. A more robust implementation might group results by a unique test ID.
    const totalTests = new Set(results.map(r => Math.floor(r.timestamp / (1000 * 60 * 30)))).size; // Assume tests are at least 30 mins apart

    return { totalTests, totalQuestions, correctAnswers, overallAccuracy, mcqAccuracy, fillBlankAccuracy };
} 