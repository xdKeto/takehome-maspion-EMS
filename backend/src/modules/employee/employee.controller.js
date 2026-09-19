import express from "express"
import { createEmployee, getEmployeeByID, getEmployees, updateEmployee } from "./employee.service"

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const {
      search = "",
      status,
      department_id,
      sort_by = "id",
      sort_order = "asc"
    } = req.query

    // sort
    const sorting_fields = ["id", "nama", "jabatan", "status", "tanggal_masuk"]
    const res_sortBy = sorting_fields.includes(sort_by) ? sort_by : "id" //default sort ke id
    const res_sortOrder = sort_order === "desc" ? "desc" : "asc"
    const status_enum = ["FULL_TIME", "PART_TIME", "KELUAR"]

    // search
    const search_fields = ["nama", "email", "no_telp", "jabatan", "department"]
    const where = {}

    if (status) {
      if (!status_enum.includes(status)) {
        return res.status(400).send("Invalid employee status")
      }

      where.status = status
    }

    if (department_id) {
      const id = parseInt(department_id, 10)

      if (isNan(id) || id <= 0) {
        return res.status(400).send("department_id must be a positive integer")
      }

      where.department_id = id
    }

    if (search) {
      where.OR = search_fields.map((s) => ({
        [s]: { contains: search, mode: "insensitive" }
      }))
    }

    const employees = await getEmployees({
      where,
      order_by: {
        [res_sortBy]: res_sortOrder
      }
    })

    res.status(200).send(employees)
  } catch (e) {
    res.status(500).send("Failed to fetch all employees")
  }
})

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (isNan(id) || id <= 0) {
      const err = "ID must be a positive number"
      err.status = 400
      throw err
    }

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
  } catch (e) {
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

    const id = parseInt(req.params.id)
    if (isNan(id) || id <= 0) {
      const err = "ID must be a positive number"
      err.status = 400
      throw err
    }

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
