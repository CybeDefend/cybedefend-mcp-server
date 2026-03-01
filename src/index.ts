#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    ListToolsRequestSchema,
    CallToolRequestSchema,
    ErrorCode,
    McpError,
} from "@modelcontextprotocol/sdk/types.js";

import { log } from "./utils/logger.js";

// ── Overview & branches ──
import { getProjectOverviewTool } from "./tools/getProjectOverview.js";
import { getBranchesTool } from "./tools/getBranches.js";

// ── SAST ──
import { listVulnerabilitiesSastTool } from "./tools/listVulnerabilitiesSast.js";
import { getVulnerabilitySastTool } from "./tools/getVulnerabilitySast.js";

// ── SCA ──
import { listVulnerabilitiesScaTool } from "./tools/listVulnerabilitiesSca.js";
import { getVulnerabilityScaTool } from "./tools/getVulnerabilitySca.js";
import { listScaPackagesTool } from "./tools/listScaPackages.js";

// ── IAC ──
import { listVulnerabilitiesIacTool } from "./tools/listVulnerabilitiesIac.js";
import { getVulnerabilityIacTool } from "./tools/getVulnerabilityIac.js";

// ── CI/CD ──
import { listVulnerabilitiesCicdTool } from "./tools/listVulnerabilitiesCicd.js";
import { getVulnerabilityCicdTool } from "./tools/getVulnerabilityCicd.js";

// ── Secret ──
import { listVulnerabilitiesSecretTool } from "./tools/listVulnerabilitiesSecret.js";
import { getVulnerabilitySecretTool } from "./tools/getVulnerabilitySecret.js";

// ── Container ──
import { listVulnerabilitiesContainerTool } from "./tools/listVulnerabilitiesContainer.js";
import { getVulnerabilityContainerTool } from "./tools/getVulnerabilityContainer.js";

// ── Cross-type actions ──
import { updateVulnerabilityTool } from "./tools/updateVulnerability.js";
import { getSimilarVulnerabilitiesTool } from "./tools/getSimilarVulnerabilities.js";

const CUSTOM_TOOLS = [
    // Overview & branches
    getProjectOverviewTool,
    getBranchesTool,

    // SAST
    listVulnerabilitiesSastTool,
    getVulnerabilitySastTool,

    // SCA
    listVulnerabilitiesScaTool,
    getVulnerabilityScaTool,
    listScaPackagesTool,

    // IAC
    listVulnerabilitiesIacTool,
    getVulnerabilityIacTool,

    // CI/CD
    listVulnerabilitiesCicdTool,
    getVulnerabilityCicdTool,

    // Secret
    listVulnerabilitiesSecretTool,
    getVulnerabilitySecretTool,

    // Container
    listVulnerabilitiesContainerTool,
    getVulnerabilityContainerTool,

    // Cross-type actions
    updateVulnerabilityTool,
    getSimilarVulnerabilitiesTool,
];

/* ------------------------------------------------------------------ */
/* Helper : convert result to MCP text format */
function toMcpText(result: unknown) {
    return [
        typeof result === "string"
            ? { type: "text", text: result }
            : { type: "text", text: JSON.stringify(result, null, 2) },
    ];
}

/* ------------------------------------------------------------------ */
/* 1. Create MCP Server                                          */
const server = new Server(
    { name: "cybedefend-mcp", version: "1.0.0" },
    { capabilities: { tools: {} } },
);

/* ------------------------------------------------------------------ */
/* 2. Handler “list_tools”                                             */
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: CUSTOM_TOOLS.map(({ name, description, inputSchema }) => ({
        name,
        description,
        inputSchema,
    })),
}));

/* ------------------------------------------------------------------ */
/* 3. Handler “call_tool”                                              */
server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const { name, arguments: args } = req.params;
    const tool = CUSTOM_TOOLS.find((t) => t.name === name);
    if (!tool) throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);

    try {
        const result = await tool.run(args, {}); // pas d’en-têtes HTTP côté STDIO
        return { content: toMcpText(result) };
    } catch (e: any) {
        log.error("Tool error:", e);
        // Return API errors as content so the LLM can reason about them
        if (e.response) {
            const status = e.response.status;
            const data = e.response.data;
            const detail = typeof data === "string" ? data : JSON.stringify(data, null, 2);
            return {
                content: [{ type: "text" as const, text: `API error ${status}: ${detail}` }],
                isError: true,
            };
        }

        // Network / timeout errors
        if (e.code === "ECONNREFUSED" || e.code === "ETIMEDOUT" || e.code === "ENOTFOUND") {
            return {
                content: [{ type: "text" as const, text: `Network error: ${e.message}` }],
                isError: true,
            };
        }
        throw new McpError(ErrorCode.InternalError, e.message ?? "internal_error");
    }
});

/* ------------------------------------------------------------------ */
/* 4. Connexion STDIO                                                  */
const transport = new StdioServerTransport();
server.connect(transport).then(() =>
    console.error("[INFO] CybeDefend MCP ready on STDIO"),
);

/* Gestion Ctrl-C ---------------------------------------------------- */
process.on("SIGINT", async () => {
    await server.close();
    process.exit(0);
});
