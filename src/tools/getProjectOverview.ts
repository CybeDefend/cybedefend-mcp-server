// src/tools/getProjectOverview.ts
import axios from "axios";
import { forwardAuth } from "../utils/forwardAuth.js";
import { API_BASE } from "../utils/apiBase.js";
import { resolveProjectId } from "../utils/projectId.js";

export const getProjectOverviewTool = {
  name: "get_project_overview",
  description: "Returns a security overview of a project (critical counts, etc.)",
  inputSchema: {
    type: "object",
    properties: { projectId: { type: "string", description: "Optional. Defaults to CYBEDEFEND_PROJECT_ID" } },
  },
  async run({ projectId }: any, clientHeaders: Record<string, string | undefined>) {
    const pid = resolveProjectId(projectId)
    const res = await axios.get(`${API_BASE}/project/${pid}/results/overview`, {
      headers: { ...forwardAuth(clientHeaders), "User-Agent": "cybedefend-mcp/1.0" },
      timeout: 15_000,
    });
    return res.data;
  },
};
