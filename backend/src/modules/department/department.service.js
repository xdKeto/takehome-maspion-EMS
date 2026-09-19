import { getDepartments } from "./department.repository"

const getAllDepartments = async () => {
  const departments = await getDepartments()

  return departments
}

export {
  getAllDepartments
}