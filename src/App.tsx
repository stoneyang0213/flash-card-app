import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import { useTheme } from './hooks/useTheme';

// Import Pages
import HomePage from './pages/HomePage';
import ReviewPage from './pages/ReviewPage';
import TestPage from './pages/TestPage';
import StatsPage from './pages/StatsPage';

// Import Components
import Navigation from './components/Navigation';

function App() {
  const [theme, toggleTheme] = useTheme();

  return (
    <Router>
      <div className="container">
        <header>
          <h1>日本語学習カード</h1>
          <p>Japanese Learning Flashcards</p>
        </header>
        
        <Navigation onThemeToggle={toggleTheme} currentTheme={theme} />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>

        <footer>
          <p>Phase 4: Learning Mode Improvements</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
