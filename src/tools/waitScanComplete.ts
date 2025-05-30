import axios from 'axios'
import { forwardAuth } from '../utils/forwardAuth.js'

const API_BASE            = process.env.API_BASE!
const DEFAULT_INTERVAL_MS = 10_000   // 10 s
const MAX_WAIT_MS         = 30 * 60_000 // 30 min de patience max

export const waitScanTool = {
  name: 'wait_scan_complete',
  description:
    'Attend la fin d’un scan (completed|failed) en pollant toutes les 10 s.',
  inputSchema: {
    type: 'object',
    properties: {
      projectId:     { type: 'string' },
      scanId:        { type: 'string' },
      intervalSec:   { type: 'number', minimum: 5, default: 10 },
      maxWaitMin:    { type: 'number', minimum: 1,  default: 30 }
    },
    required: ['projectId', 'scanId']
  },

  /** Boucle de polling jusqu’à état final */
  async run(params: any, clientHeaders: Record<string, string | undefined>) {
    const {
      projectId,
      scanId,
      intervalSec = DEFAULT_INTERVAL_MS / 1000,
      maxWaitMin  = MAX_WAIT_MS / 60_000
    } = params

    const intervalMs = intervalSec * 1000
    const timeoutAt  = Date.now() + maxWaitMin * 60_000

    while (true) {
      const res = await axios.get(
        `${API_BASE}/project/${projectId}/scan/${scanId}`,
        {
          headers: {
            ...forwardAuth(clientHeaders),
            'User-Agent': 'cybedefend-mcp/1.0'
          },
          timeout: 15_000
        }
      )

      const scan = res.data
      const state: string = scan.state?.toLowerCase()

      if (state === 'completed' || state === 'completed_degraded') {
        return { status: 'completed', scan }
      }
      if (state === 'failed') {
        return { status: 'failed', scan }
      }

      if (Date.now() > timeoutAt) {
        return { status: 'timeout', scan }
      }

      await new Promise(r => setTimeout(r, intervalMs))
    }
  }
}
