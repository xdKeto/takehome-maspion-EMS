import { useEffect, useState, type SubmitEvent } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { avatarMap } from "@/lib/avatar-map"
import { createEmployee, updateEmployee } from "./employee.api"
import type { Department, Employee, EmployeeStatus } from "./employee.type"
import {
  validateEmployee,
  type EmployeeFormErrors,
  type EmployeeFormValues,
} from "./employee-validation"

type EmployeeFormDialogProps = {
  open: boolean
  employee: Employee | null
  departments: Department[]
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

const statusOptions: { value: EmployeeStatus; label: string }[] = [
  { value: "FULL_TIME", label: "Full time" },
  { value: "PART_TIME", label: "Part time" },
  { value: "KELUAR", label: "Keluar" },
]

const defaultValues: EmployeeFormValues = {
  nama: "",
  email: "",
  no_telp: "",
  jabatan: "",
  status: "FULL_TIME",
  department_id: 0,
  image: "boy/AV1.png",
}

const getFormValues = (employee: Employee | null): EmployeeFormValues => employee
  ? {
    nama: employee.nama,
    email: employee.email,
    no_telp: employee.no_telp,
    jabatan: employee.jabatan,
    status: employee.status,
    department_id: employee.department_id,
    image: employee.image ?? defaultValues.image,
  }
  : defaultValues

const FieldError = ({ message }: { message?: string }) => (
  message ? <p className="text-xs text-destructive">{message}</p> : null
)

const EmployeeFormDialog = ({
  open,
  employee,
  departments,
  onOpenChange,
  onSaved,
}: EmployeeFormDialogProps) => {
  const [values, setValues] = useState<EmployeeFormValues>(defaultValues)
  const [errors, setErrors] = useState<EmployeeFormErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const isEditMode = employee !== null

  useEffect(() => {
    if (!open) return
    setValues(getFormValues(employee))
    setErrors({})
    setFormError(null)
  }, [employee, open])

  const updateField = <K extends keyof EmployeeFormValues>(key: K, value: EmployeeFormValues[K]) => {
    setValues((currentValues) => ({ ...currentValues, [key]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [key]: undefined }))
    setFormError(null)
  }

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validateEmployee(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    setFormError(null)
    try {
      if (employee) await updateEmployee(employee.id, values)
      else await createEmployee(values)
      onOpenChange(false)
      onSaved()
    } catch (requestError) {
      setFormError(requestError instanceof Error ? requestError.message : "Request gagal")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Employee" : "Add Employee"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update emoloyee data." : "Add a new employee to the system."}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {formError && <Alert variant="destructive"><AlertDescription>{formError}</AlertDescription></Alert>}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="employee-name">Nama</Label>
              <Input id="employee-name" value={values.nama} onChange={(event) => updateField("nama", event.target.value)} aria-invalid={Boolean(errors.nama)} disabled={submitting} />
              <FieldError message={errors.nama} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employee-email">Email</Label>
              <Input id="employee-email" type="email" value={values.email} onChange={(event) => updateField("email", event.target.value)} aria-invalid={Boolean(errors.email)} disabled={submitting} />
              <FieldError message={errors.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employee-phone">No. Telepon</Label>
              <Input id="employee-phone" value={values.no_telp} onChange={(event) => updateField("no_telp", event.target.value)} aria-invalid={Boolean(errors.no_telp)} disabled={submitting} />
              <FieldError message={errors.no_telp} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employee-position">Jabatan</Label>
              <Input id="employee-position" value={values.jabatan} onChange={(event) => updateField("jabatan", event.target.value)} aria-invalid={Boolean(errors.jabatan)} disabled={submitting} />
              <FieldError message={errors.jabatan} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employee-status">Status</Label>
              <select id="employee-status" value={values.status} onChange={(event) => updateField("status", event.target.value as EmployeeStatus)} disabled={submitting} className="h-10 w-full border border-transparent border-b-input bg-transparent px-0 text-sm outline-none focus-visible:border-b-ring">
                {statusOptions.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="employee-department">Department</Label>
              <select id="employee-department" value={values.department_id ? String(values.department_id) : ""} onChange={(event) => updateField("department_id", Number(event.target.value))} disabled={submitting} aria-invalid={Boolean(errors.department_id)} className="h-10 w-full border border-transparent border-b-input bg-transparent px-0 text-sm outline-none focus-visible:border-b-ring">
                <option value="">Pilih department</option>
                {departments.map((department) => <option key={department.id} value={department.id}>{department.nama}</option>)}
              </select>
              <FieldError message={errors.department_id} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="employee-avatar">Avatar</Label>
              <select id="employee-avatar" value={values.image} onChange={(event) => updateField("image", event.target.value)} disabled={submitting} className="h-10 w-full border border-transparent border-b-input bg-transparent px-0 text-sm outline-none focus-visible:border-b-ring">
                {Object.keys(avatarMap).map((avatarKey) => <option key={avatarKey} value={avatarKey}>{avatarKey}</option>)}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Batal</Button>
            <Button type="submit" disabled={submitting}>{submitting ? "Saving.." : isEditMode ? "Save" : "Add"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EmployeeFormDialog
