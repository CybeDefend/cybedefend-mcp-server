import axios from 'axios'
import FormData from 'form-data'
import { forwardAuth } from '../utils/forwardAuth.js'

import { API_BASE } from '../utils/apiBase.js'

export const startScanTool = {
  name: 'start_scan',
  description:
    'Upload ZIP → starts a scan and returns { success, scanId, detectedLanguages }',
  inputSchema: {
    type: 'object',
    properties: {
      projectId: { type: 'string', description: 'Project UUID' },
      fileName: { type: 'string' },
      fileBufferBase64: { type: 'string' }
    },
    required: ['projectId', 'fileName', 'fileBufferBase64']
  },

  /** Starts the scan and returns { success, scanId, detectedLanguages } */
  async run(params: any, clientHeaders: Record<string, string | undefined>) {
    const { projectId, fileName, fileBufferBase64 } = params

    const buffer = Buffer.from(fileBufferBase64, 'base64')
    const form = new FormData()
    form.append('file', buffer, fileName)

    const res = await axios.post(
      `${API_BASE}/project/${projectId}/scan/start`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          ...forwardAuth(clientHeaders),
          'User-Agent': 'cybedefend-mcp/1.0'
        },
        timeout: 30_000
      }
    )

    // The API returns StartScanResponseDto : { success, message:<scanId>, … }
    const { success, message, detectedLanguages } = res.data
    return { success, scanId: message, detectedLanguages }
  }
}
