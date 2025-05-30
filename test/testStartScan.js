// testStartScan.js
import 'dotenv/config'                // charge ton .env pour API_BASE & PORT
import fs from 'fs'
import FormData from 'form-data'
import axios from 'axios'

async function main() {
  // 1) Lecture et encodage du fichier
  const buffer = fs.readFileSync('vulpy1.zip')
  const base64 = buffer.toString('base64')

  // 2) Construction du JSON-RPC
  const payload = {
    jsonrpc: '2.0',
    id: 1,
    method: 'call_tool',
    params: {
      name: 'start_scan', arguments: {
        projectId: 'b08314da-b9ed-4e53-81ff-5d8fc0796951',
        fileName: 'vulpy1.zip',
        fileBufferBase64: base64
      }
    }
  }


  // 3) Appel HTTP
  try {
    const resp = await axios.post(
      `${process.env.MCP_SERVER}/tools/call`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.MY_API_KEY
        },
        timeout: 60_000
      }
    )
    console.log('Réponse start_scan →', JSON.stringify(resp.data, null, 2))
  } catch (err) {
    console.error('Erreur HTTP →', err.response?.status, err.response?.data || err.message)
  }
}

main()
