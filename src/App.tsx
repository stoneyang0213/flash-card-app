import { useState, useEffect } from 'react';
import Flashcard from './components/Flashcard';
import { flashcardsData as allFlashcards } from './data/flashcards';
import type { Flashcard as FlashcardType } from './types';

function App() {
  const [currentCard, setCurrentCard] = useState<FlashcardType | null>(null);

  useEffect(() => {
    // Set a default theme
    document.body.setAttribute('data-theme', 'light');
    // Load a sample card
    setCurrentCard(allFlashcards[0]);
  }, []);

  const handleKnow = (cardId: string) => {
    console.log(`User knows card ${cardId}`);
    // Logic to advance to the next card will be added later
  };

  const handleDontKnow = (cardId: string) => {
    console.log(`User does not know card ${cardId}`);
    // Logic to advance to the next card will be added later
  };

  return (
    <div className="container">
      <header>
        <h1>日本語学習カード</h1>
        <p>Japanese Learning Flashcards</p>
      </header>
      <main>
        {currentCard ? (
          <Flashcard 
            card={currentCard}
            onKnow={handleKnow}
            onDontKnow={handleDontKnow}
          />
        ) : (
          <p>Loading card...</p>
        )}
      </main>
      <footer>
        <p>Phase 2: Core UI Components</p>
      </footer>
    </div>
  );
}

export default App;
