import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/features/auth/AuthContext"
import EmptyState from "@/components/shared/EmptyState"
import ErrorState from "@/components/shared/ErrorState"
import LoadingState from "@/components/shared/LoadingState"
import { listDepartments, listEmployees, type EmployeeQuery, type EmployeeSortField } from "./employee.api"
import { exportEmployeesCsv } from "./employee.api"
import EmployeeDetailDialog from "./EmployeeDetailDialog"
import EmployeeFormDialog from "./EmployeeFormDialog"
import EmployeeTable from "./EmployeeTable"
import DeleteEmployeeDialog from "./DeleteEmployeeDialog"
import type { Department, Employee, EmployeeStatus } from "./employee.type"

const defaultQuery: EmployeeQuery = {
  sort_by: "id",
  sort_order: "asc",
}

const sortOptions: { value: EmployeeSortField; label: string }[] = [
  { value: "id", label: "ID" },
  { value: "nama", label: "Nama" },
  { value: "jabatan", label: "Jabatan" },
  { value: "status", label: "Status" },
  { value: "tanggal_masuk", label: "Tanggal masuk" },
]

const statusOptions: { value: EmployeeStatus; label: string }[] = [
  { value: "FULL_TIME", label: "FULL_TIME" },
  { value: "PART_TIME", label: "PART_TIME" },
  { value: "KELUAR", label: "KELUAR" },
]

