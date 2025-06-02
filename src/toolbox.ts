import { startScanTool } from './tools/startScan.js'
import { getScanTool }   from './tools/getScan.js'
import { waitScanTool }  from './tools/waitScanComplete.js'

/** Custom tools known by the server */
const CUSTOM_TOOLS = [startScanTool, getScanTool, waitScanTool]

/** OpenAPI server singleton instance */
let apiServer: any = null

/**
 * Build an OpenAPI server instance with proper initialization
 */
async function buildOpenApiServer(): Promise<any> {
  if (apiServer) return apiServer

  const fs = await import("node:fs")
  const path = await import("node:path")
  const spec = path.resolve("openapi/cybe.openapi.json")

  if (!fs.existsSync(spec)) {
    console.log(`[DEBUG] OpenAPI spec not found at ${spec}, skipping OpenAPI tools`)
    return null
  }

  try {
    const { OpenAPIServer } = await import("@ivotoby/openapi-mcp-server")
    
    apiServer = new OpenAPIServer({
      name        : "cybedefend-api",
      version     : "1.0.0",
      apiBaseUrl  : process.env.API_BASE ?? "",
      openApiSpec : spec,
      specInputMethod: "file",
      headers     : parseHeaders(process.env.API_HEADERS),
      transportType: "stdio",
      toolsMode   : "all",
    })
    
    // Initialize the tools manager to load tools from OpenAPI spec
    await apiServer.toolsManager.initialize()
    console.log(`[DEBUG] OpenAPI server initialized with ${apiServer.toolsManager.getAllTools().length} tools`)
    
    return apiServer
  } catch (error) {
    console.error(`[DEBUG] Failed to initialize OpenAPI server:`, error)
    return null
  }
}

function parseHeaders(h?: string): Record<string,string> {
  if (!h) return {}
  return Object.fromEntries(
    h.split(",").map(pair => {
      const [k,v] = pair.split(":")
      return [k.trim(), v.trim()]
    }),
  )
}

/**
 * Initialize the OpenAPI server if necessary
 */
async function getApiServer() {
  if (!apiServer) {
    apiServer = await buildOpenApiServer()
  }
  return apiServer
}

/** Format MCP → summary (name + description + schema) */
export async function listTools() {
  try {
    const server = await getApiServer()
    const openApiTools = server ? server.toolsManager.getAllTools() : []
    
    console.log(`[DEBUG] OpenAPI tools found: ${openApiTools.length}`)
    
    const customTools = CUSTOM_TOOLS.map((t: any) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema
    }))
    
    const apiTools = openApiTools.map((t: any) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema
    }))
    
    console.log(`[DEBUG] Total tools: ${customTools.length} custom + ${apiTools.length} API = ${customTools.length + apiTools.length}`)
    
    return [...customTools, ...apiTools]
  } catch (error) {
    console.warn('Failed to load OpenAPI tools, falling back to custom tools only:', error)
    return CUSTOM_TOOLS.map((t: any) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema
    }))
  }
}

/**
 * Execute a tool from its name + JSON-RPC arguments.
 * @throws {Error} if the tool doesn't exist.
 */
export async function callTool(
  params: { name?: string; arguments?: any },
  headers: Record<string, string | undefined>,
) {
  const { name, arguments: args = {} } = params ?? {}
  if (!name) throw new Error('Missing "name"')

  // 1. Check custom tools first
  const customTool = CUSTOM_TOOLS.find((t: any) => t.name === name)
  if (customTool) {
    return customTool.run(args, headers)
  }

  // 2. Try OpenAPI endpoints
  try {
    const server = await getApiServer()
    if (!server) throw new Error('OpenAPI server not available')
    
    const result = await server.callTool({ name, arguments: args })
    
    // Extract content from response
    if (result.content && result.content.length > 0) {
      const firstContent = result.content[0]
      return firstContent.json ?? firstContent.text ?? firstContent
    }
    
    return result
  } catch (error) {
    throw new Error(`Unknown tool: ${name}`)
  }
}

// Export the buildOpenApiServer function for testing
export { buildOpenApiServer }
