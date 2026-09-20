import { authStorage } from "./auth-storage"

const BASE_API_URL = import.meta.env.VITE_API_URL 

export class ApiError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message)
  }
}

export async function fetchAPI<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken()
  const headers = new Headers(init.headers)

  // s
  headers.set("Accept", "application/json")
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(`${BASE_API_URL}${path}`, { ...init, headers })
  const contentType = response.headers.get("content-type") ?? ""
  const payload = contentType.includes("application/json") ? await response.json() : await response.text()

  if (response.status == 401) {
    authStorage.clear()
    window.dispatchEvent(new Event("auth:expired"))
  }

  if (!response.ok) {
    const message = typeof payload === "object" && payload && "message" in payload
      ? String(payload.message) : `Request failed (${response.status})`
    throw new ApiError(response.status, message, payload)
  }

  return payload as T
}

export { BASE_API_URL }
