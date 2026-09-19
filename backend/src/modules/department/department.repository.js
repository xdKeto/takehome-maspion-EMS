import prisma from "../../prisma/client"

const getDepartments = async () => {
  const departments = prisma.department.findMany()

  return departments
}

export {
  getDepartments
}