import { useCallback, useEffect, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import ErrorState from "@/components/shared/ErrorState"
import LoadingState from "@/components/shared/LoadingState"
import { resolveAvatar } from "@/lib/avatar-map"
import { getEmployee } from "./employee.api"
import type { Employee } from "./employee.type"

type EmployeeDetailDialogProps = {
  employeeId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const EmployeeDetailDialog = ({
  employeeId,
  open,
  onOpenChange,
}: EmployeeDetailDialogProps) => {
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestIdRef = useRef(0)

  const loadEmployee = useCallback(async () => {
    if (employeeId === null) return

    const requestId = ++requestIdRef.current
    setLoading(true)
    setError(null)
    setEmployee(null)

    try {
      const result = await getEmployee(employeeId)
      if (requestId === requestIdRef.current) setEmployee(result.data)
    } catch (requestError) {
      if (requestId === requestIdRef.current) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Failed to load employee",
        )
      }
    } finally {
      if (requestId === requestIdRef.current) setLoading(false)
    }
  }, [employeeId])

  useEffect(() => {
    if (!open || employeeId === null) return

    void loadEmployee()

    return () => {
      requestIdRef.current += 1
    }
  }, [employeeId, loadEmployee, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detail Employee</DialogTitle>
          <DialogDescription>Detaild about the employee.</DialogDescription>
        </DialogHeader>

        {loading && <LoadingState />}

        {!loading && error && <ErrorState message={error} onRetry={() => void loadEmployee()} />}

        {!loading && !error && employee && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                <AvatarImage src={resolveAvatar(employee.image)} alt={employee.nama} />
                <AvatarFallback>{employee.nama.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div>
                <h2 className="font-semibold">{employee.nama}</h2>
                <p className="text-sm text-muted-foreground">{employee.email}</p>
                <Badge variant="outline" className="mt-2">
                  {employee.status}
                </Badge>
              </div>
            </div>

            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">No. Telepon</dt>
                <dd>{employee.no_telp}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Jabatan</dt>
                <dd>{employee.jabatan}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Department</dt>
                <dd>{employee.department?.nama ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Tanggal Masuk</dt>
                <dd>{new Date(employee.tanggal_masuk).toLocaleDateString("id-ID")}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Employee ID</dt>
                <dd>{employee.id}</dd>
              </div>
            </dl>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default EmployeeDetailDialog
