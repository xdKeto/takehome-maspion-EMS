import prisma from "../../database/index"

const getEmployees = async ({
  where = {},
  orderBy = { id: "asc" }
}) => {
  const employees = await prisma.employee.findMany({
    where, orderBy,
    include: {
      department: {
        select: {
          id: true,
          nama: true
        }
      }
    }
  })

  return employees
}

const findEmployeeByID = async (id) => {
  const employee = await prisma.employee.findUnique({
    where: {
      id: id
    }
  })

  return employee
}

const findEmployeeByKey = async (where) => {
  const employee = await prisma.employee.findFirst({
    where
  })

  return employee
}

const addEmployee = async (data) => {
  const employee = prisma.employee.create({
    data: {
      nama: data.nama,
      email: data.email,
      no_telp: data.no_telp,
      jabatan: data.jabatan,
      status: data.status,
      tanggal_masuk: new Date(),
      image: data.image ?? null,
      department_id: data.department_id
    }
  })

  return employee
}

const editEmployee = async (id, data) => {
  const employee = await prisma.employee.update({
    where: {
      id: id
    },
    data: {
      nama: data.nama,
      email: data.email,
      no_telp: data.no_telp,
      jabatan: data.jabatan,
      status: data.status,
      image: data.image ?? null,
      department_id: data.department_id
    }
  })

  return employee
}

export {
  getEmployees,
  findEmployeeByID,
  findEmployeeByKey,
  addEmployee,
  editEmployee,
}
