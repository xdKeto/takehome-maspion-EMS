import { getDepartments } from "./department.repository.js"

const getAllDepartments = async () => {
  const departments = await getDepartments()

  return departments
}

export {
  getAllDepartments
}