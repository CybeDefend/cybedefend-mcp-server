// src/tools/getProjectOverview.ts
import axios from "axios";
import { forwardAuth } from "../utils/forwardAuth.js";
const API_BASE = "https://api-preprod.cybedefend.com"

export const getProjectOverviewTool = {
  name: "get_project_overview",
  description: "Returns a security overview of a project (critical counts, etc.)",
  inputSchema: {
    type: "object",
    properties: { projectId: { type: "string" } },
    required: ["projectId"],
  },
  async run({ projectId }: any, clientHeaders: Record<string, string | undefined>) {
    const res = await axios.get(`${API_BASE}/project/${projectId}/results/overview`, {
      headers: { ...forwardAuth(clientHeaders), "User-Agent": "cybedefend-mcp/1.0" },
      timeout: 15_000,
    });
    return res.data;
  },
};
