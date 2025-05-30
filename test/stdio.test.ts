import { describe, it, expect, vi } from 'vitest'
import * as sdk from '@modelcontextprotocol/sdk/server/index.js'
import * as stdio from '@modelcontextprotocol/sdk/server/stdio.js'

vi.mock('@modelcontextprotocol/sdk/server/index.js', async (orig) => {
  const actual: any = await orig()
  return {
    ...actual,
    Server: vi.fn().mockImplementation(() => ({
      setRequestHandler: vi.fn(),
      connect: vi.fn(),
    })),
  }
})
vi.mock('@modelcontextprotocol/sdk/server/stdio.js', () => ({
  StdioServerTransport: vi.fn(),
}))

import { runStdio } from '../src/stdio-server.ts'

describe('SDK / STDIO bootstrap', () => {
  it('connecte le Server au transport', async () => {
    await runStdio()
    const ServerMock: any = sdk.Server
    const transportMock: any = stdio.StdioServerTransport

    expect(ServerMock).toHaveBeenCalledTimes(1)
    const instance = ServerMock.mock.results[0].value
    expect(instance.connect).toHaveBeenCalledWith(
      expect.any(transportMock),
    )
  })
})
