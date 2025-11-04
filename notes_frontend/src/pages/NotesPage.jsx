import React from 'react';
import NavBar from '../components/NavBar';
import Sidebar from '../components/Sidebar';
import NoteEditor from '../components/NoteEditor';
import { useLocalNotes } from '../hooks/useLocalNotes';

// PUBLIC_INTERFACE
export default function NotesPage({ themeContext }) {
  /**
   * Page that composes the app: NavBar, Sidebar and Editor.
   * Accepts themeContext: { theme, toggleTheme }
   */
  const { notes, selectedId, selected, select, create, update, remove } = useLocalNotes();

  return (
    <>
      <NavBar
        onNew={create}
        theme={themeContext?.theme || 'light'}
        onToggleTheme={themeContext?.toggleTheme}
      />
      <main className="app-content">
        <Sidebar
          notes={notes}
          selectedId={selectedId}
          onSelect={select}
          onCreate={create}
        />
        <NoteEditor
          note={selected}
          onChange={update}
          onDelete={remove}
        />
      </main>
    </>
  );
}
