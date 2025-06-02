# CybeDefend MCP Server

Un serveur MCP (Model Context Protocol) simple pour intégrer les fonctionnalités de sécurité CybeDefend dans vos assistants IA.

## Overview

Ce serveur MCP permet aux assistants IA d'interagir avec la plateforme de sécurité CybeDefend pour :

- **Démarrer des scans de sécurité** : Upload de code et lancement d'analyses
- **Suivre les scans** : Monitoring en temps réel des analyses en cours
- **Récupérer les résultats** : Accès aux vulnérabilités détectées

## Installation

### 1. Prérequis

Récupérez votre clé API CybeDefend depuis votre compte.

### 2. Build du projet

```bash
git clone https://github.com/cybedefend/mcp-server
cd cybedefend-mcp-server
npm install
npm run build
```

### 3. Configuration dans Cursor/Claude

Ajoutez cette configuration dans votre fichier `.cursor/mcp.json` :

```json
{
  "mcpServers": {
    "cybedefend": {
      "command": "node",
      "args": ["/path/to/cybedefend-mcp-server/dist/index.js"],
      "workingDirectory": "/path/to/cybedefend-mcp-server",
      "env": {
        "CYBEDEFEND_API_KEY": "votre_api_key_ici",
        "API_BASE": "https://app-preprod.cybedefend.com"
      }
    }
  }
}
```

## Outils disponibles

Le serveur MCP fournit actuellement 2 outils :

### `start_scan`
Lance un scan de sécurité en uploadant un fichier ZIP.

**Paramètres :**
- `projectId` : ID du projet CybeDefend
- `fileName` : Nom du fichier ZIP
- `fileBufferBase64` : Contenu du fichier encodé en base64

**Retourne :**
- `success` : Statut du démarrage
- `scanId` : ID du scan créé
- `detectedLanguages` : Langages détectés dans le code

### `get_scan`
Récupère l'état actuel d'un scan (progression, vulnérabilités...).

**Paramètres :**
- `projectId` : ID du projet
- `scanId` : ID du scan

**Retourne :**
Les détails complets du scan incluant l'état, la progression et les vulnérabilités trouvées.

## Exemples d'utilisation

### Démarrer un scan
```
Lance un scan de sécurité pour le projet "abc123" avec le fichier ZIP que j'ai uploadé
```

### Vérifier le statut
```
Vérifie le statut du scan "def456" pour le projet "abc123"
```

## Architecture

Le serveur utilise le protocole STDIO pour communiquer avec les clients MCP. Il n'y a pas d'OpenAPI ni de serveur HTTP - tout passe par les entrées/sorties standard.

Les outils sont définis manuellement dans le code source et utilisent l'API REST de CybeDefend pour exécuter les actions.

## Développement

### Lancer en mode dev
```bash
npm run build && node dist/index.js
```

### Tests
```bash
npm test
```

## Support

Pour toute question ou problème, contactez l'équipe CybeDefend.
