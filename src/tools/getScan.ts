import axios from 'axios'
import { forwardAuth } from '../utils/forwardAuth.js'
import { API_BASE } from '../utils/apiBase.js'
import { resolveProjectId } from '../utils/projectId.js'

export const getScanTool = {
  name: 'get_scan',
  description: 'Returns the current state of a scan (progress, vulnerabilities…). If projectId is omitted, uses CYBEDEFEND_PROJECT_ID from your MCP config (e.g., VS Code .vscode/mcp.json env).',
  inputSchema: {
    type: 'object',
    properties: {
      projectId: { type: 'string', description: 'Optional. Defaults to CYBEDEFEND_PROJECT_ID' },
      scanId: { type: 'string' }
    },
    required: ['scanId']
  },
  async run(params: any, clientHeaders: Record<string, string | undefined>) {
    const { projectId, scanId } = params
    const pid = resolveProjectId(projectId)
    const res = await axios.get(
      `${API_BASE}/project/${pid}/scan/${scanId}`,
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
