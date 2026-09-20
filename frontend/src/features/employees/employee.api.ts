import { apiFetch } from "@/lib/api-client"
import type { Department, Employee, EmployeeStatus } from "./employee.type"

export type EmployeeSortField = "id" | "nama" | "jabatan" | "status" | "tanggal_masuk"

export type EmployeeQuery = {
  search?: string
  status?: EmployeeStatus
  department_id?: number
  sort_by?: EmployeeSortField
  sort_order?: "asc" | "desc"
}

const listEmployees = async (query: EmployeeQuery = {}) => {
  const params = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value))
    }
  })

  const queryString = params.toString()
  const path = queryString ? `/api/employees?${queryString}` : "/api/employees"

  return apiFetch<{ success: boolean; data: Employee[] }>(path)
}

const listDepartments = async () => {
  return apiFetch<{ success: boolean; data: Department[] }>("/api/departments")
}

export { listEmployees, listDepartments }

