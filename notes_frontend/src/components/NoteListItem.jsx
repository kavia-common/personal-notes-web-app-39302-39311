import React, { useMemo } from 'react';

function formatTime(ts) {
  try {
    const d = new Date(ts);
    return d.toLocaleString();
  } catch {
    return '';
  }
}

// PUBLIC_INTERFACE
export default function NoteListItem({ note, active, onClick }) {
  /** Renders a note list item with title and updated time. */
  const preview = useMemo(() => {
    if (!note?.content) return '';
    const text = note.content.replace(/\s+/g, ' ').trim();
    return text.slice(0, 80);
  }, [note]);

  return (
    <div
      className={`note-item ${active ? 'active' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      aria-label={`Open note ${note.title || 'Untitled'}`}
    >
      <div className="title">{note.title || 'Untitled'}</div>
      <div className="meta">{formatTime(note.updatedAt)}</div>
      {preview ? <div className="meta" style={{ marginTop: 6 }}>{preview}</div> : null}
    </div>
  );
}
