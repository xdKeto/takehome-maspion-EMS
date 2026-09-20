import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "@/features/auth/AuthContext"

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  )
}

export default AppProviders
