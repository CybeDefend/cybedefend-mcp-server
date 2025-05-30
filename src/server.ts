import 'dotenv/config'
import express, { Request, Response, RequestHandler } from 'express'

import { listTools, callTool } from './toolbox.js'
import { ok, err }            from './rpc/helpers.js'

const PORT = Number(process.env.PORT ?? 4001)
const app  = express()

app.use(express.json({ limit: '20mb' }))

/* -------- JSON-RPC 2.0 endpoint ---------------------------------- */
app.post('/rpc', (async (req: Request, res: Response) => {
  const { jsonrpc, id, method, params = {} } = req.body ?? {}

  /* Validation minimale */
  if (jsonrpc !== '2.0') {
    res.status(400).json(err(null, -32600, 'Not JSON-RPC 2.0'))
    return
  }
  if (typeof id !== 'number') {
    res.status(400).json(err(null, -32600, '"id" must be number'))
    return
  }

  try {
    switch (method) {
      case 'list_tools': {
        const tools = listTools()
        res.json(ok(id, { tools }))
        return
      }

      case 'call_tool': {
        /** params = { name, arguments } */
        const normalizedHeaders = Object.fromEntries(
          Object.entries(req.headers).map(([k, v]) => [
            k, 
            Array.isArray(v) ? v[0] : v
          ])
        )
        const result = await callTool(params, normalizedHeaders)
        res.json(ok(id, { content: [{ type: 'json', json: result }] }))
        return
      }

      default:
        res.status(400).json(err(id, -32601, 'Method not found'))
        return
    }
  } catch (e: any) {
    res.status(500).json(err(id, -32603, e.message ?? 'internal_error'))
  }
}) as RequestHandler)

/* ------------------------------------------------------------------ */
app.listen(PORT, () =>
  console.log(`✅ MCP HTTP (JSON-RPC) prêt sur http://localhost:${PORT}/rpc`)
)

export default app