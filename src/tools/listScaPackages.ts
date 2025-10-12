// src/tools/listScaPackages.ts
import axios from "axios";
import { forwardAuth } from "../utils/forwardAuth.js";
import { API_BASE } from "../utils/apiBase.js";

export const listScaPackagesTool = {
  name: "list_sca_packages",
  description: "List all detected packages (SCA) for a project.",
  inputSchema: {
    type: "object",
    properties: {
      projectId: { type: "string" },
      page: { type: "number", minimum: 1 },
      limit: { type: "number", minimum: 1, maximum: 500 }
    },
    required: ["projectId"]
  },
  async run(params: any, clientHeaders: Record<string, string | undefined>) {
    const { projectId } = params;
    const res = await axios.get(`${API_BASE}/project/${projectId}/results/sca/packages`, {
      headers: { ...forwardAuth(clientHeaders), "User-Agent": "cybedefend-mcp/1.0" },
      timeout: 15_000,
    });
    return res.data;
  },
};
