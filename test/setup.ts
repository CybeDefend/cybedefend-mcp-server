// Setup for tests
import { config } from 'dotenv'

// Load test environment variables
config({ path: '.env.test' })

// Default configuration to avoid errors
if (!process.env.API_BASE) {
  process.env.API_BASE = 'https://api.example.com'
}
if (!process.env.API_BASE_URL) {
  process.env.API_BASE_URL = 'https://api.example.com'
}
