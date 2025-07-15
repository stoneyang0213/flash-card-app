import type { Flashcard } from '../types';

export interface MultipleChoiceQuestion {
  card: Flashcard;
  options: string[];
  correctAnswer: string;
}

/**
 * Shuffles an array in place and returns it.
 * @param array The array to be shuffled.
 */
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Generates a full multiple-choice test from a given set of cards.
 * @param cardsToTest The specific cards to create questions for.
 * @param allCards The entire pool of flashcards to draw distractors from.
 * @returns An array of question objects for the test.
 */
export function generateMultipleChoiceTest(
  cardsToTest: Flashcard[],
  allCards: Flashcard[]
): MultipleChoiceQuestion[] {
  
  return cardsToTest.map(correctCard => {
    // Find 3 other cards to use as incorrect options (distractors).
    const distractors = allCards
      // Ensure we don't pick the correct card as a distractor.
      .filter(card => card.id !== correctCard.id)
      // Shuffle the entire pool of potential distractors.
      .sort(() => 0.5 - Math.random())
      // Take the first 3 from the shuffled list.
      .slice(0, 3)
      // Get their Chinese translation.
      .map(card => card.chinese);

    // Combine the correct answer with the distractors and shuffle them.
    const options = shuffleArray([...distractors, correctCard.chinese]);

    return {
      card: correctCard,
      options,
      correctAnswer: correctCard.chinese,
    };
  });
} 