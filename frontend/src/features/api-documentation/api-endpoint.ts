export type ApiMethod = "GET" | "POST" | "PUT" | "DELETE"
export type ApiValues = Record<string, string | number>

export type ApiEndpoint = {
  id: string
  label: string
  method: ApiMethod
  path: string
  auth?: boolean
  roles?: Array<"admin" | "viewer">
  params?: ApiValues
  query?: ApiValues
  body?: Record<string, unknown>
}

export const API_ENDPOINTS: ApiEndpoint[] = [
  {
    id: "login",
    label: "Login",
    method: "POST",
    path: "/api/auth/login",
    body: { username: "", password: "" },
  },
  {
    id: "register",
    label: "Register user",
    method: "POST",
    path: "/api/auth/register",
    auth: true,
    roles: ["admin"],
    body: { username: "", password: "", role: "VIEWER" },
  },
  {
    id: "employees-list",
    label: "List employees",
    method: "GET",
    path: "/api/employees",
    auth: true,
    query: { search: "", status: "", department_id: "", sort_by: "id", sort_order: "asc" },
  },
  {
    id: "employee-detail",
    label: "Employee detail",
    method: "GET",
    path: "/api/employees/:id",
    auth: true,
    params: { id: "1" },
  },
  {
    id: "employees-csv",
    label: "Export employees CSV",
    method: "GET",
    path: "/api/employees/export-csv",
    auth: true,
  },
  {
    id: "employee-create",
    label: "Create employee",
    method: "POST",
    path: "/api/employees",
    auth: true,
    roles: ["admin"],
    body: {
      nama: "",
      email: "",
      no_telp: "",
      jabatan: "",
      status: "PART_TIME",
      department_id: 1,
    },
  },
  {
    id: "employee-update",
    label: "Update employee",
    method: "PUT",
    path: "/api/employees/:id",
    auth: true,
    roles: ["admin"],
    params: { id: "1" },
    body: {
      nama: "",
      email: "",
      no_telp: "",
      jabatan: "",
      status: "PART_TIME",
      department_id: 1,
    },
  },
  {
    id: "employee-delete",
    label: "Delete employee",
    method: "DELETE",
    path: "/api/employees/:id",
    auth: true,
    roles: ["admin"],
    params: { id: "1" },
  },
  {
    id: "departments",
    label: "List departments",
    method: "GET",
    path: "/api/departments",
    auth: true,
  },
  {
    id: "audit",
    label: "Audit logs",
    method: "GET",
    path: "/api/audit",
    auth: true,
    roles: ["admin"],
  },
  {
    id: "health",
    label: "Health check",
    method: "GET",
    path: "/health",
  },
]
