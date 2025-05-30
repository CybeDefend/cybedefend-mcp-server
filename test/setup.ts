// Setup pour les tests
import { config } from 'dotenv'

// Charger les variables d'environnement de test
config({ path: '.env.test' })

// Configuration par défaut pour éviter les erreurs
if (!process.env.API_BASE) {
  process.env.API_BASE = 'https://api.example.com'
}
if (!process.env.API_BASE_URL) {
  process.env.API_BASE_URL = 'https://api.example.com'
}
