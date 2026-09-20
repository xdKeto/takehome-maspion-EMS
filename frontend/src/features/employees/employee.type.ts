export type EmployeeStatus = "FULL_TIME" | "PART_TIME" | "KELUAR"

export type Department = {
  id: number
  nama: string
}

export type Employee = {
  id: number
  nama: string
  email: string
  no_telp: string
  jabatan: string
  status: EmployeeStatus
  tanggal_masuk: string
  image: string | null
  department_id: number
  department?: Department
}
