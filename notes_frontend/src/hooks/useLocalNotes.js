/**
 * Local-first notes management with CRUD, selection state, and debounced autosave.
 * No external dependencies; persisted via localStorage.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { load, save } from '../utils/storage';
import { newId } from '../utils/id';

const NOTES_KEY = 'notes';
const SELECTED_KEY = 'selected';

// Debounce helper without extra dependencies
function useDebouncedCallback(fn, delay = 400) {
  const timer = useRef();
  const fnRef = useRef(fn);
  useEffect(() => { fnRef.current = fn; }, [fn]);

  return useCallback((...args) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      fnRef.current(...args);
    }, delay);
  }, [delay]);
}

// PUBLIC_INTERFACE
export function useLocalNotes() {
  /**
   * Provides a local-first notes store.
   * API:
   * - notes: array of { id, title, content, updatedAt }
   * - selectedId: currently selected note id or null
   * - select(id)
   * - create()
   * - update(id, partial)
   * - remove(id)
   */
  const [notes, setNotes] = useState(() => load(NOTES_KEY, []));
  const [selectedId, setSelectedId] = useState(() => load(SELECTED_KEY, null));

  // Keep notes sorted by updatedAt desc for display
  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  }, [notes]);

  // Persist notes changes, debounced to avoid frequent writes during typing
  const persistNotes = useDebouncedCallback((next) => {
    save(NOTES_KEY, next);
  }, 350);

  // Persist selected
  useEffect(() => {
    save(SELECTED_KEY, selectedId);
  }, [selectedId]);

  useEffect(() => {
    persistNotes(notes);
  }, [notes, persistNotes]);

  const select = useCallback((id) => {
    setSelectedId(id);
  }, []);

  const create = useCallback(() => {
    const id = newId();
    const now = Date.now();
    const newNote = { id, title: 'Untitled', content: '', updatedAt: now };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedId(id);
    return id;
  }, []);

  const update = useCallback((id, partial) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, ...partial, updatedAt: Date.now() } : n
      )
    );
  }, []);

  const remove = useCallback((id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setSelectedId((curr) => (curr === id ? null : curr));
  }, []);

  const selected = useMemo(
    () => notes.find((n) => n.id === selectedId) || null,
    [notes, selectedId]
  );

  return {
    notes: sortedNotes,
    selectedId,
    selected,
    select,
    create,
    update,
    remove,
  };
}
