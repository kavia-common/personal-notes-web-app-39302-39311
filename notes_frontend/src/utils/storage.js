const STORAGE_PREFIX = 'notes';
const STORAGE_VERSION = 'v1';

// PUBLIC_INTERFACE
export function storageKey(name) {
  /** Returns a namespaced key for localStorage. */
  return `${STORAGE_PREFIX}:${name}:${STORAGE_VERSION}`;
}

// PUBLIC_INTERFACE
export function load(name, fallback) {
  /** Load JSON from localStorage; returns fallback if missing or invalid. */
  try {
    const raw = localStorage.getItem(storageKey(name));
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// PUBLIC_INTERFACE
export function save(name, value) {
  /** Save JSON value to localStorage under the namespaced key. */
  try {
    localStorage.setItem(storageKey(name), JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

// PUBLIC_INTERFACE
export function remove(name) {
  /** Remove a namespaced key from localStorage. */
  try {
    localStorage.removeItem(storageKey(name));
  } catch {
    // ignore
  }
}
