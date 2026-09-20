import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { loginUser } from "./auth.api"
import type { AuthUser } from "./auth.type"
import { authStorage } from "@/lib/auth-storage"

type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  isAdmin: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => authStorage.getUser())
  const [token, setToken] = useState<string | null>(() => authStorage.getToken())
  const [isLoading] = useState(false)

  useEffect(() => {
    const handleExpired = () => {
      setUser(null)
      setToken(null)
    }

    window.addEventListener("auth:expired", handleExpired)
    return () => window.removeEventListener("auth:expired", handleExpired)
  }, [])

  const login = async (username: string, password: string) => {
    const result = await loginUser(username, password)
    authStorage.setSession(result.token, result.user)
    setToken(result.token)
    setUser(result.user)
  }

  const logout = () => {
    authStorage.clear()
    setToken(null)
    setUser(null)
  }

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    isLoading,
    isAdmin: user?.role === "admin",
    login,
    logout,
  }), [isLoading, token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("AuthProvider is required")
  return context
}

export { AuthProvider, useAuth }

