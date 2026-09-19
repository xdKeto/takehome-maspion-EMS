import prisma from "../../db/index.js"

const getEmployees = async () => {
  const employees = prisma.employee.findMany()

  return employees
}

const findEmployeeByID = async (id) => {
  const employee = prisma.employee.findUnique({
    where: {
      id: id
    }
  })

  return employee
}

const findEmployeeEmail = async (email) => {
  const email = prisma.employee.findFirst({
    where: {
      email: email
    }
  })

  return email
}

const addEmployee = async (data) => {
  const employee = prisma.employee.create({
    data: {
      nama: data.nama,
      email: data.email,
      no_telp: data.no_telp,
      jabatan: data.jabatan,
      status: data.status,
      tanggal_masuk: DateTime.now(),
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
  findEmployeeEmail,
  addEmployee,
  editEmployee
}
