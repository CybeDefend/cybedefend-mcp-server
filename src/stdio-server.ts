/**
 * STDIO entry-point pour les agents MCP (Cursor, Claude, etc.)
 * Lance un Server du SDK et délègue la logique aux tools existants.
 *
 * Build : `npm run build`
 * Run   : `node dist/stdio-server.js`
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

import { listTools, callTool } from './toolbox.js'

/** Construit puis connecte le serveur MCP sur STDIO. */
export async function runStdio() {
  const server = new Server(
    { name: 'Cybedefend MCP', version: '2.0.0' },
    { capabilities: { tools: {} } },
  )

  /* ----- handlers JSON-RPC fournis par le SDK ------------------- */
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: listTools(),
  }))

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const { name, arguments: args } = req.params
    const result = await callTool({ name, arguments: args }, {})
    return { content: [{ type: 'json', json: result }] }
  })
  /* -------------------------------------------------------------- */

  /* Connexion STDIO : bloque tant que le processus vit */
  await server.connect(new StdioServerTransport())
}

/* Point d’entrée si exécuté comme script */
if (import.meta.url === `file://${process.argv[1]}`) {
  runStdio().catch((e) => {
    console.error('❌ MCP STDIO fatal :', e)
    process.exit(1)
  })
}

export default runStdio      // build ESModule compatible
