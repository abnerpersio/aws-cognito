export function bodyParser<TBody = Record<string, unknown>>(
  body: string | undefined
): TBody {
  try {
    return JSON.parse(body!) as TBody;
  } catch {
    return {} as TBody;
  }
}
