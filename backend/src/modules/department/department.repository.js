import prisma from "../../database/index"

const getDepartments = async () => {
  const departments = prisma.department.findMany()

  return departments
}

export {
  getDepartments
}