// src/utils/projectId.ts
// Resolves projectId from a provided value or the CYBEDEFEND_PROJECT_ID environment variable.

export function resolveProjectId(input?: string): string {
    const fromInput = (input || "").trim()
    if (fromInput) return fromInput

    const fromEnv = (process.env.CYBEDEFEND_PROJECT_ID || "").trim()
    if (fromEnv) return fromEnv

    throw new Error(
        'Missing projectId: provide it in the tool input or set CYBEDEFEND_PROJECT_ID in the environment.'
    )
}
