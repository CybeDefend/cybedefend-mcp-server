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

import { startScanTool } from "./tools/startScan.js";
import { getScanTool } from "./tools/getScan.js";
import { getProjectOverviewTool } from "./tools/getProjectOverview.js";
import { listVulnerabilitiesSastTool } from "./tools/listVulnerabilitiesSast.js";
import { listVulnerabilitiesIacTool } from "./tools/listVulnerabilitiesIac.js";
import { listVulnerabilitiesScaTool } from "./tools/listVulnerabilitiesSca.js";
import { listScaPackagesTool } from "./tools/listScaPackages.js";
import { getVulnerabilitySastTool } from "./tools/getVulnerabilitySast.js";
import { getVulnerabilityIacTool } from "./tools/getVulnerabilityIac.js";
import { getVulnerabilityScaTool } from "./tools/getVulnerabilitySca.js";

const CUSTOM_TOOLS = [
    startScanTool,
    getScanTool,
    getProjectOverviewTool,
    listVulnerabilitiesSastTool,
    listVulnerabilitiesIacTool,
    listVulnerabilitiesScaTool,
    listScaPackagesTool,
    getVulnerabilitySastTool,
    getVulnerabilityIacTool,
    getVulnerabilityScaTool,
];

/* ------------------------------------------------------------------ */
/* Helper : convertit n’importe quel résultat → payload MCP « text »   */
function toMcpText(result: unknown) {
    return [
        typeof result === "string"
            ? { type: "text", text: result }
            : { type: "text", text: JSON.stringify(result, null, 2) },
    ];
}

/* ------------------------------------------------------------------ */
/* 1. Création du serveur MCP                                          */
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
