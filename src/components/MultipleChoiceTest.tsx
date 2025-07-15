import React, { useState } from 'react';
import type { Flashcard, TestResult } from '../types';
import { generateMultipleChoiceTest } from '../utils/testHelpers';
import type { MultipleChoiceQuestion } from '../utils/testHelpers';
import { flashcardsData } from '../data/flashcards';
import './MultipleChoiceTest.css';

interface MultipleChoiceTestProps {
  cardsToTest: Flashcard[];
  onTestComplete: (results: TestResult[]) => void;
}

const MultipleChoiceTest: React.FC<MultipleChoiceTestProps> = ({ cardsToTest, onTestComplete }) => {
  const [questions, setQuestions] = useState(() => 
    generateMultipleChoiceTest(cardsToTest, flashcardsData)
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [results, setResults] = useState<TestResult[]>([]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (option: string) => {
    if (selectedAnswer) return; // Prevent changing answer

    const isCorrect = option === currentQuestion.correctAnswer;
    setSelectedAnswer(option);

    const newResult: TestResult = {
      cardId: currentQuestion.card.id,
      isCorrect,
      timestamp: Date.now(),
      testType: 'multiple-choice',
    };
    setResults(prev => [...prev, newResult]);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Last question answered, finish the test
      onTestComplete(results);
    }
  };
  
  const getButtonClass = (option: string) => {
    if (!selectedAnswer) {
      return '';
    }
    if (option === currentQuestion.correctAnswer) {
      return 'correct';
    }
    if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
      return 'incorrect';
    }
    return '';
  };

  return (
    <div className="test-container">
      <p className="test-progress">Question {currentQuestionIndex + 1} of {questions.length}</p>
      <div className="test-question-japanese">{currentQuestion.card.japanese}</div>
      <div className="test-options-grid">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            className={`test-option-button ${getButtonClass(option)}`}
            onClick={() => handleAnswerSelect(option)}
            disabled={!!selectedAnswer}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="test-feedback">
        {selectedAnswer && (selectedAnswer === currentQuestion.correctAnswer ? 'Correct! ✅' : 'Incorrect ❌')}
      </div>
      {selectedAnswer && (
        <div className="test-navigation">
          <button onClick={handleNextQuestion} className="next-question-button">
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Test'}
          </button>
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceTest; 