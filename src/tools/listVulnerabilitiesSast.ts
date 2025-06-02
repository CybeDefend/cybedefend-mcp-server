// src/tools/listVulnerabilitiesSast.ts
import axios from "axios";
import { forwardAuth } from "../utils/forwardAuth.js";
const API_BASE = process.env.API_BASE!;

export const listVulnerabilitiesSastTool = {
  name: "list_vulnerabilities_sast",
  description: "List SAST vulnerabilities of a project; accepts optional filters.",
  inputSchema: {
    type: "object",
    properties: {
      projectId: { type: "string" },
      severity:  { type: "string", enum: ["critical", "high", "medium", "low"] },
      status:    { type: "string", enum: ["to_verify", "not_exploitable", "confirmed", "resolved", "ignored", "proposed_not_exploitable"] },
      language:  { type: "string" },
      page:      { type: "number", minimum: 1 },
      limit:     { type: "number", minimum: 1, maximum: 500 }
    },
    required: ["projectId"]
  },
  async run(params: any, clientHeaders: Record<string, string | undefined>) {
    const { projectId, ...query } = params;
    const qs = new URLSearchParams(Object.entries(query).filter(([,v]) => v != null).map(([k,v]) => [k, String(v)]));
    const res = await axios.get(`${API_BASE}/project/${projectId}/results/sast?${qs.toString()}`, {
      headers: { ...forwardAuth(clientHeaders), "User-Agent": "cybedefend-mcp/1.0" },
      timeout: 15_000,
    });
    return res.data;
  },
};
