import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './theme.css';
import NotesPage from './pages/NotesPage';

// PUBLIC_INTERFACE
function App() {
  /** App-level theme state persisted in localStorage to survive reloads. */
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const themeValue = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <div className="app-shell" data-theme={theme}>
      <NotesPage themeContext={themeValue} />
    </div>
  );
}

export default App;
