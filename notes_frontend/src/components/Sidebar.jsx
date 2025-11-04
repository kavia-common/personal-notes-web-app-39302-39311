import React, { useMemo, useState } from 'react';
import SearchBar from './SearchBar';
import NoteListItem from './NoteListItem';

// PUBLIC_INTERFACE
export default function Sidebar({ notes, selectedId, onSelect, onCreate }) {
  /** Left sidebar with search and list of notes. */
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return notes;
    return notes.filter((n) =>
      (n.title || '').toLowerCase().includes(t) ||
      (n.content || '').toLowerCase().includes(t)
    );
  }, [q, notes]);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <SearchBar value={q} onChange={setQ} />
        <button className="btn primary" onClick={onCreate} aria-label="Create note">
          +
        </button>
      </div>
      <div className="sidebar-list" role="list">
        {filtered.length === 0 ? (
          <div className="meta" style={{ padding: 12 }}>No notes</div>
        ) : (
          filtered.map((n) => (
            <NoteListItem
              key={n.id}
              note={n}
              active={n.id === selectedId}
              onClick={() => onSelect(n.id)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
