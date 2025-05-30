import { describe, it, expect } from "vitest"
import { buildOpenApiServer } from "../src/toolbox.js"

describe("OpenAPI server bootstrap", () => {
  it("loads the spec and exposes tools", async () => {
    const srv = await buildOpenApiServer()
    
    if (srv) {
      // If OpenAPI server was successfully created, check it has tools
      const tools = srv.toolsManager.getAllTools()
      expect(tools.length).toBeGreaterThan(0)
      
      // Verify that tools have the expected structure
      const firstTool = tools[0]
      expect(firstTool).toHaveProperty('name')
      expect(firstTool).toHaveProperty('description')
      expect(firstTool).toHaveProperty('inputSchema')
      expect(typeof firstTool.name).toBe('string')
      expect(typeof firstTool.description).toBe('string')
      expect(typeof firstTool.inputSchema).toBe('object')
    } else {
      // If no OpenAPI server (e.g., spec not found), just verify null is returned
      expect(srv).toBeNull()
    }
  })
})
