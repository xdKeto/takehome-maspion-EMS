import type { AuthUser } from "@/features/auth/auth.type";

const TOKEN_KEY = "token_access_key"
const USER_KEY = "user_access_key"

export const authStorage = {
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY)
  },
  getUser: (): AuthUser | null => {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null

    try {
      return JSON.parse(raw) as AuthUser
    } catch {
      return null
    }
  },
  setSession: (token: string, user: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }
}
