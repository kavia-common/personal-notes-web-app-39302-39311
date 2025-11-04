import React from 'react';

// PUBLIC_INTERFACE
export default function NavBar({ onNew, theme, onToggleTheme }) {
  /** Top navigation bar with brand, actions, and theme toggle. */
  return (
    <nav className="navbar">
      <div className="brand" aria-label="Notes brand">
        <div className="mark" aria-hidden="true" />
        <span>Ocean Notes</span>
      </div>
      <div className="spacer" />
      <button className="btn ghost" onClick={onNew} aria-label="Create new note">
        + New
      </button>
      <button
        className="btn"
        onClick={onToggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        style={{ marginLeft: 8 }}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
    </nav>
  );
}
