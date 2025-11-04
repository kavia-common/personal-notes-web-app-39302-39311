function randomChunk() {
  return Math.random().toString(36).slice(2, 8);
}

// PUBLIC_INTERFACE
export function newId(prefix = 'note') {
  /** Generate a simple unique id suitable for local-only usage. */
  const time = Date.now().toString(36);
  return `${prefix}_${time}_${randomChunk()}`;
}
