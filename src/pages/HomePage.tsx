import { useState, useEffect, useMemo, useCallback } from 'react';
import Flashcard from '../components/Flashcard';
import CategoryFilter from '../components/CategoryFilter';
import { flashcardsData } from '../data/flashcards';
import type { Flashcard as FlashcardType, LearningProgress } from '../types';
import { useSessionStorage } from '../hooks/useSessionStorage';

type Category = FlashcardType['category'];
const ALL_CATEGORIES = 'all';

const APP_VERSION = '1.0.0';
const PROGRESS_KEY = `learningProgress_v${APP_VERSION}`;
const CATEGORY_KEY = `selectedCategory_v${APP_VERSION}`;

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useSessionStorage<Category | typeof ALL_CATEGORIES>(CATEGORY_KEY, ALL_CATEGORIES);
  
  const filteredFlashcards = useMemo(() => {
    const cards = selectedCategory === ALL_CATEGORIES
      ? flashcardsData
      : flashcardsData.filter(card => card.category === selectedCategory);
    return [...cards].sort(() => 0.5 - Math.random());
  }, [selectedCategory]);

  const [allFlashcards, setAllFlashcards] = useState(filteredFlashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useSessionStorage<LearningProgress[]>(PROGRESS_KEY, []);

  useEffect(() => {
    setAllFlashcards(filteredFlashcards);
    setCurrentIndex(0);
  }, [filteredFlashcards]);

  const currentCard = allFlashcards[currentIndex];
  
  const handleCategoryChange = (category: Category | typeof ALL_CATEGORIES) => {
    setSelectedCategory(category);
  };

  const advanceToNextCard = () => {
    if (currentIndex < allFlashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("Deck finished!");
    }
  };

  const handleProgressUpdate = useCallback((cardId: string, isKnown: boolean) => {
    const newProgress: LearningProgress = {
      cardId,
      isKnown,
      lastReviewed: Date.now(),
      reviewCount: 1,
    };

    setProgress(prevProgress => {
      const existingEntryIndex = prevProgress.findIndex(p => p.cardId === cardId);
      if (existingEntryIndex > -1) {
        const updatedProgress = [...prevProgress];
        const existingEntry = updatedProgress[existingEntryIndex];
        existingEntry.isKnown = isKnown;
        existingEntry.lastReviewed = newProgress.lastReviewed;
        existingEntry.reviewCount += 1;
        return updatedProgress;
      } else {
        return [...prevProgress, newProgress];
      }
    });
    
    setTimeout(advanceToNextCard, 300);
  }, [allFlashcards.length, currentIndex, setProgress]); // Dependencies for the callback

  return (
    <>
      <header>
        <h2>Learn</h2>
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          categories={flashcardsData.map(c => c.category)}
        />
        <p>Card {currentIndex + 1} of {allFlashcards.length}</p>
      </header>
      <main>
        {currentCard ? (
          <Flashcard 
            key={currentCard.id}
            card={currentCard}
            onKnow={() => handleProgressUpdate(currentCard.id, true)}
            onDontKnow={() => handleProgressUpdate(currentCard.id, false)}
          />
        ) : (
          <p>This category is empty. Please select another one.</p>
        )}
      </main>
    </>
  );
};

export default HomePage; 