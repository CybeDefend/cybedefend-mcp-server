/**
 * Builds the set of headers to forward to the CybeDefend API.
 * 
 * - If the MCP client (Cursor, etc.) has sent an "authorization" or "x-api-key",
 *   we respect it (priority 1).
 * - Then, if the CYBEDEFEND_API_KEY environment variable is defined,
 *   we add it (priority 2).
 */
export function forwardAuth(
  clientHeaders: Record<string, string | undefined>
): Record<string,string> {
  const forwarded: Record<string,string> = {}

  // 1) If the MCP client has sent an explicit "authorization" header, we use it
  if (clientHeaders['authorization']) {
    forwarded['authorization'] = clientHeaders['authorization']!
  }

  // 2) If the MCP client has sent "x-api-key", we use it
  if (clientHeaders['x-api-key']) {
    forwarded['x-api-key'] = clientHeaders['x-api-key']!
  }

  // 3) If, after that, we still don't have a key, but a key exists in env,
  //    we force "X-API-Key: ${CYBEDEFEND_API_KEY}"
  //    (we put "x-api-key" in lowercase for HTTP API consistency)
  if (!forwarded['authorization'] && !forwarded['x-api-key']) {
    const apiKey = process.env.CYBEDEFEND_API_KEY
    if (apiKey) {
      forwarded['x-api-key'] = apiKey
    }
  }

  return forwarded
}
