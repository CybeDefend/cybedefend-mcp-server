import { describe, it, expect } from "vitest"
import { buildOpenApiServer, getOpenApiTools } from "../dist/openapi-server.js"

describe("OpenAPI server bootstrap", () => {
  it("charge la spec et expose des tools", async () => {
    const srv = await buildOpenApiServer()
    const tools = getOpenApiTools(srv)
    expect(tools.length).toBeGreaterThan(0)
    
    // Vérifier que les tools ont la structure attendue
    const firstTool = tools[0]
    expect(firstTool).toHaveProperty('name')
    expect(firstTool).toHaveProperty('description')
    expect(firstTool).toHaveProperty('inputSchema')
    expect(typeof firstTool.name).toBe('string')
    expect(typeof firstTool.description).toBe('string')
    expect(typeof firstTool.inputSchema).toBe('object')
  })
})
