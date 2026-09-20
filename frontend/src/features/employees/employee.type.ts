export type Employee = {
  id: number
  nama: string
  email: string
  no_telp: string
  jabatan: string
  status: "FULL_TIME" | "PART_TIME" | "KELUAR"
  tanggal_masuk: string
  image: string | null
  department_id: number
  department?: { id: number; nama: string }
}