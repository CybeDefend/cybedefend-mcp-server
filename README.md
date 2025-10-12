# CybeDefend MCP Server

**Secure-by-design companion for AI code assistants.**
This MCP (Model-Context Protocol) server plugs your favourite LLM (Cursor, Claude, VS Code Copilot Chat…) into the CybeDefend platform.

---

## 🌟 What you get

| Benefit                     | What it enables in your IDE                                                     |
| --------------------------- | -------------------------------------------------------------------------------- |
| **Direct vulnerability access** | Fetch SAST, IaC, and SCA findings using your default project (CYBEDEFEND_PROJECT_ID). |
| **In-IDE remediation**      | Jump to the exact file/line with code snippets so your AI assistant can fix inline. |
| **Always up-to-date**       | Pull the latest results and statuses from CybeDefend as scans complete.          |
| **Zero-setup**              | One command, no local API proxies, pure STDIO.                                   |

All endpoints are thin wrappers around CybeDefend’s REST API; no data is stored locally.

---

## 1 · Quick start

### 1.1 Prerequisites

* Node ≥ 18
* A **CybeDefend API key** with project-level access

### 1.2 Install globally (optional)

```bash
npm i -g @cybedefend/mcp-server      # always latest version
```

> **Tip :** You can also rely on `npx` (see below) – no global install needed.

---

## 2 · Using in your AI client

Below are copy-paste snippets for the three most popular MCP clients.
Replace the values in **bold**.

Region selection

- You can point the server to the right region in two ways, in order of precedence:
  1. API_BASE – full URL to the API (e.g. https://api-eu.cybedefend.com)
  2. REGION – short code: "eu" or "us". Defaults to "us" if omitted or unknown.
  If both are set, API_BASE wins.

Default project (recommended)

- Set CYBEDEFEND_PROJECT_ID (your project UUID) so you never have to pass projectId to tools.
- Precedence: a projectId explicitly provided to a tool overrides CYBEDEFEND_PROJECT_ID.

### 2.1 Cursor / Claude Desktop (`~/.cursor/mcp.json`)

```jsonc
{
  "mcpServers": {
    "cybedefend": {
      "command": "npx",           // auto-installs or updates
      "args":   ["-y", "@cybedefend/mcp-server"],
      "env": {
        // Option A – explicit API base (highest precedence)
        // "API_BASE": "https://api-eu.cybedefend.com",

        // Option B – region selector (eu | us), defaults to "us"
        "REGION": "us",

  // Default projectId used by all tools
  "CYBEDEFEND_PROJECT_ID": "proj_********",

        "CYBEDEFEND_API_KEY": "cybe_********"
      }
    }
  }
}
```

*Need a specific version?* → `"args": ["@cybedefend/mcp-server@1.2.3"]`

### 2.2 VS Code – MCP extension

`.vscode/mcp.json` (user or workspace) :

```jsonc
"servers": {
    "cybedefend": {
      "command": "npx",
      "args": [
        "-y",
        "@cybedefend/mcp-server@latest"
      ],
      "env": {
        // "API_BASE": "https://api-eu.cybedefend.com",
        "REGION": "us",
  "CYBEDEFEND_PROJECT_ID": "proj_****",
        "CYBEDEFEND_API_KEY": "cybe_****"
      }
    }
  }
```

Run “**MCP: Reload servers**” from the Command Palette.

### 2.3 Docker (air-gapped CI, etc.)

```bash
docker run --rm -i \
  -e CYBEDEFEND_API_KEY=cybe_*** \
  # Optional: pick region (eu | us) or set API_BASE explicitly
  -e REGION=us \
  # Default projectId used by all tools
  -e CYBEDEFEND_PROJECT_ID=proj_*** \
  ghcr.io/cybedefend/cybedefend-mcp-server:latest
```

> The image is multi-arch (amd64 / arm64) and includes Node runtimes.

---

## 3 · Available tools

| Category     | Tool name                   | What it returns                          |
| ------------ | --------------------------- | ---------------------------------------- |
|  **Scan**            | `get_scan`                  | Current state, % progress, counts        |
| **Overview** | `get_project_overview`      | Critical/high/… per scanner              |
| **SAST**     | `list_vulnerabilities_sast` | Paginated list with filters              |
|              | `get_vulnerability_sast`    | Single finding, code snippet             |
| **IaC**      | `list_vulnerabilities_iac`  | 〃                                        |
|              | `get_vulnerability_iac`     | 〃                                        |
| **SCA**      | `list_vulnerabilities_sca`  | 〃                                        |
|              | `get_vulnerability_sca`     | 〃                                        |
|              | `list_sca_packages`         | All third-party packages                 |

Schema for every tool is embedded; assistants receive it automatically.

---

## 4 · Typical chat prompts

Assumes CYBEDEFEND_PROJECT_ID is set; you don't need to pass projectId in prompts.

| Prompt                                               | Internally calls            |
| ---------------------------------------------------- | --------------------------- |
| “Scan my repo **frontend.zip**.”                      | `start_scan`                |
| “How far along is scan **abcd-efgh** ?”              | `get_scan`                  |
| “Show critical SAST bugs in Java.”                   | `list_vulnerabilities_sast` |
| “Details of vuln **c0ffee**.”                        | `get_vulnerability_sast`    |

*(Cursor / Claude will pick the tool + arguments – no manual JSON needed.)*

---

## 5 · Local development

```bash
git clone https://github.com/cybedefend/mcp-server
cd mcp-server
npm i
npm run build              # TS → dist/
node dist/index.js         # runs on STDIO
```

### Tests

```bash
npm t           # Vitest + coverage
```

---

## 6 · Publishing a new version (maintainers)

```bash
# ensure dist/ is up-to-date
npm run build

# bump + publish – prepare script rebuilds automatically
npm version patch
npm publish --access public
```

Check before shipping:

```bash
npm pack --dry-run | grep dist/index.js   # must be present
```

---

## 7 · Support & feedback

* **Docs** : [https://docs.cybedefend.com](https://docs.cybedefend.com)
* **Issues** / PRs : [https://github.com/CybeDefend/cybedefend-mcp-server](https://github.com/CybeDefend/cybedefend-mcp-server)
* **Email** : [support@cybedefend.com](mailto:support@cybedefend.com)

> Pull-requests welcome — especially for new tools or language bindings!