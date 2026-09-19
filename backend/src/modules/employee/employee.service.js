import { addEmployee, editEmployee, findEmployeeByID, findEmployeeEmail, getEmployees as getEmployeesRepo } from "./employee.repository"

const getEmployees = async (params) => {
  const employees = await getEmployeesRepo(params)

  return employees
}

const getEmployeeByID = async (id) => {
  const employee = await findEmployeeByID(id)

  if (!employee) {
    const err = "Employee not found"
    err.status = 404
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
