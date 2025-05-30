/**
 * STDIO entry-point for MCP agents (Cursor, Claude, etc.)
 * Starts a Server from the SDK and delegates logic to existing tools.
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

/** Builds then connects the MCP server on STDIO. */
export async function runStdio() {
  const server = new Server(
    { name: 'Cybedefend MCP', version: '2.0.0' },
    { capabilities: { tools: {} } },
  )

  /* ----- JSON-RPC handlers provided by the SDK ------------------- */
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: await listTools(),
  }))

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const { name, arguments: args } = req.params
    const result = await callTool({ name, arguments: args }, {})
    return { content: [{ type: 'json', json: result }] }
  })
  /* -------------------------------------------------------------- */

  /* STDIO Connection : blocks while the process lives */
  await server.connect(new StdioServerTransport())
}

/* Point d’entrée si exécuté comme script */
/* Entry point if executed as script */
if (import.meta.url === `file://${process.argv[1]}`) {
  runStdio().catch((e) => {
    console.error('❌ MCP STDIO fatal :', e)
    process.exit(1)
  })
}

export default runStdio      // build ESModule compatible
