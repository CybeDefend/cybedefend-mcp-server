// src/tools/getBranches.ts
import axios from "axios";
import { forwardAuth } from "../utils/forwardAuth.js";
import { API_BASE } from "../utils/apiBase.js";
import { resolveProjectId } from "../utils/projectId.js";

export const getBranchesTool = {
    name: "get_branches",
    description:
        "Get all distinct branches from vulnerability detections. If projectId is omitted, uses CYBEDEFEND_PROJECT_ID.",
    inputSchema: {
        type: "object",
        properties: {
            projectId: { type: "string", description: "Optional. Defaults to CYBEDEFEND_PROJECT_ID." },
        },
    },
    async run(params: any, clientHeaders: Record<string, string | undefined>) {
        const pid = resolveProjectId(params.projectId);
        const res = await axios.get(`${API_BASE}/project/${pid}/branches`, {
            headers: { ...forwardAuth(clientHeaders), "User-Agent": "cybedefend-mcp/1.0" },
            timeout: 15_000,
        });
        return res.data;
    },
};
