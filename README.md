# CybeDefend MCP Server

A simple MCP (Model Context Protocol) server to integrate CybeDefend security features into your AI assistants.

## Overview

This MCP server allows AI assistants to interact with the CybeDefend security platform to:

- **Start security scans**: Upload code and launch analyses
- **Monitor scans**: Real-time monitoring of ongoing analyses
- **Retrieve results**: Access detected vulnerabilities and detailed reports

## Installation

### 1. Prerequisites

Get your CybeDefend API key from your account.

### 2. Build the project

```bash
git clone https://github.com/cybedefend/mcp-server
cd cybedefend-mcp-server
npm install
npm run build
```

### 3. Configuration in Cursor/Claude

Add this configuration to your `.cursor/mcp.json` file:

```json
{
  "mcpServers": {
    "cybedefend": {
      "command": "node",
      "args": ["/path/to/cybedefend-mcp-server/dist/index.js"],
      "workingDirectory": "/path/to/cybedefend-mcp-server",
      "env": {
        "CYBEDEFEND_API_KEY": "your_api_key_here",
        "API_BASE": "https://app-preprod.cybedefend.com"
      }
    }
  }
}
```

> **Note**: Replace `/path/to/cybedefend-mcp-server` with the absolute path to your project folder.

## Available Tools

The MCP server currently provides 10 tools:

### Scan Management

#### `start_scan`
Start a security scan by uploading a ZIP file.

**Parameters:**
- `projectId`: CybeDefend project ID
- `fileName`: ZIP file name
- `fileBufferBase64`: File content encoded in base64

**Returns:**
- `success`: Start status
- `scanId`: Created scan ID
- `detectedLanguages`: Programming languages detected in the code

#### `get_scan`
Retrieve the current state of a scan (progress, vulnerabilities...).

**Parameters:**
- `projectId`: Project ID
- `scanId`: Scan ID

**Returns:**
Complete scan details including state, progress, and vulnerabilities found.

### Project Overview

#### `get_project_overview`
Get a security overview of a project (critical counts, etc.).

**Parameters:**
- `projectId`: Project ID

**Returns:**
Security overview with vulnerability counts by severity and type.

### SAST (Static Application Security Testing)

#### `list_vulnerabilities_sast`
List SAST vulnerabilities of a project with optional filters.

**Parameters:**
- `projectId`: Project ID (required)
- `severity`: Filter by severity (`critical`, `high`, `medium`, `low`)
- `status`: Filter by status (`to_verify`, `not_exploitable`, `confirmed`, `resolved`, `ignored`, `proposed_not_exploitable`)
- `language`: Filter by programming language
- `page`: Page number (minimum 1)
- `limit`: Results per page (1-500)

#### `get_vulnerability_sast`
Get detailed information about a specific SAST vulnerability.

**Parameters:**
- `projectId`: Project ID (required)
- `vulnerabilityId`: Vulnerability ID (required)
- `language`: Programming language (optional)

### IaC (Infrastructure as Code)

#### `list_vulnerabilities_iac`
List IaC vulnerabilities of a project with optional filters.

**Parameters:**
- `projectId`: Project ID (required)
- `severity`: Filter by severity (`critical`, `high`, `medium`, `low`)
- `status`: Filter by status (`to_verify`, `not_exploitable`, `confirmed`, `resolved`, `ignored`, `proposed_not_exploitable`)
- `language`: Filter by language
- `page`: Page number (minimum 1)
- `limit`: Results per page (1-500)

#### `get_vulnerability_iac`
Get detailed information about a specific IaC vulnerability.

**Parameters:**
- `projectId`: Project ID (required)
- `vulnerabilityId`: Vulnerability ID (required)
- `language`: Language (optional)

### SCA (Software Composition Analysis)

#### `list_vulnerabilities_sca`
List SCA vulnerabilities of a project with optional filters.

**Parameters:**
- `projectId`: Project ID (required)
- `severity`: Filter by severity (`critical`, `high`, `medium`, `low`)
- `status`: Filter by status (`to_verify`, `not_exploitable`, `confirmed`, `resolved`, `ignored`, `proposed_not_exploitable`)
- `language`: Filter by language
- `page`: Page number (minimum 1)
- `limit`: Results per page (1-500)

#### `get_vulnerability_sca`
Get detailed information about a specific SCA vulnerability.

**Parameters:**
- `projectId`: Project ID (required)
- `vulnerabilityId`: Vulnerability ID (required)
- `language`: Language (optional)

#### `list_sca_packages`
List all detected packages (SCA) for a project.

**Parameters:**
- `projectId`: Project ID (required)
- `page`: Page number (minimum 1)
- `limit`: Results per page (1-500)

## Usage Examples

### Starting a scan
```
Start a security scan for project "abc123" with the ZIP file I uploaded
```

### Checking scan status
```
Check the status of scan "def456" for project "abc123"
```

### Getting project overview
```
Show me the security overview for project "abc123"
```

### Listing vulnerabilities
```
List all critical SAST vulnerabilities for project "abc123"
```

### Getting vulnerability details
```
Show me details of SAST vulnerability "vuln-456" in project "abc123"
```

### Listing packages
```
List all detected packages for project "abc123"
```

## Architecture

The server uses the STDIO protocol to communicate with MCP clients. There's no OpenAPI or HTTP server - everything goes through standard input/output.

Tools are manually defined in the source code and use CybeDefend's REST API to perform actions.

## Development

### Run in dev mode
```bash
npm run build && node dist/index.js
```

### Tests
```bash
npm test
```

## Support

For any questions or issues, contact the CybeDefend team.
