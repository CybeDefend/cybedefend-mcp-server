# CybeDefend MCP Server
![npm version](https://img.shields.io/npm/v/@cybedefend/mcp-server)
![License](https://img.shields.io/github/license/cybedefend/mcp-server)

This project implements an MCP (Model Context Protocol) server for the CybeDefend security platform, enabling AI assistants to interact with vulnerability scanning and security analysis features.

![CybeDefend MCP Demo](https://via.placeholder.com/800x400?text=CybeDefend+MCP+Server+Demo)

## Overview

The CybeDefend MCP Server bridges AI assistants (like Claude or ChatGPT) with CybeDefend's comprehensive security scanning platform. It provides secure access to:

- **Security Scan Management**: Start, monitor, and retrieve vulnerability scans
- **Multi-Type Analysis**: SAST, DAST, SCA, IaC, and Container security scanning
- **Real-time Monitoring**: Track scan progress and completion status
- **Vulnerability Data**: Access detailed security findings and reports

## Installation

### Setting up API Authentication in CybeDefend

1. **Login to CybeDefend Platform**:
   - Go to [CybeDefend Platform](https://app-preprod.cybedefend.com) and sign in to your account
   - Navigate to your profile settings

2. **Generate API Key**:
   - Create a new API integration or select an existing one
   - Copy your API key

⚠️ **Security Notice**: While the MCP server provides controlled access to CybeDefend's API, there is potential risk to your security data when exposed to LLMs. Security-conscious users should:
- Use dedicated API keys
- Regularly rotate API credentials

3. **Configure Project Access**:
   - Ensure your API key has access to the projects you want to scan
   - Verify permissions for starting scans and accessing vulnerability data

### Adding MCP Configuration to Your AI Client

#### Using npm:
Add the following to your `.cursor/mcp.json` or `claude_desktop_config.json` (macOS: `~/Library/Application\ Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "cybedefend": {
      "command": "npx",
      "args": ["-y", "@cybedefend/mcp-server"],
      "env": {
        "API_BASE": "https://app-preprod.cybedefend.com",
        "CYBEDEFEND_API_KEY": "cybe_****"
      }
    }
  }
}
```

#### Using Docker:

**Option 1: Using Docker Hub (Recommended)**

```json
{
  "mcpServers": {
    "cybedefend": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "-e", "API_BASE",
        "-e", "CYBEDEFEND_API_KEY",
        "cybedefend/mcp-server"
      ],
      "env": {
        "API_BASE": "https://app-preprod.cybedefend.com",
        "CYBEDEFEND_API_KEY": "cybe_****"
      }
    }
  }
}
```

**Option 2: Building Locally**

First, build the Docker image:
```bash
docker-compose build
```

Then add to your MCP configuration:
```json
{
  "mcpServers": {
    "cybedefend": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "-e", "API_BASE=https://app-preprod.cybedefend.com",
        "-e", "CYBEDEFEND_API_KEY=cybe_****",
        "cybedefend-mcp-server"
      ]
    }
  }
}
```

⚠️ **Important**: Replace `cybe_****` with your actual CybeDefend API key.

### Installing via Smithery

[![smithery badge](https://smithery.ai/badge/@cybedefend/mcp-server)](https://smithery.ai/server/@cybedefend/mcp-server)

To install CybeDefend MCP Server for Claude Desktop automatically via Smithery:

```bash
npx -y @smithery/cli install @cybedefend/mcp-server --client claude
```

## Examples

### Starting a Security Scan

Using the following instruction:
```
Start a security scan for project "web-app-frontend" using the uploaded source code ZIP file
```

The AI will:
1. Upload your ZIP file to CybeDefend
2. Initiate a comprehensive security scan
3. Return the scan ID and detected programming languages

### Monitoring Scan Progress

```
Check the status of scan abc123 for project def456
```

The AI will retrieve real-time scan progress, including:
- Current scan state (queued, running, completed, failed)
- Progress percentage
- Current analysis step
- Detected vulnerabilities count

### Waiting for Scan Completion

```
Wait for scan abc123 to complete and show me the results
```

The AI will:
1. Poll the scan status every 10 seconds
2. Wait up to 30 minutes for completion
3. Display final results when ready

### Direct API Calls

You can also reference specific IDs directly:
```
Get the vulnerability details for scan f47ac10b-58cc-4372-a567-0e02b2c3d479 in project 550e8400-e29b-41d4-a716-446655440000
```

## Available Tools

The MCP server provides three main tools:

1. **`start_scan`**: Upload code and initiate security analysis
   - Supports ZIP file uploads (Base64 encoded)
   - Returns scan ID and detected languages
   - Triggers SAST, SCA, IaC, and other security checks

2. **`get_scan`**: Retrieve current scan status and results
   - Real-time progress tracking
   - Vulnerability counts by severity and type
   - Detailed scan metadata

3. **`wait_scan_complete`**: Poll until scan completion
   - Configurable polling interval (default: 10 seconds)
   - Maximum wait time protection (default: 30 minutes)
   - Automatic result retrieval upon completion

## Security Features

- **Multiple Analysis Types**: SAST, DAST, SCA, IaC, Container scanning
- **Severity Classification**: Critical, High, Medium, Low vulnerability ratings
- **Language Detection**: Automatic identification of programming languages
- **Progress Tracking**: Real-time scan status and completion monitoring
- **Secure Authentication**: API key-based authentication with CybeDefend platform

## Development

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

### Local Development

```bash
npm run stdio:dev
```

### Execute Locally

```bash
npx -y --prefix /path/to/local/cybedefend-mcp-server @cybedefend/mcp-server
```

## API Reference

The MCP server interfaces with the CybeDefend API v1.0, providing access to:

- Project management endpoints
- Scan lifecycle operations
- Vulnerability data retrieval
- Real-time status monitoring

For detailed API documentation, visit the [CybeDefend API Documentation](https://docs.cybedefend.com/alpha/api-reference/introduction).

## Support

- **Email**: support@cybedefend.com
- **Documentation**: [CybeDefend Docs](https://docs.cybedefend.com)
- **Issues**: [GitHub Issues](https://github.com/cybedefend/mcp-server/issues)
