export function ok(id: number, result: unknown) {
  return { jsonrpc: '2.0', id, result }
}

export function err(id: number | null, code: number, message: string) {
  return { jsonrpc: '2.0', id, error: { code, message } }
}
