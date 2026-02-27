/**
 * Builds the set of headers to forward to the CybeDefend API.
 *
 * Priority order:
 *  1. "authorization" header from the MCP client (e.g. Cursor, VS Code)
 *  2. CYBEDEFEND_ACCESS_TOKEN env var → sent as "Authorization: Bearer <token>"
 *  3. (legacy) CYBEDEFEND_API_KEY env var → sent as "Authorization: Bearer <key>"
 *
 * Note: X-Api-Key is fully deprecated. All auth now uses Bearer tokens.
 */
export function forwardAuth(
  clientHeaders: Record<string, string | undefined>
): Record<string, string> {
  const forwarded: Record<string, string> = {}

  // 1) If the MCP client has sent an explicit "authorization" header, use it
  if (clientHeaders['authorization']) {
    forwarded['authorization'] = clientHeaders['authorization']!
    return forwarded
  }

  // 2) Use CYBEDEFEND_ACCESS_TOKEN (preferred) or CYBEDEFEND_API_KEY (legacy compat)
  const accessToken = process.env.CYBEDEFEND_ACCESS_TOKEN || process.env.CYBEDEFEND_API_KEY
  if (accessToken) {
    // If token already contains "Bearer ", use as-is; otherwise prefix it
    forwarded['authorization'] = accessToken.startsWith('Bearer ')
      ? accessToken
      : `Bearer ${accessToken}`
  }

  return forwarded
}
