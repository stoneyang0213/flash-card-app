import React, { useState, useMemo } from 'react';
import { flashcardsData } from '../data/flashcards';
import { useSessionStorage } from '../hooks/useSessionStorage';
import type { Flashcard, TestResult } from '../types';
import CategoryFilter from '../components/CategoryFilter';
import MultipleChoiceTest from '../components/MultipleChoiceTest';
import FillInTheBlankTest from '../components/FillInTheBlankTest';

const APP_VERSION = '1.0.0';
const TEST_RESULTS_KEY = `testResults_v${APP_VERSION}`;
type TestStatus = 'setup' | 'running-mc' | 'running-fill' | 'finished';
type Category = Flashcard['category'];
const ALL_CATEGORIES = 'all';

const TestPage = () => {
  const [status, setStatus] = useState<TestStatus>('setup');
  const [cardsForTest, setCardsForTest] = useState<Flashcard[]>([]);
  const [results, setResults] = useSessionStorage<TestResult[]>(TEST_RESULTS_KEY, []);

  const handleTestStart = (cards: Flashcard[], type: 'mc' | 'fill') => {
    if (cards.length === 0) {
      alert('No cards in this category to test!');
      return;
    }
    setCardsForTest(cards);
    setStatus(type === 'mc' ? 'running-mc' : 'running-fill');
  };

  const handleTestComplete = (finalResults: TestResult[]) => {
    setResults(prevResults => [...prevResults, ...finalResults]);
    setStatus('finished');
  };
  
  const TestSetup = () => {
    const [selectedCategory, setSelectedCategory] = useState<Category | typeof ALL_CATEGORIES>(ALL_CATEGORIES);
    
    const cardsInCategory = useMemo(() => {
        return selectedCategory === ALL_CATEGORIES
            ? flashcardsData
            : flashcardsData.filter(card => card.category === selectedCategory);
    }, [selectedCategory]);

    return (
        <div>
            <h2>Test Your Knowledge</h2>
            <p>Select a category and a test type to begin.</p>
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={flashcardsData.map(c => c.category)}
            />
            <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                <button 
                    className="next-question-button" 
                    onClick={() => handleTestStart(cardsInCategory, 'mc')}
                >
                    Multiple Choice ({cardsInCategory.length} cards)
                </button>
                <button 
                    className="next-question-button" 
                    onClick={() => handleTestStart(cardsInCategory, 'fill')}
                >
                    Fill in the Blank ({cardsInCategory.length} cards)
                </button>
            </div>
        </div>
    );
  };

  const TestResultsDisplay = () => {
    const lastTestCards = cardsForTest.length;
    const correctAnswers = results.slice(-lastTestCards).filter(r => r.isCorrect).length;
    const score = lastTestCards > 0 ? ((correctAnswers / lastTestCards) * 100).toFixed(0) : 0;

    return (
        <div>
            <h2>Test Complete!</h2>
            <p>Your score: <strong>{score}%</strong></p>
            <p>You answered {correctAnswers} out of {lastTestCards} questions correctly.</p>
            <button 
                className="next-question-button" 
                style={{marginTop: '1rem'}}
                onClick={() => setStatus('setup')}
            >
                Take Another Test
            </button>
        </div>
    );
  };

  return (
    <div>
      {status === 'setup' && <TestSetup />}
      {status === 'running-mc' && (
        <MultipleChoiceTest 
            cardsToTest={cardsForTest}
            onTestComplete={handleTestComplete}
        />
      )}
      {status === 'running-fill' && (
        <FillInTheBlankTest 
            cardsToTest={cardsForTest}
            onTestComplete={handleTestComplete}
        />
      )}
      {status === 'finished' && <TestResultsDisplay />}
    </div>
  );
};

export default TestPage; 