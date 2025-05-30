import 'dotenv/config'
import express, { Request, Response } from 'express'
import { startScanTool }  from './tools/startScan.js'
import { getScanTool }    from './tools/getScan.js'
import { waitScanTool }   from './tools/waitScanComplete.js'

const PORT = Number(process.env.PORT ?? 4001)
const app  = express()

app.use(express.json({ limit: '20mb' }))

/* -------- /tools/list --------------------------------------------- */
app.post('/tools/list', (_req: Request, res: Response) => {
  const tools = [startScanTool, getScanTool, waitScanTool].map(t => ({
    name: t.name,
    description: t.description,
    inputSchema: t.inputSchema
  }))
  res.json({ tools })
})

/* -------- /tools/call --------------------------------------------- */
app.post('/tools/call', async (req: Request, res: Response) => {
  const { name, arguments: params } = req.body ?? {}
  const headers = Object.fromEntries(
    Object.entries(req.headers).map(([k, v]) => [k.toLowerCase(), String(v)])
  )

  const toolbox: Record<string, any> = {
    start_scan         : startScanTool,
    get_scan           : getScanTool,
    wait_scan_complete : waitScanTool
  }

  const tool = toolbox[name]
  if (!tool) {
    res.status(400).json({ error: `Unknown tool: ${name}` })
    return
  }

  try {
    const result = await tool.run(params, headers)
    res.json({ content: [{ type: 'json', json: result }] })
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ error: err.message ?? 'internal_error' })
  }
})

app.listen(PORT, () =>
  console.log(`✅ MCP HTTP prêt sur http://localhost:${PORT}`)
)
