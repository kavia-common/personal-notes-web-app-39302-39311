import React, { useEffect, useMemo, useState } from 'react';
import NavBar from '../components/NavBar';
import Sidebar from '../components/Sidebar';
import NoteEditor from '../components/NoteEditor';
import { useLocalNotes } from '../hooks/useLocalNotes';
import { createApiAdapter, getEnvConfig } from '../services/apiAdapter';

// PUBLIC_INTERFACE
export default function NotesPage({ themeContext }) {
  /**
   * Page that composes the app: NavBar, Sidebar and Editor.
   * Accepts themeContext: { theme, toggleTheme }
   *
   * Prefers local storage. If REACT_APP_API_BASE is set and feature flags enable 'api'
   * (via REACT_APP_FEATURE_FLAGS=api or REACT_APP_EXPERIMENTS_ENABLED=true), this page
   * will use the backend for CRUD while still keeping selection state locally.
   */
  const local = useLocalNotes();

  // Env-based remote toggle
  const env = useMemo(() => getEnvConfig(), []);
  const useRemote = env.enableApi && !!env.apiBase;

  // Minimal remote state while preserving the UI/UX from local hook
  const [remoteNotes, setRemoteNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(local.selectedId);
  const selected = useMemo(() => {
    const source = useRemote ? remoteNotes : local.notes;
    return source.find((n) => n.id === selectedId) || null;
  }, [useRemote, remoteNotes, local.notes, selectedId]);

  const api = useMemo(
    () => (useRemote ? createApiAdapter(env.apiBase) : null),
    [useRemote, env.apiBase]
  );

  // Initial fetch when remote is enabled
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!useRemote || !api) return;
      try {
        const list = await api.listNotes();
        if (!cancelled) setRemoteNotes(Array.isArray(list) ? list : []);
      } catch (e) {
        // Fallback: if remote fails, keep using local silently
        // eslint-disable-next-line no-console
        console.warn('Remote notes fetch failed; staying local:', e?.message || e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [useRemote, api]);

  // Selection is always local-driven to keep behavior consistent
  const select = (id) => {
    setSelectedId(id);
    local.select(id);
  };

  // Create, Update, Remove route to remote when enabled, else local
  const create = async () => {
    if (useRemote && api) {
      try {
        const created = await api.createNote({ title: 'Untitled', content: '' });
        setRemoteNotes((prev) => [created, ...prev]);
        select(created.id);
        return created.id;
      } catch (e) {
        console.warn('Remote create failed; falling back to local.', e?.message || e);
        return local.create();
      }
    }
    return local.create();
  };

  const update = async (id, partial) => {
    if (useRemote && api) {
      try {
        const updated = await api.updateNote(id, partial);
        setRemoteNotes((prev) =>
          prev.map((n) => (n.id === id ? { ...n, ...updated } : n))
        );
        return;
      } catch (e) {
        console.warn('Remote update failed; falling back to local.', e?.message || e);
        local.update(id, partial);
        return;
      }
    }
    local.update(id, partial);
  };

  const remove = async (id) => {
    if (useRemote && api) {
      try {
        await api.deleteNote(id);
        setRemoteNotes((prev) => prev.filter((n) => n.id !== id));
        if (selectedId === id) select(null);
        return;
      } catch (e) {
        console.warn('Remote delete failed; falling back to local.', e?.message || e);
        local.remove(id);
        return;
      }
    }
    local.remove(id);
  };

  // Derive notes for UI based on mode
  const notes = useRemote ? remoteNotes : local.notes;

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
