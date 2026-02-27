// src/tools/listVulnerabilitiesSca.ts
import axios from "axios";
import { forwardAuth } from "../utils/forwardAuth.js";
import { API_BASE } from "../utils/apiBase.js";
import { resolveProjectId } from "../utils/projectId.js";

export const listVulnerabilitiesScaTool = {
  name: "list_vulnerabilities_sca",
  description:
    "List SCA vulnerabilities of a project with optional filters and pagination. If projectId is omitted, uses CYBEDEFEND_PROJECT_ID.",
  inputSchema: {
    type: "object",
    properties: {
      projectId: { type: "string", description: "Optional. Defaults to CYBEDEFEND_PROJECT_ID." },
      severity: {
        type: "array",
        items: { type: "string", enum: ["critical", "high", "medium", "low"] },
        description: "Filter by severity levels.",
      },
      status: {
        type: "array",
        items: { type: "string", enum: ["to_verify", "not_exploitable", "proposed_not_exploitable", "resolved", "confirmed", "ignored"] },
        description: "Filter by statuses.",
      },
      priority: {
        type: "array",
        items: { type: "string", enum: ["critical_urgent", "urgent", "normal", "low", "very_low"] },
        description: "Filter by priority levels.",
      },
      packageType: {
        type: "array",
        items: { type: "string", enum: ["direct", "dev", "transitive"] },
        description: "Filter by package dependency type.",
      },
      language: { type: "string", description: "Filter by language." },
      searchQuery: { type: "string", description: "Full-text search query." },
      branch: { type: "string", description: "Filter by branch name." },
      hasAutofix: { type: "boolean", description: "Filter by autofix availability." },
      sort: {
        type: "string",
        enum: ["currentState", "currentSeverity", "currentPriority", "createdAt", "updatedAt", "currentCVSS"],
        description: "Sort field.",
      },
      order: { type: "string", enum: ["asc", "desc"], description: "Sort order." },
      page: { type: "number", minimum: 1, description: "Page number." },
      limit: { type: "number", minimum: 10, maximum: 100, description: "Page size (10-100)." },
    },
  },
  async run(params: any, clientHeaders: Record<string, string | undefined>) {
    const { projectId, ...query } = params;
    const pid = resolveProjectId(projectId);
    const res = await axios.get(`${API_BASE}/project/${pid}/results/sca`, {
      headers: { ...forwardAuth(clientHeaders), "User-Agent": "cybedefend-mcp/1.0" },
      params: query,
      timeout: 15_000,
    });
    return res.data;
  },
};
