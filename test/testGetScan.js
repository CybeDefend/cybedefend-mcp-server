// testGetScan.js
import 'dotenv/config'          // charge API_BASE, MCP_SERVER, PORT, MY_API_KEY depuis .env
import axios from 'axios'

async function main() {
  // 1) Récupère les paramètres en ligne de commande
  const [projectId, scanId] = process.argv.slice(2)
  if (!projectId || !scanId) {
    console.error('Usage: node testGetScan.js <projectId> <scanId>')
    process.exit(1)
  }

  // 2) Prépare la requête JSON-RPC
  const payload = {
    jsonrpc: '2.0',
    id: 1,
    method: 'call_tool',
    params: {
      name: 'get_scan',
      arguments: { projectId, scanId }
    }
  }

  // 3) Appelle le MCP Server
  try {
    const resp = await axios.post(
      `${process.env.MCP_SERVER}/tools/call`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.MY_API_KEY
        },
        timeout: 30000
      }
    )
    console.log('Réponse get_scan →', JSON.stringify(resp.data, null, 2))
  } catch (err) {
    console.error(
      'Erreur HTTP →',
      err.response?.status,
      err.response?.data || err.message
    )
  }
}

main()
