/** Build Authorization headers from the server-side THYME_API_KEY env var. */
export function authHeaders(): HeadersInit {
  const key = process.env.THYME_API_KEY;
  if (!key) return {};
  return { Authorization: `Bearer ${key}` };
}
