import { describe, it, expect, beforeAll } from 'vitest'
import { listTools, callTool } from '../src/toolbox.js'

describe('Toolbox integration with OpenAPI', () => {
  let tools: any[]
  
  beforeAll(async () => {
    tools = await listTools()
  })

  it('should load both custom and OpenAPI tools', async () => {
    expect(tools.length).toBeGreaterThan(3) // Au moins les 3 tools custom + OpenAPI tools
    
    // Vérifier qu'on a nos tools personnalisés
    const customToolNames = ['start_scan', 'get_scan', 'wait_scan_complete']
    customToolNames.forEach(name => {
      const tool = tools.find(t => t.name === name)
      expect(tool).toBeDefined()
      expect(tool.description).toBeTruthy()
      expect(tool.inputSchema).toBeTruthy()
    })
  })

  it('should be able to call custom tools', async () => {
    // Test avec des paramètres basiques pour start_scan
    try {
      await callTool({
        name: 'start_scan',
        arguments: {
          projectId: 'test-project-id',
          fileName: 'test.zip',
          fileBufferBase64: 'dGVzdA==' // base64 pour "test"
        }
      }, {})
    } catch (error) {
      // On s'attend à une erreur liée à l'API (pas de token, etc.)
      // mais pas une erreur "Unknown tool"
      expect(error.message).not.toMatch(/Unknown tool/)
    }
  })

  it('should handle unknown tools gracefully', async () => {
    await expect(
      callTool({ name: 'non_existent_tool', arguments: {} }, {})
    ).rejects.toThrow(/Unknown tool/)
  })
})
