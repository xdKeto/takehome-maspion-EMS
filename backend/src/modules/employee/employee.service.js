import { ErrorHandler } from "../../middlewares/error-handler.middleware"
import { addEmployee, editEmployee, findEmployeeByID, findEmployeeByKey, getEmployees as getEmployeesRepo } from "./employee.repository"

const getEmployees = async (params) => {
  const employees = await getEmployeesRepo(params)

  return employees
}

const getEmployeeByID = async (id) => {

  const employee = await findEmployeeByID(id)

  if (!employee) {
    throw new ErrorHandler("Employee not found", 404)
  }

  return employee
}

const createEmployee = async (data) => {
  const check = await findEmployeeByKey({
    OR: [
      { email: data.email },
      { no_telp: data.no_telp }
    ]
  })

  if (check) {
    throw new ErrorHandler("Employee already exists (same email/phone)", 409)
  }

  const employee = await addEmployee(data)

  return employee
}

const updateEmployee = async (id, data) => {
  await getEmployeeByID(id)

  const employee = await editEmployee(id, data)

  return employee
}

export {
  getEmployees,
  getEmployeeByID,
  createEmployee,
  updateEmployee
}
