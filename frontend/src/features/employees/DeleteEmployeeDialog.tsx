import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog"
import type { Employee } from "./employee.type"
import { deleteEmployee } from "./employee.api"

type DeleteEmployeeDialogProps = {
  open: boolean
  employee: Employee | null
  onOpenChange: (open: boolean) => void
  onDeleted: () => void
}

const DeleteEmployeeDialog = ({
  open,
  employee,
  onOpenChange,
  onDeleted,
}: DeleteEmployeeDialogProps) => {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) return
    setDeleting(false)
    setError(null)
  }, [open])

  const handleDelete = async () => {
    if (!employee) return

    setDeleting(true)
    setError(null)
    try {
      await deleteEmployee(employee.id)
      onOpenChange(false)
      onDeleted()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Delete failed")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(nextOpen) => !deleting && onOpenChange(nextOpen)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete employee?</AlertDialogTitle>
          <AlertDialogDescription>
            Employee <strong>{employee?.nama}</strong> will be deleted permanently. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
          <AlertDialogAction
            type="button"
            variant="destructive"
            disabled={deleting || !employee}
            onClick={() => void handleDelete()}
          >
            {deleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteEmployeeDialog
