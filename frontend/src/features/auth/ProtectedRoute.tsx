import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./AuthContext"

export function ProtectedRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div className="grid min-h-svh place-items-center text-sm text-muted-foreground">Loading..</div>
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />
}
