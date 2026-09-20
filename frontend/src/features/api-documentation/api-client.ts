import type { ApiEndpoint, ApiValues } from "./api-endpoint"

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:2000"

export type ApiRequestResult = {
  status: number
  ok: boolean
  headers: Record<string, string>
  contentType: string
  data: unknown
}

type SendApiRequestInput = {
  endpoint: ApiEndpoint
  token: string
  params?: ApiValues
  query?: ApiValues
  body?: unknown
}

const replaceParams = (path: string, params: ApiValues = {}) => {
  return path.replace(/:([a-zA-Z0-9_]+)/g, (_, key: string) => {
    const value = params[key]
    return encodeURIComponent(value === undefined || value === "" ? `:${key}` : String(value))
  })
}

const readResponseData = async (response: Response, contentType: string) => {
  const text = await response.text()
  if (!contentType.includes("application/json")) return text

  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

export async function sendApiRequest({
  endpoint,
  token,
  params,
  query,
  body,
}: SendApiRequestInput): Promise<ApiRequestResult> {
  const path = replaceParams(endpoint.path, params)
  const url = new URL(path, API_BASE_URL)

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      url.searchParams.set(key, String(value))
    }
  })

  const headers = new Headers({ Accept: "application/json, text/plain, text/csv" })
  if (token.trim()) headers.set("Authorization", `Bearer ${token.trim()}`)
  if (body !== undefined && endpoint.method !== "GET") headers.set("Content-Type", "application/json")

  const response = await fetch(url, {
    method: endpoint.method,
    headers,
    body: body !== undefined && endpoint.method !== "GET" ? JSON.stringify(body) : undefined,
  })
  const contentType = response.headers.get("content-type") ?? ""
  const data = await readResponseData(response, contentType)

  return {
    status: response.status,
    ok: response.ok,
    headers: Object.fromEntries(response.headers.entries()),
    contentType,
    data,
  }
}

export { API_BASE_URL }
