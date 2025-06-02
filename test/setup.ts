// Setup for tests
import { config } from 'dotenv'

// Load test environment variables
config({ path: '.env.test' })

// Verify required environment variables are loaded
if (!process.env.API_BASE) {
  throw new Error('Missing API_BASE in .env.test file.')
}
