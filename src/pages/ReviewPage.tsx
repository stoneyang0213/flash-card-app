import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { flashcardsData } from '../data/flashcards';
import type { LearningProgress } from '../types';
import Flashcard from '../components/Flashcard';

const APP_VERSION = '1.0.0';
const PROGRESS_KEY = `learningProgress_v${APP_VERSION}`;

const ReviewPage = () => {
  const [progress, setProgress] = useSessionStorage<LearningProgress[]>(PROGRESS_KEY, []);
  
  const cardsToReview = useMemo(() => {
    const reviewCardIds = new Set(
      progress.filter(p => !p.isKnown).map(p => p.cardId)
    );
    return flashcardsData.filter(card => reviewCardIds.has(card.id));
  }, [progress]);

  const [reviewDeck, setReviewDeck] = useState(cardsToReview);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setReviewDeck(cardsToReview);
    setCurrentIndex(0);
  }, [cardsToReview]);

  if (cardsToReview.length === 0) {
    return (
      <div>
        <h2>Review</h2>
        <p>Excellent! There are no cards currently marked for review. 🎉</p>
      </div>
    );
  }

  const currentCard = reviewDeck[currentIndex];

  const advanceToNextCard = () => {
    if (currentIndex < reviewDeck.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("Review session finished!");
      // The deck will auto-update if any cards are still left for review
    }
  };

  const handleProgressUpdate = useCallback((cardId: string, isKnown: boolean) => {
    setProgress(prevProgress => {
      const existingEntryIndex = prevProgress.findIndex(p => p.cardId === cardId);
      if (existingEntryIndex > -1) {
        const updatedProgress = [...prevProgress];
        const existingEntry = updatedProgress[existingEntryIndex];
        existingEntry.isKnown = isKnown;
        existingEntry.lastReviewed = Date.now();
        existingEntry.reviewCount += 1;
        return updatedProgress;
      }
      return [...prevProgress, { cardId, isKnown, lastReviewed: Date.now(), reviewCount: 1 }];
    });

    if (isKnown) {
      const newDeck = reviewDeck.filter(card => card.id !== cardId);
      setReviewDeck(newDeck);
      if (currentIndex >= newDeck.length && newDeck.length > 0) {
        setCurrentIndex(newDeck.length - 1);
      }
      if(newDeck.length === 0) {
        alert("Review session finished!");
      }
    } else {
      setTimeout(advanceToNextCard, 300);
    }
  }, [reviewDeck, currentIndex, setProgress]); // Dependencies

  if (!currentCard) {
     return (
      <div>
        <h2>Review</h2>
        <p>Congratulations! You've reviewed all your selected cards. 👍</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Review ({reviewDeck.length} cards)</h2>
      <main>
        <Flashcard 
          key={currentCard.id}
          card={currentCard}
          onKnow={() => handleProgressUpdate(currentCard.id, true)}
          onDontKnow={() => handleProgressUpdate(currentCard.id, false)}
        />
      </main>
    </div>
  );
};

export default ReviewPage; 