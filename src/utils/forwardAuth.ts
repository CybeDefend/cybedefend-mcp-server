/**
 * Construit l’ensemble des en-têtes à transmettre à l’API CybeDefend.
 * 
 * - Si le client MCP (Cursor, etc.) a envoyé un “authorization” ou “x-api-key”,
 *   on le respecte (priorité 1).
 * - Ensuite, si la variable d’environnement CYBEDEFEND_API_KEY est définie,
 *   on l’ajoute (priorité 2).
 */
export function forwardAuth(
  clientHeaders: Record<string, string | undefined>
): Record<string,string> {
  const forwarded: Record<string,string> = {}

  // 1) Si le client MCP a envoyé un header “authorization” explicite, on l’utilise
  if (clientHeaders['authorization']) {
    forwarded['authorization'] = clientHeaders['authorization']!
  }

  // 2) Si le client MCP a envoyé “x-api-key”, on l’utilise
  if (clientHeaders['x-api-key']) {
    forwarded['x-api-key'] = clientHeaders['x-api-key']!
  }

  // 3) Si, après, on n’a toujours pas de clé, mais qu’une clé existe en env,
  //    on force “X-API-Key: ${CYBEDEFEND_API_KEY}”
  //    (on met “x-api-key” en minuscules pour la cohérence de l’API HTTP)
  if (!forwarded['authorization'] && !forwarded['x-api-key']) {
    const apiKey = process.env.CYBEDEFEND_API_KEY
    if (apiKey) {
      forwarded['x-api-key'] = apiKey
    }
  }

  return forwarded
}