const EmployeePage = () => {
  const { isAdmin } = useAuth()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [query, setQuery] = useState<EmployeeQuery>(defaultQuery)
  const [searchInput, setSearchInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [departmentError, setDepartmentError] = useState<string | null>(null)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null)
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const requestIdRef = useRef(0)

  const loadEmployees = useCallback(async () => {
    const requestId = ++requestIdRef.current

    try {
      setLoading(true)
      setError(null)

      const result = await listEmployees(query)
      if (requestId === requestIdRef.current) {
        setEmployees(result.data)
      }
    } catch (requestError) {
      if (requestId === requestIdRef.current) {
        setError(requestError instanceof Error ? requestError.message : "Failed to load employees")
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false)
      }
    }
  }, [query])

  useEffect(() => {
    void loadEmployees()
  }, [loadEmployees])

  useEffect(() => {
    let cancelled = false

    const loadDepartments = async () => {
      try {
        const result = await listDepartments()
        if (!cancelled) {
          setDepartments(result.data)
        }
      } catch (requestError) {
        if (!cancelled) {
          setDepartmentError(
            requestError instanceof Error ? requestError.message : "Failed to load departments",
          )
        }
      }
    }

    void loadDepartments()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const search = searchInput.trim()
      setQuery((currentQuery) => {
        if (currentQuery.search === search || (!currentQuery.search && !search)) {
          return currentQuery
        }

        return {
          ...currentQuery,
          search: search || undefined,
        }
      })
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [searchInput])

  const updateQuery = <K extends keyof EmployeeQuery>(key: K, value: EmployeeQuery[K]) => {
    setQuery((currentQuery) => ({ ...currentQuery, [key]: value }))
  }

  const resetFilters = () => {
    setSearchInput("")
    setQuery(defaultQuery)
  }

  const hasSearchOrFilter = Boolean(query.search || query.department_id || query.status)
  const selectedSortBy = query.sort_by ?? "id"
  const selectedSortOrder = query.sort_order ?? "asc"

  const openCreateDialog = () => {
    setEditingEmployee(null)
    setFormOpen(true)
  }

  const openEditDialog = (employee: Employee) => {
    setEditingEmployee(employee)
    setFormOpen(true)
  }

  const handleExport = async () => {
    setExporting(true)
    setExportError(null)
    try {
      await exportEmployeesCsv()
    } catch (requestError) {
      setExportError(requestError instanceof Error ? requestError.message : "Export failed")
    } finally {
      setExporting(false)
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Employees</h1>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={() => void handleExport()} disabled={exporting} className="w-full sm:w-auto">
            {exporting ? "Exporting..." : "Export CSV"}
          </Button>
          {isAdmin && (
            <Button type="button" onClick={openCreateDialog} className="w-full sm:w-auto">
              Add Employee
            </Button>
          )}
        </div>
      </div>

      {notice && <Alert><AlertDescription>{notice}</AlertDescription></Alert>}
      {exportError && <Alert variant="destructive"><AlertDescription>{exportError}</AlertDescription></Alert>}

      <div className="space-y-3 rounded-xl border bg-card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search for name, email, phone, or position"
            className="min-w-0 flex-1 sm:min-w-60"
          />

          <select
            value={query.department_id ? String(query.department_id) : ""}
            onChange={(event) => updateQuery("department_id", event.target.value ? Number(event.target.value) : undefined)}
            className="h-10 min-w-0 rounded-none border border-b-input bg-transparent px-2 text-sm outline-none focus-visible:border-b-ring sm:min-w-44"
          >
            <option value="">All Departments</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.nama}
              </option>
            ))}
          </select>

          <select
            value={query.status ?? ""}
            onChange={(event) => updateQuery("status", (event.target.value || undefined) as EmployeeStatus | undefined)}
            className="h-10 min-w-0 rounded-none border border-b-input bg-transparent px-2 text-sm outline-none focus-visible:border-b-ring sm:min-w-36"
          >
            <option value="">All Status</option>
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <label className="flex min-w-0 flex-1 items-center gap-2 text-sm sm:min-w-60">
            <span className="shrink-0 text-muted-foreground">Urutkan</span>
            <select
              value={selectedSortBy}
              onChange={(event) => updateQuery("sort_by", event.target.value as EmployeeSortField)}
              className="h-10 min-w-0 flex-1 rounded-none border border-b-input bg-transparent px-2 text-sm outline-none focus-visible:border-b-ring"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <select
            value={selectedSortOrder}
            onChange={(event) => updateQuery("sort_order", event.target.value as "asc" | "desc")}
            className="h-10 min-w-0 rounded-none border border-b-input bg-transparent px-2 text-sm outline-none focus-visible:border-b-ring sm:min-w-32"
          >
            <option value="asc">(A-Z)</option>
            <option value="desc">(Z-A)</option>
          </select>

          <Button type="button" variant="outline" onClick={resetFilters} className="w-full sm:w-auto">
            Reset Filter
          </Button>
        </div>

        {departmentError && <p className="text-sm text-destructive">Failed to load Departments: {departmentError}</p>}
      </div>

      {loading && <LoadingState />}

      {!loading && error && <ErrorState message={error} onRetry={() => void loadEmployees()} />}

      {!loading && !error && employees.length === 0 && (
        <EmptyState message={hasSearchOrFilter ? "No results found" : "No Employees yet"} />
      )}

      {!loading && !error && employees.length > 0 && (
        <EmployeeTable
          employees={employees}
          onView={(employee) => setSelectedEmployeeId(employee.id)}
          onEdit={openEditDialog}
          onDelete={isAdmin ? setDeletingEmployee : undefined}
          isAdmin={isAdmin}
        />
      )}

      <EmployeeDetailDialog
        employeeId={selectedEmployeeId}
        open={selectedEmployeeId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedEmployeeId(null)
        }}
      />

      {isAdmin && (
        <EmployeeFormDialog
          open={formOpen}
          employee={editingEmployee}
          departments={departments}
          onOpenChange={setFormOpen}
          onSaved={() => void loadEmployees()}
        />
      )}

      {isAdmin && (
        <DeleteEmployeeDialog
          open={deletingEmployee !== null}
          employee={deletingEmployee}
          onOpenChange={(open) => {
            if (!open) setDeletingEmployee(null)
          }}
          onDeleted={() => {
            setDeletingEmployee(null)
            setNotice("Employee deleted.")
            void loadEmployees()
          }}
        />
      )}
    </section>
  )
}

export default EmployeePage
