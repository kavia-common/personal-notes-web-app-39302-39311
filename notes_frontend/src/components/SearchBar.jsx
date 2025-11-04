import React from 'react';

// PUBLIC_INTERFACE
export default function SearchBar({ value, onChange, placeholder = 'Search notes…' }) {
  /** Search input for filtering notes. */
  return (
    <input
      className="input"
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label="Search notes"
    />
  );
}
