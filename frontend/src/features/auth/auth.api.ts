import { apiFetch } from "@/lib/api-client"
import type { AuthUser, LoginResult } from "./auth.type"

type LoginResponse = {
  success: boolean
  data: LoginResult
}

export type RegisterRole = "ADMIN" | "VIEWER"

type RegisterResponse = {
  success: boolean
  data: AuthUser
}

const loginUser = async (username: string, password: string): Promise<LoginResult> => {
  const response = await apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  })

  return response.data
}

const registerUser = async (username: string, password: string, role: RegisterRole) => {
  const response = await apiFetch<RegisterResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password, role }),
  })

  return response.data
}

export { loginUser, registerUser }

export type { AuthUser }

