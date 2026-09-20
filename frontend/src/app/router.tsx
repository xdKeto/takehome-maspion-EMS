import { Navigate, Route, Routes } from "react-router-dom"
import AppLayout from "@/components/layout/AppLayout"
import ApiDocumentationPage from "@/features/api-documentation/ApiDocumentationPage"
import EmployeePage from "@/features/employees/EmployeePage"
import { LoginPage } from "@/features/auth/LoginPage"
import { ProtectedRoute } from "@/features/auth/ProtectedRoute"

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/employees" replace />} />
          <Route path="/employees" element={<EmployeePage />} />
          <Route path="/api-documentation" element={<ApiDocumentationPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/employees" replace />} />
    </Routes>
  )
}

export default AppRoutes
