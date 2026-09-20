import { ApiError, apiFetch, BASE_API_URL } from "@/lib/api-client"
import { authStorage } from "@/lib/auth-storage"
import type { Department, Employee, EmployeeStatus } from "./employee.type"
import type { EmployeeFormValues } from "./employee-validation"

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

const getEmployee = async (id: number) => {
  return apiFetch<{ success: boolean; data: Employee }>(`/api/employees/${id}`)
}

const createEmployee = async (body: EmployeeFormValues) => {
  return apiFetch<{ success: boolean; data: Employee }>("/api/employees", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

const updateEmployee = async (id: number, body: EmployeeFormValues) => {
  return apiFetch<{ success: boolean; data: Employee }>(`/api/employees/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  })
}

const deleteEmployee = async (id: number) => {
  return apiFetch<{ success: boolean; message: string }>(`/api/employees/${id}`, {
    method: "DELETE",
  })
}

const exportEmployeesCsv = async () => {
  const token = authStorage.getToken()
  const headers = new Headers({ Accept: "text/csv" })
  if (token) headers.set("Authorization", `Bearer ${token}`)

  const response = await fetch(`${BASE_API_URL}/api/employees/export-csv`, { headers })
  const payload = await response.text()

  if (response.status === 401) {
    authStorage.clear()
    window.dispatchEvent(new Event("auth:expired"))
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const errorPayload: unknown = JSON.parse(payload)
      if (typeof errorPayload === "object" && errorPayload !== null && "message" in errorPayload) {
        message = String(errorPayload.message)
      }
    } catch {
      if (payload) message = payload
    }
    throw new ApiError(response.status, message, payload)
  }

  const filenameHeader = response.headers.get("content-disposition")
  const filenameMatch = filenameHeader?.match(/filename="?([^";]+)"?/i)
  const filename = filenameMatch?.[1] ?? "employees.csv"
  const url = URL.createObjectURL(new Blob([payload], { type: "text/csv;charset=utf-8" }))
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export {
  createEmployee,
  deleteEmployee,
  exportEmployeesCsv,
  getEmployee,
  listEmployees,
  listDepartments,
  updateEmployee,
}
