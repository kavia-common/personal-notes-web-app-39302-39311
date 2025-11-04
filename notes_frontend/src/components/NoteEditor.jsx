import React, { useEffect, useRef } from 'react';

// PUBLIC_INTERFACE
export default function NoteEditor({ note, onChange, onDelete }) {
  /**
   * Main editor for a note. Calls onChange with updates to title/content.
   * Also supports deletion of current note.
   */
  const titleRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    // focus title if it's a fresh note with default title
    if (note && note.title === 'Untitled' && titleRef.current) {
      titleRef.current.select();
    }
  }, [note?.id]);

  if (!note) {
    return (
      <div className="editor card" style={{ margin: 12 }}>
        <div className="editor-content">
          <div className="meta">Select a note from the list or create a new one.</div>
        </div>
      </div>
    );
  }

  return (
    <section className="editor">
      <div className="editor-toolbar">
        <span className="badge">Last edited {new Date(note.updatedAt || Date.now()).toLocaleString()}</span>
        <div style={{ flex: 1 }} />
        <button className="btn" onClick={() => onDelete(note.id)} aria-label="Delete note">
          🗑 Delete
        </button>
      </div>
      <div className="editor-content">
        <input
          ref={titleRef}
          className="input editor-title"
          placeholder="Title"
          value={note.title}
          onChange={(e) => onChange(note.id, { title: e.target.value })}
        />
        <textarea
          ref={bodyRef}
          className="editor-textarea"
          placeholder="Start typing your note..."
          value={note.content}
          onChange={(e) => onChange(note.id, { content: e.target.value })}
        />
        <div className="footer-hint">
          Changes are saved automatically.
        </div>
      </div>
    </section>
  );
}
