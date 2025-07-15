import React, { useState } from 'react';
import type { Flashcard, TestResult } from '../types';
import './FillInTheBlankTest.css';

interface FillInTheBlankTestProps {
  cardsToTest: Flashcard[];
  onTestComplete: (results: TestResult[]) => void;
}

const FillInTheBlankTest: React.FC<FillInTheBlankTestProps> = ({ cardsToTest, onTestComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const currentQuestion = cardsToTest[currentQuestionIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnswered) return;

    const correct = inputValue.trim() === currentQuestion.chinese;
    setIsCorrect(correct);
    setIsAnswered(true);

    const newResult: TestResult = {
      cardId: currentQuestion.id,
      isCorrect: correct,
      timestamp: Date.now(),
      testType: 'fill-blank',
    };
    setResults(prev => [...prev, newResult]);
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setIsCorrect(false);
    setInputValue('');
    if (currentQuestionIndex < cardsToTest.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onTestComplete(results);
    }
  };

  return (
    <div className="test-container">
      <p className="test-progress">Question {currentQuestionIndex + 1} of {cardsToTest.length}</p>
      <div className="test-question-japanese">{currentQuestion.japanese}</div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="fill-blank-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter Chinese translation"
          disabled={isAnswered}
          autoFocus
        />
        {!isAnswered && <button type="submit" className="next-question-button" style={{width: '100%'}}>Submit</button>}
      </form>
      
      <div className="test-feedback">
        {isAnswered && (
          <div className={isCorrect ? 'fill-blank-feedback correct' : 'fill-blank-feedback incorrect'}>
            {isCorrect ? 'Correct! ✅' : 'Incorrect ❌'}
            {!isCorrect && <p className="correct-answer-display">Correct answer: {currentQuestion.chinese}</p>}
          </div>
        )}
      </div>

      {isAnswered && (
        <div className="test-navigation">
          <button onClick={handleNextQuestion} className="next-question-button">
            {currentQuestionIndex < cardsToTest.length - 1 ? 'Next Question' : 'Finish Test'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FillInTheBlankTest; 