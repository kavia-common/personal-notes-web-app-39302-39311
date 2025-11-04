//
// API Adapter and environment feature flags handling
//

/**
 * Parses feature flags from environment variables.
 * Supports:
 * - REACT_APP_FEATURE_FLAGS="api,other"
 * - REACT_APP_EXPERIMENTS_ENABLED="true"/"false"
 * - REACT_APP_NODE_ENV for environment specific behaviors if needed
 */

// PUBLIC_INTERFACE
export function getEnvConfig() {
  /** Returns normalized environment configuration and flags. */
  const base = (process.env.REACT_APP_API_BASE || '').trim();
  const flagsRaw = (process.env.REACT_APP_FEATURE_FLAGS || '').trim();
  const experiments = String(process.env.REACT_APP_EXPERIMENTS_ENABLED || '').toLowerCase() === 'true';

  const featureFlags = new Set(
    flagsRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  );

  // Enable API usage only if base URL is present and flags allow it.
  const enableApi =
    !!base &&
    (featureFlags.has('api') || featureFlags.has('remote') || experiments);

  return {
    apiBase: base || null,
    enableApi,
    featureFlags,
    experiments,
    nodeEnv: process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV || 'development',
  };
}

/**
 * Lightweight REST API client for notes if backend is provided.
 * Expects a backend compatible with endpoints:
 *  - GET    /notes
 *  - POST   /notes
 *  - PATCH  /notes/:id
 *  - DELETE /notes/:id
 * Returns normalized note objects: { id, title, content, updatedAt }
 */
function makeHeaders() {
  return {
    'Content-Type': 'application/json',
  };
}

async function parseJson(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function createApiAdapter(apiBase) {
  /**
   * Factory that returns CRUD methods bound to the given apiBase.
   */
  const base = apiBase?.replace(/\/+$/, '') || '';

  async function listNotes() {
    const res = await fetch(`${base}/notes`, { headers: makeHeaders() });
    if (!res.ok) throw new Error(`API error (${res.status}) while listing notes`);
    const data = await parseJson(res);
    return Array.isArray(data) ? data : [];
  }

  async function createNote(payload = { title: 'Untitled', content: '' }) {
    const res = await fetch(`${base}/notes`, {
      method: 'POST',
      headers: makeHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`API error (${res.status}) while creating note`);
    return parseJson(res);
  }

  async function updateNote(id, partial) {
    const res = await fetch(`${base}/notes/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: makeHeaders(),
      body: JSON.stringify(partial),
    });
    if (!res.ok) throw new Error(`API error (${res.status}) while updating note`);
    return parseJson(res);
  }

  async function deleteNote(id) {
    const res = await fetch(`${base}/notes/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: makeHeaders(),
    });
    if (!res.ok) throw new Error(`API error (${res.status}) while deleting note`);
    return true;
  }

  return {
    listNotes,
    createNote,
    updateNote,
    deleteNote,
  };
}
