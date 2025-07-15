import { useState, useEffect } from 'react';

function getValueFromSessionStorage<T>(key: string, initialValue: T | (() => T)): T {
  try {
    const item = window.sessionStorage.getItem(key);
    if (item) {
      return JSON.parse(item) as T;
    }
  } catch (error) {
    console.warn(`Error reading sessionStorage key "${key}":`, error);
  }
  
  // If initialValue is a function, call it to get the value
  return initialValue instanceof Function ? initialValue() : initialValue;
}

export function useSessionStorage<T>(key: string, initialValue: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return getValueFromSessionStorage(key, initialValue);
  });

  useEffect(() => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting sessionStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
} 