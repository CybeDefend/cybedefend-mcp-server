// src/tools/getSimilarVulnerabilities.ts
import axios from "axios";
import { forwardAuth } from "../utils/forwardAuth.js";
import { API_BASE } from "../utils/apiBase.js";
import { resolveProjectId } from "../utils/projectId.js";

export const getSimilarVulnerabilitiesTool = {
    name: "get_similar_vulnerabilities",
    description:
        "Get a vulnerability with its similar occurrences across the project. If projectId is omitted, uses CYBEDEFEND_PROJECT_ID.",
    inputSchema: {
        type: "object",
        properties: {
            projectId: { type: "string", description: "Optional. Defaults to CYBEDEFEND_PROJECT_ID." },
            vulnerabilityId: { type: "string", description: "UUID of the vulnerability." },
            pathFilter: { type: "string", description: "Optional file path filter." },
        },
        required: ["vulnerabilityId"],
    },
    async run({ projectId, vulnerabilityId, pathFilter }: any, clientHeaders: Record<string, string | undefined>) {
        const pid = resolveProjectId(projectId);
        const res = await axios.get(
            `${API_BASE}/project/${pid}/results/${vulnerabilityId}/similar`,
            {
                headers: { ...forwardAuth(clientHeaders), "User-Agent": "cybedefend-mcp/1.0" },
                params: pathFilter ? { pathFilter } : undefined,
                timeout: 15_000,
            },
        );
        return res.data;
    },
};
