/**
 * Type declarations for @ivotoby/openapi-mcp-server
 * Since the package doesn't provide official TypeScript types,
 * we define the minimal interface needed for our usage.
 */

declare module '@ivotoby/openapi-mcp-server' {
  import { ServerTransport } from '@modelcontextprotocol/sdk/server/index.js'

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

  export class OpenAPIServer {
    constructor(config: OpenAPIServerConfig)
    
    /**
     * Start the server with the given transport
     */
    start(transport: ServerTransport): Promise<void>
    
    /**
     * Stop the server
     */
    stop(): Promise<void>
  }
}
