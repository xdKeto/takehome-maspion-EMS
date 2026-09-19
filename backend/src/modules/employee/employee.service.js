import { getProductByID } from "../../../../../learnExpress/src/product/product.service"
import { addEmployee, editEmployee, findEmployeeByID, findEmployeeEmail, getEmployees } from "./employee.repository"

const getEmployees = async () => {
  const employees = await getEmployees()

  return employees
}

const getEmployeeByID = async (id) => {
  const employee = await findEmployeeByID(id)

  if (!employee) {
    const err = "Employee not found"
    err.status = 400
    throw err
  }

  return employee
}

const createEmployee = async (data) => {
  const email = await findEmployeeEmail(data.email)
  if (email) {
    const err = "Email already exists"
    err.status = 400
    throw err
  }

  const employee = await addEmployee(data)

  return employee
}

const updateEmployee = async (id, data) => {
  await getProductByID(id)
  
  const employee = await editEmployee(id, data)

  return employee
}

export {
  getEmployees,
  getEmployeeByID,
  createEmployee,
  updateEmployee
}
