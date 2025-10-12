// src/tools/listScaPackages.ts
import axios from "axios";
import { forwardAuth } from "../utils/forwardAuth.js";
import { API_BASE } from "../utils/apiBase.js";
import { resolveProjectId } from "../utils/projectId.js";

export const listScaPackagesTool = {
  name: "list_sca_packages",
  description: "List all detected packages (SCA) for a project. If projectId is omitted, uses CYBEDEFEND_PROJECT_ID from your MCP config (e.g., VS Code .vscode/mcp.json env).",
  inputSchema: {
    type: "object",
    properties: {
      projectId: { type: "string", description: "Optional. Defaults to CYBEDEFEND_PROJECT_ID" },
      page: { type: "number", minimum: 1 },
      limit: { type: "number", minimum: 1, maximum: 500 }
    },

  },
  async run(params: any, clientHeaders: Record<string, string | undefined>) {
    const { projectId } = params;
    const pid = resolveProjectId(projectId)
    const res = await axios.get(`${API_BASE}/project/${pid}/results/sca/packages`, {
      headers: { ...forwardAuth(clientHeaders), "User-Agent": "cybedefend-mcp/1.0" },
      timeout: 15_000,
    });
    return res.data;
  },
};
