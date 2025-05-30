import axios from 'axios'
import { forwardAuth } from '../utils/forwardAuth.js'

const API_BASE = process.env.API_BASE!

export const getScanTool = {
  name: 'get_scan',
  description: 'Renvoie l’état courant d’un scan (progress, vulnérabilités…).',
  inputSchema: {
    type: 'object',
    properties: {
      projectId: { type: 'string' },
      scanId:    { type: 'string' }
    },
    required: ['projectId', 'scanId']
  },
  async run(params: any, clientHeaders: Record<string, string | undefined>) {
    const { projectId, scanId } = params
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
    return res.data
  }
}
