/**
 * Simple logger that always writes to stderr so that
 * stdout remains clean for JSON-RPC in STDIO mode.
 */
export const log = {
  info : (...args: any[]) => console.error('[INFO ]', ...args),
  debug: (...args: any[]) => process.env.DEBUG && console.error('[DEBUG]', ...args),
  warn : (...args: any[]) => console.error('[WARN ]', ...args),
  error: (...args: any[]) => console.error('[ERROR]', ...args),
}
