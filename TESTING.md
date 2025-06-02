# Configuration de test expliquée

## Pourquoi des URLs fictives dans `.env.test` ?

Les tests de ce projet **ne font AUCUN appel HTTP réel** vers votre API. Voici pourquoi :

### Types de tests dans ce projet :

1. **Tests de structure** (`toolbox-integration.test.ts`) 
   - Vérifient que les tools sont bien chargés
   - Testent la structure des objets (name, description, inputSchema)
   - **Ne font pas d'appels HTTP**

2. **Tests MCP Protocol** (`rpc.test.ts`)
   - Testent le serveur JSON-RPC
   - Vérifient `list_tools` et `call_tool` 
   - **Ne font pas d'appels HTTP vers votre API**

3. **Tests unitaires** (`openapi-server.test.ts`, `stdio.test.ts`)
   - Testent l'initialisation des composants
   - **Ne font pas d'appels HTTP**

### Où sont utilisées les variables d'environnement ?

| Variable | Usage dans les TESTS | Usage en PRODUCTION |
|----------|---------------------|---------------------|
| `API_BASE` | Nécessaire pour éviter les erreurs d'initialisation | Utilisé pour les vrais appels API |
| ~~`API_BASE_URL`~~ | ❌ **SUPPRIMÉE** (duplication inutile) | ❌ **SUPPRIMÉE** |
| ~~`API_HEADERS`~~ | ❌ **SUPPRIMÉE** (pas utilisée dans les tests) | Utilisé par l'OpenAPI server |
| ~~`MY_API_KEY`~~ | ❌ **SUPPRIMÉE** (pas utilisée dans les tests) | ❌ Pas utilisée nulle part |

## Configuration actuelle simplifiée

### `.env.test` (pour les tests)
```bash
# Ces valeurs sont fictives car les tests ne font pas d'appels HTTP réels
API_BASE=https://mock.cybedefend.test
```

### `.env` (pour le développement)
```bash
API_BASE=http://localhost:3000      # Votre vraie API NestJS
MCP_SERVER=http://localhost:4001    # Votre serveur MCP
MY_API_KEY=...                      # Votre vraie clé API
API_HEADERS=X-API-Key:...           # Headers pour l'OpenAPI server
```

## Refactoring effectué ✅

1. **Supprimé la duplication** : Plus de `API_BASE_URL`, on utilise seulement `API_BASE`
2. **Simplifié les tests** : Plus de variables inutiles dans `.env.test`
3. **Documentation claire** : Explique pourquoi les URLs de test sont fictives
4. **Validation précise** : Les tests vérifient seulement `API_BASE`

## Si vous voulez tester les vrais appels API

Pour cela, il faudrait créer des **tests d'intégration** séparés qui :
- Utilisent votre vraie API en local
- Testent les appels HTTP réels
- Utilisent les vraies variables d'environnement

Actuellement, les tests se contentent de vérifier que le serveur MCP fonctionne correctement sans faire d'appels externes.
