import React from 'react';
import { useSessionStorage } from '../hooks/useSessionStorage';
import type { LearningProgress, TestResult } from '../types';
import { calculateGeneralStats, calculateCategoryStats, calculateTestStats } from '../utils/statsHelpers';
import './StatsPage.css';

const APP_VERSION = '1.0.0';
const PROGRESS_KEY = `learningProgress_v${APP_VERSION}`;
const TEST_RESULTS_KEY = `testResults_v${APP_VERSION}`;

const ProgressBar = ({ value }: { value: number }) => (
  <div className="progress-bar-container">
    <div className="progress-bar-fill" style={{ width: `${value.toFixed(0)}%` }}>
      {value.toFixed(0)}%
    </div>
  </div>
);

const StatsPage = () => {
  const [progress] = useSessionStorage<LearningProgress[]>(PROGRESS_KEY, []);
  const [results] = useSessionStorage<TestResult[]>(TEST_RESULTS_KEY, []);

  const generalStats = calculateGeneralStats(progress);
  const categoryStats = calculateCategoryStats(progress);
  const testStats = calculateTestStats(results);

  if (progress.length === 0 && results.length === 0) {
    return (
      <div>
        <h2>Statistics</h2>
        <p>No data yet. Start learning or take a test to see your stats here!</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Statistics</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Learning Progress</h3>
          <div className="stat-item"><span>Total Cards:</span> <span>{generalStats.totalCards}</span></div>
          <div className="stat-item"><span>Cards Mastered:</span> <span>{generalStats.cardsLearned}</span></div>
          <div className="stat-item"><span>Cards to Review:</span> <span>{generalStats.cardsToReview}</span></div>
          <div className="stat-item"><span>Mastery Rate:</span> <span>{generalStats.masteryRate.toFixed(0)}%</span></div>
          <ProgressBar value={generalStats.masteryRate} />
        </div>

        <div className="stat-card">
          <h3>Test Performance</h3>
          <div className="stat-item"><span>Tests Taken:</span> <span>{testStats.totalTests}</span></div>
          <div className="stat-item"><span>Questions Answered:</span> <span>{testStats.totalQuestions}</span></div>
          <div className="stat-item"><span>Overall Accuracy:</span> <span>{testStats.overallAccuracy.toFixed(0)}%</span></div>
          <ProgressBar value={testStats.overallAccuracy} />
          <div className="stat-item"><span>MCQ Accuracy:</span> <span>{testStats.mcqAccuracy.toFixed(0)}%</span></div>
          <div className="stat-item"><span>Fill-in-the-Blank:</span> <span>{testStats.fillBlankAccuracy.toFixed(0)}%</span></div>
        </div>

        <div className="stat-card">
          <h3>Progress by Category</h3>
          {categoryStats.map(cat => (
            <div key={cat.category} className="stat-item" style={{flexDirection: 'column', alignItems: 'flex-start', marginBottom: '1rem'}}>
              <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                <span>{cat.category.charAt(0).toUpperCase() + cat.category.slice(1)}</span>
                <span>{cat.learned}/{cat.total}</span>
              </div>
              <ProgressBar value={cat.progress} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsPage; 