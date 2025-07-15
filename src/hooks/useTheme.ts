import { useEffect } from 'react';
import { useSessionStorage } from './useSessionStorage';

type Theme = 'light' | 'dark';
const THEME_KEY = 'theme';

export const useTheme = (): [Theme, () => void] => {
  const [theme, setTheme] = useSessionStorage<Theme>(THEME_KEY, 'light');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return [theme, toggleTheme];
}; 