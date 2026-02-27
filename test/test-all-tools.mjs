// test/test-all-tools.mjs
// Quick smoke test — verifies every tool dispatches correctly (expects 401 without auth)
import { spawn } from "child_process";

const PID = "3f019e65-b161-4af8-9f45-23bed62798d5";

const tools = [
    ["get_project_overview", { projectId: PID }],
    ["get_branches", { projectId: PID }],
    ["list_vulnerabilities_sast", { projectId: PID }],
    ["list_vulnerabilities_sca", { projectId: PID }],
    ["list_vulnerabilities_iac", { projectId: PID }],
    ["list_vulnerabilities_cicd", { projectId: PID }],
    ["list_vulnerabilities_secret", { projectId: PID }],
    ["list_vulnerabilities_container", { projectId: PID }],
    ["list_sca_packages", { projectId: PID }],
    ["list_container_images", { projectId: PID }],
    ["get_vulnerability_sast", { projectId: PID, vulnerabilityId: "00000000-0000-0000-0000-000000000000" }],
    ["get_vulnerability_sca", { projectId: PID, vulnerabilityId: "00000000-0000-0000-0000-000000000000" }],
    ["get_vulnerability_iac", { projectId: PID, vulnerabilityId: "00000000-0000-0000-0000-000000000000" }],
    ["get_vulnerability_cicd", { projectId: PID, vulnerabilityId: "00000000-0000-0000-0000-000000000000" }],
    ["get_vulnerability_secret", { projectId: PID, vulnerabilityId: "00000000-0000-0000-0000-000000000000" }],
    ["get_vulnerability_container", { projectId: PID, vulnerabilityId: "00000000-0000-0000-0000-000000000000" }],
    ["get_similar_vulnerabilities", { projectId: PID, vulnerabilityId: "00000000-0000-0000-0000-000000000000" }],
    ["update_vulnerability", { projectId: PID, vulnerabilityId: "00000000-0000-0000-0000-000000000000", status: "confirmed" }],
    ["start_scan", { projectId: PID, branch: "main" }],
    ["start_container_scan", { projectId: PID, imageToScan: "nginx:latest" }],
    ["start_sca_autofix", { projectId: PID, vulnerabilityIds: ["00000000-0000-0000-0000-000000000000"] }],
    ["get_sca_autofix_status", { projectId: PID, jobId: "test-job" }],
    ["get_sca_autofix_results", { projectId: PID, jobId: "test-job" }],
    ["get_owasp_report", { projectId: PID }],
    ["get_cwe_report", { projectId: PID }],
    ["get_sbom", { projectId: PID }],
];

async function testTool(name, args) {
    return new Promise((resolve) => {
        const proc = spawn("node", ["dist/index.js"], {
            env: { ...process.env, API_BASE: "http://localhost:3000" },
            cwd: process.cwd(),
        });
        let out = "";
        proc.stdout.on("data", (d) => (out += d.toString()));

        const msgs = [
            JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "test", version: "1.0" } } }),
            JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }),
            JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/call", params: { name, arguments: args } }),
        ];
        proc.stdin.write(msgs.join("\n") + "\n");

        setTimeout(() => {
            proc.kill();
            const lines = out.trim().split("\n");
            const last = lines[lines.length - 1];
            // Expect -32603 (InternalError wrapping 401) since no auth token is provided
            const ok = last.includes("-32603");
            console.log(`${ok ? "✓" : "✗"} ${name}`);
            if (!ok) console.log(`  Response: ${last.slice(0, 120)}`);
            resolve(ok);
        }, 1500);
    });
}

console.log(`Testing ${tools.length} tools against localhost:3000 (expect 401 without auth)...\n`);

// Run all tests in parallel for speed
const results = await Promise.all(tools.map(([name, args]) => testTool(name, args)));
const passed = results.filter(Boolean).length;
const failed = results.length - passed;

console.log(`\n${passed}/${tools.length} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
