/**
 * Detect the base path for API calls.
 *
 * When running inside Home Assistant ingress the page is served at
 *   /api/hassio_ingress/<token>/
 * so API requests must be prefixed with that path.
 *
 * In standalone / dev mode the page is served at "/" so the prefix is empty.
 */
function getBasePath(): string {
  // HA ingress sets a <base> tag or we can detect from the URL
  const path = window.location.pathname
  // Match /api/hassio_ingress/<token>
  const match = path.match(/^(\/api\/hassio_ingress\/[^/]+)/)
  if (match) return match[1]
  return ''
}

const BASE_PATH = getBasePath()

/**
 * Build a full URL for an API endpoint, ingress-aware.
 * e.g. apiUrl('/receipts') → '/api/hassio_ingress/<token>/api/receipts' (ingress)
 *                           → '/api/receipts' (standalone)
 */
export function apiUrl(path: string): string {
  return `${BASE_PATH}/api${path}`
}

/**
 * Base fetch wrapper — throws on non-2xx with a readable error message.
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  })
  if (!res.ok) {
    let detail = res.statusText
    try {
      const body = await res.json()
      detail = body.detail ?? detail
    } catch { /* ignore */ }
    throw new Error(`API ${res.status}: ${detail}`)
  }
  // 204 No Content
  if (res.status === 204) return undefined as unknown as T
  return res.json() as Promise<T>
}
