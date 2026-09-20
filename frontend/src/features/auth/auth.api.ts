import { apiFetch } from "@/lib/api-client"
import type { AuthUser, LoginResult } from "./auth.type"

type LoginResponse = {
  success: boolean
  data: LoginResult
}

const loginUser = async (username: string, password: string): Promise<LoginResult> => {
  const response = await apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  })

  return response.data
}

export { loginUser }

export type { AuthUser }


