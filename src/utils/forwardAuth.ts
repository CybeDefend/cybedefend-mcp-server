export function forwardAuth(headers: Record<string, string | undefined>) {
  const forwarded: Record<string,string> = {}
  if (headers['authorization']) {
    forwarded['authorization'] = headers['authorization']
  }
  if (headers['x-api-key']) {
    forwarded['x-api-key'] = headers['x-api-key']
  }
  return forwarded
}