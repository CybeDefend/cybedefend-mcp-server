import axios from 'axios'
import FormData from 'form-data'
import { forwardAuth } from '../utils/forwardAuth.js'

const API_BASE = process.env.API_BASE!

export const startScanTool = {
  name: 'start_scan',
  description:
    'Upload ZIP → démarre un scan et renvoie { success, scanId, detectedLanguages }',
  inputSchema: {
    type: 'object',
    properties: {
      projectId:        { type: 'string', description: 'UUID du projet' },
      fileName:         { type: 'string' },
      fileBufferBase64: { type: 'string' }
    },
    required: ['projectId', 'fileName', 'fileBufferBase64']
  },

  /** Lance le scan et renvoie { success, scanId, detectedLanguages } */
  async run(params: any, clientHeaders: Record<string, string | undefined>) {
    const { projectId, fileName, fileBufferBase64 } = params

    const buffer = Buffer.from(fileBufferBase64, 'base64')
    const form   = new FormData()
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

    // L’API renvoie StartScanResponseDto : { success, message:<scanId>, … }
    const { success, message, detectedLanguages } = res.data
    return { success, scanId: message, detectedLanguages }
  }
}
