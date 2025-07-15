import React, { useState, useEffect } from 'react';
import type { Flashcard as FlashcardType } from '../types';
import './Flashcard.css';

interface FlashcardProps {
  card: FlashcardType;
  onKnow: (cardId: string) => void;
  onDontKnow: (cardId: string) => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ card, onKnow, onDontKnow }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // We only want to flip the card if it's not being typed into an input field
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault(); // Prevent scrolling the page
        setIsFlipped(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array ensures this runs only once per component mount

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKnowClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card from flipping back
    onKnow(card.id);
  };

  const handleDontKnowClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card from flipping back
    onDontKnow(card.id);
  };

  return (
    <div className="flashcard-container" onClick={handleCardClick}>
      <div className={`flashcard ${isFlipped ? 'is-flipped' : ''}`}>
        <div className="flashcard-face flashcard-face--front">
          <p className="japanese-text">{card.japanese}</p>
        </div>
        <div className="flashcard-face flashcard-face--back">
          <div>
            <p className="chinese-text">{card.chinese}</p>
            {card.romaji && <p className="romaji-text">{card.romaji}</p>}
          </div>
          <div className="button-group">
            <button className="button button-know" onClick={handleKnowClick}>
              认识
            </button>
            <button className="button button-dont-know" onClick={handleDontKnowClick}>
              不认识
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Flashcard); 