import express from "express"
import { createEmployee, getEmployeeByID, getEmployees, updateEmployee } from "./employee.service"

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const employees = await getEmployees()
    
    res.status(200).send(employees)
  } catch (e) {
    res.status(500).send("Failed to fetch all employees")
  }
})

router.get("/:id", async (req, res) => {
  try {
    if (typeof req.params.id !== "number") {
      const err = "ID must be a number"
      err.status = 400
      throw err
    }

    const id = parseInt(req.params.id)
    const employee = await getEmployeeByID(id)
    
    res.status(200).send(employee)
  } catch (e) {
    res.status(e.status ?? 500).send(e.message ?? "Failed to fetch employee")
  }
})

router.post("/", async (req, res) => {
  const data = req.body
  try {
    if (!(data.nama && data.email && data.no_telp && data.jabatan && data.status && data.department_id)) {
      const err = "Required fields are missing!"
      err.status = 400
      throw err
    }

    const employee = await createEmployee(data)
    
    res.status(201).send({
      data: employee,
      message: "Employee added successfully"
    })
  } catch(e) {
    res.status(e.status ?? 500).send(e.message ?? "Failed to add employee")
  }
})

router.put("/:id", async (req, res) => {
  const data = req.body
  
  try {
    if (!(data.nama && data.email && data.no_telp && data.jabatan && data.status && data.department_id)) {
      const err = "Required fields are missing!"
      err.status = 400
      throw err
    }

    if (typeof req.params.id !== "number") {
      const err = "ID must be a number"
      err.status = 400
      throw err
    }

    const id = parseInt(req.params.id)
    const employee = await updateEmployee(id, data)

    res.status(200).send({
      data: employee,
      message: "Employee updated successfully"
    })
  } catch (e) {
    res.status(e.status ?? 500).send(e.message ?? "Failed to update employee")
  }
})

export {
  router as employeeRouter
}