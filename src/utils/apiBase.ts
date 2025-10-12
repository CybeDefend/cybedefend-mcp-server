// src/utils/apiBase.ts
// Resolves the CybeDefend API base URL using either API_BASE (highest precedence)
// or REGION ("us" | "eu"). Defaults to US if neither is provided or REGION is invalid.

export function getApiBase(): string {
    const envBase = process.env.API_BASE?.trim()
    if (envBase) return envBase

    const region = (process.env.REGION || "").toLowerCase().trim()
    switch (region) {
        case "eu":
            return "https://api-eu.cybedefend.com"
        case "us":
        case "":
            return "https://api-us.cybedefend.com"
        default:
            // Fallback to US for unknown regions
            return "https://api-us.cybedefend.com"
    }
}

export const API_BASE = getApiBase()
