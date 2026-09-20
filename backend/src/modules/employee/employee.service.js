import { ErrorHandler } from "../../middlewares/error-handler.middleware"
import { addEmployee, editEmployee, findEmployeeByID, findEmployeeByKey, getEmployees as getEmployeesRepo, deleteEmployee as deleteEmployeeRepo } from "./employee.repository"
import auditLog from "../../middlewares/audit.middleware"

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

const createEmployee = async (data, req) => {
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

  await auditLog({
    req, target: "employee", target_id: employee.id, action: "CREATE", changes: { after: employee }
  })

  return employee
}

const updateEmployee = async (id, data, req) => {
  const before = await getEmployeeByID(id)
  const after = await editEmployee(id, data)

  await auditLog({
    req,
    target: "employee",
    target_id: id,
    action: "UPDATE",
    changes: { before, after }
  })

  return after
}

const deleteEmployee = async (id, req) => {
  const before = await getEmployeeByID(id)
  await deleteEmployeeRepo(id)

  await auditLog({
    req,
    target: "employee",
    target_id: id,
    action: "DELETE",
    changes: { before }
  })

  return
}

export {
  getEmployees,
  getEmployeeByID,
  createEmployee,
  updateEmployee,
  deleteEmployee
}
