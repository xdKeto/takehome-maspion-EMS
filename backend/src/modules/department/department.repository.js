import prisma from "../../database/index.js"

const getDepartments = async () => {
  const departments = prisma.department.findMany()

  return departments
}

export {
  getDepartments
}