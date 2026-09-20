import type { EmployeeStatus } from "./employee.type"

export type EmployeeFormValues = {
  nama: string
  email: string
  no_telp: string
  jabatan: string
  status: EmployeeStatus
  department_id: number
  image: string
}

export type EmployeeFormErrors = Partial<Record<keyof EmployeeFormValues, string>>

export function validateEmployee(values: EmployeeFormValues): EmployeeFormErrors {
  const errors: EmployeeFormErrors = {}

  if (!values.nama.trim()) errors.nama = "Name is required"
  if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) errors.email = "Email is not valid"
  if (!/^\+?[0-9][0-9\s-]{7,20}$/.test(values.no_telp.trim())) {
    errors.no_telp = "Phone number is not valid"
  }
  if (!values.jabatan.trim()) errors.jabatan = "Jabatan is required"
  if (!values.department_id) errors.department_id = "Department is required"

  return errors
}
