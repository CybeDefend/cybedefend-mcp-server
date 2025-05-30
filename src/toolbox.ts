import { startScanTool } from './tools/startScan.js'
import { getScanTool }   from './tools/getScan.js'
import { waitScanTool }  from './tools/waitScanComplete.js'

/** Tous les tools connus du serveur */
export const ALL_TOOLS = [startScanTool, getScanTool, waitScanTool]

/** Format MCP → résumé (name + description + schema) */
export function listTools() {
  return ALL_TOOLS.map(t => ({
    name:        t.name,
    description: t.description,
    inputSchema: t.inputSchema
  }))
}

/**
 * Exécute un tool à partir de son nom + arguments JSON-RPC.
 * @throws {Error} si le tool n’existe pas.
 */
export async function callTool(
  params: { name?: string; arguments?: any },
  clientHeaders: Record<string, string | undefined>
) {
  const { name, arguments: args = {} } = params ?? {}
  if (!name) throw new Error('Missing "name" in params')

  const tool = ALL_TOOLS.find(t => t.name === name)
  if (!tool) throw new Error(`Unknown tool: ${name}`)

  /* Normalise les en-têtes (lower-case) */
  const lowerHeaders = Object.fromEntries(
    Object.entries(clientHeaders).map(([k, v]) => [k.toLowerCase(), String(v)])
  )

  return tool.run(args, lowerHeaders)
}
