import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { resolveAvatar } from "@/lib/avatar-map"
import type { Employee } from "./employee.type"

type EmployeeTableProps = {
  employees: Employee[]
}

const EmployeeTable = ({ employees }: EmployeeTableProps) => {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>No. Telepon</TableHead>
            <TableHead>Jabatan</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tanggal Masuk</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={resolveAvatar(employee.image)} alt={employee.nama} />
                    <AvatarFallback>{employee.nama.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{employee.nama}</p>
                    <p className="text-sm text-muted-foreground">{employee.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{employee.no_telp}</TableCell>
              <TableCell>{employee.jabatan}</TableCell>
              <TableCell>{employee.department?.nama ?? "-"}</TableCell>
              <TableCell>
                <Badge variant="outline">{employee.status}</Badge>
              </TableCell>
              <TableCell>
                {new Date(employee.tanggal_masuk).toLocaleDateString("id-ID")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default EmployeeTable
