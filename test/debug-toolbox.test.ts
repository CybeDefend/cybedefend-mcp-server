import { describe, it, expect } from 'vitest'
import { listTools } from '../dist/toolbox.js'

describe('Debug toolbox', () => {
  it('should show debug information', async () => {
    console.log('Starting listTools test...')
    const tools = await listTools()
    console.log('Tools returned:', tools.length)
    console.log('Tool names:', tools.map(t => t.name))
    expect(tools.length).toBeGreaterThanOrEqual(3)
  })
})
