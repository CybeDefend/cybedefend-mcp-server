/**
 * Poll get_scan toutes les N secondes et affiche l'état à chaque loop.
 *
 * USAGE :
 *   node testWaitScan.js <projectId> <scanId> [intervalSec=10] [maxWaitMin=30]
 */
import 'dotenv/config'
import axios from 'axios'

async function sleep (ms) { return new Promise(r => setTimeout(r, ms)) }

async function main () {
  const [projectId, scanId, intervalSec = '10', maxWaitMin = '30'] = process.argv.slice(2)
  if (!projectId || !scanId) {
    console.error('Usage: node testWaitScan.js <projectId> <scanId> [intervalSec] [maxWaitMin]')
    process.exit(1)
  }

  const intervalMs = Number(intervalSec) * 1_000
  const deadline   = Date.now() + Number(maxWaitMin) * 60_000
  let attempt = 0

  console.log(`⏱️  Poll every ${intervalSec}s, stop after ${maxWaitMin}min`)

  while (Date.now() < deadline) {
    attempt++
    // ------------------ appel get_scan via MCP ------------------
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
      `[${new Date().toISOString()}] try #${attempt} → state=${state}, progress=${scan.progress ?? 'n/a'}`
    )

    if (state === 'completed' || state === 'completed_degraded' || state === 'failed') {
      console.log('🏁 Scan finished →', JSON.stringify(scan, null, 2))
      return
    }

    await sleep(intervalMs)
  }

  console.error('⏰ Timeout exceeded without reaching completed|failed')
}

main().catch(err => {
  console.error('❌ Fatal error', err.response?.data || err.message)
})
