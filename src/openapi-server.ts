/* src/openapi-server.ts
 * Factory for building an OpenAPIServer (using @ivotoby library) ready to use.
 */

import path from 'path'
import { OpenAPIServer } from '@ivotoby/openapi-mcp-server'

export function getOpenApiTools(server: any) {
  return server.toolsManager.getAllTools()
}

export async function buildOpenApiServer(): Promise<OpenAPIServer> {
  const specPath = path.resolve(process.cwd(), 'openapi/cybe.openapi.json')
  
  console.log('[DEBUG] Creating OpenAPI server with spec:', specPath)
  
  const server = new OpenAPIServer({
    name: "cybedefend-api",
    version: "1.0.0",
    apiBaseUrl: process.env.API_BASE_URL ?? process.env.API_BASE ?? "",
    openApiSpec: specPath,
    specInputMethod: "file",
    headers: {},
    transportType: "stdio",
    toolsMode: "all",
  })
  
  await server.toolsManager.initialize()
  const tools = server.toolsManager.getAllTools()
  
  console.log(`[DEBUG] OpenAPI server initialized with ${tools.length} tools`)
  
  return server
}
