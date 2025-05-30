declare module '@ivotoby/openapi-mcp-server' {
  import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

  export interface OpenAPIServerConfig {
    name: string
    version: string
    apiBaseUrl: string
    openApiSpec: string
    specInputMethod: 'file' | 'url'
    headers?: Record<string, string>
    transportType: 'stdio' | 'http'
    toolsMode?: 'all' | 'filtered'
  }

  export interface ToolDefinition {
    name: string
    description: string
    inputSchema: {
      type: string
      properties?: Record<string, any>
      required?: string[]
      [key: string]: any
    }
  }

  export interface CallToolParams {
    name: string
    arguments: Record<string, any>
  }

  export interface CallToolResult {
    content?: Array<{
      json?: any
      text?: string
      type?: string
    }>
  }

  export interface ToolsManager {
    tools: ToolDefinition[]
    initialize(): Promise<void>
    getAllTools(): ToolDefinition[]
    getToolsWithIds(ids: string[]): ToolDefinition[]
    findTool(id: string): ToolDefinition | undefined
    parseToolId(toolName: string): string
  }

  export class OpenAPIServer {
    server: any
    toolsManager: ToolsManager
    apiClient: any
    
    constructor(config: OpenAPIServerConfig)
    
    /**
     * Start the server with the given transport
     */
    start(transport: StdioServerTransport): Promise<void>
    
    /**
     * Stop the server
     */
    stop(): Promise<void>
    
    /**
     * Get available tools from the OpenAPI specification
     */
    getTools(): Promise<ToolDefinition[]>
    
    /**
     * Call a specific tool with parameters
     */
    callTool(params: CallToolParams): Promise<CallToolResult>
  }
}
