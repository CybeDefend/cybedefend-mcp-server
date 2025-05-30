/**
 * Lance un scan complet (start → poll jusqu’à fin)
 * Usage : node testFullScan.js <zipFile> [intervalSec] [maxWaitMin]
 */
import 'dotenv/config'
import fs from 'fs'
import axios from 'axios'

async function sleep (ms) { return new Promise(r => setTimeout(r, ms)) }

async function startScan (projectId, zipPath) {
  const base64 = fs.readFileSync(zipPath).toString('base64')

  const { data } = await axios.post(
    `${process.env.MCP_SERVER}/tools/call`,
    {
      name: 'start_scan',
      arguments: { projectId, fileName: zipPath, fileBufferBase64: base64 }
    },
    { headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.MY_API_KEY } }
  )

  const { scanId, detectedLanguages } = data.content[0].json
  console.log('▶️  scanId =', scanId, 'languages =', detectedLanguages)
  return scanId
}

async function pollScan (projectId, scanId, intervalSec, maxWaitMin) {
  const intervalMs = intervalSec * 1_000
  const deadline   = Date.now() + maxWaitMin * 60_000
  let attempt = 0

  while (Date.now() < deadline) {
    attempt++
    const { data } = await axios.post(
      `${process.env.MCP_SERVER}/tools/call`,
      {
        name: 'get_scan',
        arguments: { projectId, scanId }
      },
      { headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.MY_API_KEY } }
    )
    const scan = data.content[0].json
    const state = scan.state?.toLowerCase?.() || 'unknown'

    console.log(
      `[${new Date().toISOString()}] #${attempt} – state=${state}, progress=${scan.progress ?? 'n/a'}%`
    )

    if (state === 'completed' || state === 'completed_degraded' || state === 'failed') {
      return scan
    }
    await sleep(intervalMs)
  }
  throw new Error('Timeout waiting for scan to finish')
}

(async () => {
  const [zipFile = 'vulpy1.zip', interval = '10', maxWait = '30'] = process.argv.slice(2)
  const projectId = 'b08314da-b9ed-4e53-81ff-5d8fc0796951'

  const scanId  = await startScan(projectId, zipFile)
  const result  = await pollScan(projectId, scanId, Number(interval), Number(maxWait))

  console.log('🏁 Résultat final →', JSON.stringify(result, null, 2))
})().catch(err => {
  console.error('❌ Error during full scan', err.response?.data || err.message)
})
