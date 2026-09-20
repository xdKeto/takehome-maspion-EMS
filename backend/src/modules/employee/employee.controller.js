import express from "express"
import { createEmployee, deleteEmployee, getEmployeeByID, getEmployees, updateEmployee } from "./employee.service.js"
import { ErrorHandler } from "../../middlewares/error-handler.middleware.js"
import { checkToken, checkRole } from "../../middlewares/auth.middleware.js"
import { convertToCSV } from "../../utils/csv-converter.js"

const router = express.Router()

router.get("/", checkToken, async (req, res, next) => {
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

    // search
    const search_fields = ["nama", "email", "no_telp", "jabatan"]
    const where = {}

    if (status) {
      if (!status_enum.includes(status)) {
        throw new ErrorHandler("Invalid employee status", 400)
      }

      where.status = status
    }

    if (department_id) {
      const id = Number(department_id)
      if (!Number.isInteger(id) || id <= 0) {
        throw new ErrorHandler("department_id must be a positive integer", 400)
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
      orderBy: {
        [res_sortBy]: res_sortOrder
      }
    })

    res.status(200).json({
      success: true, data: employees
    })
  } catch (e) {
    next(e)
  }
})

router.get("/export-csv", checkToken, async (req, res, next) => {
  try {
    const employees = await getEmployees()
    const csv = convertToCSV(employees)
    const filename = `employees-export-${new Date().toISOString().slice(0, 10)}.csv`

    res.status(200).set({
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`
    }).send(csv)
  } catch (e) {
    next(e)
  }
})

router.get("/:id", checkToken, async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      throw new ErrorHandler("ID must be a positive number", 400)
    }

    const employee = await getEmployeeByID(id)

    res.status(200).json({
      success: true, data: employee
    })
  } catch (e) {
    next(e)
  }
})

router.post("/", checkToken, checkRole("admin"), async (req, res, next) => {
  const data = req.body
  try {
    const errors = validateEmployeeData(data)
    if (Object.keys(errors).length > 0) {
      throw new ErrorHandler("Validation failed", 400, errors)
    }

    const employee = await createEmployee(data, req)

    res.status(201).json({
      success: true, data: employee, message: "Employee added successfully"
    })
  } catch (e) {
    next(e)
  }
})

router.put("/:id", checkToken, checkRole("admin"), async (req, res, next) => {
  const data = req.body

  try {
    const errors = validateEmployeeData(data)
    if (Object.keys(errors).length > 0) {
      throw new ErrorHandler("Validation failed", 400, errors)
    }

    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      throw new ErrorHandler("ID must be a positive number", 400)
    }

    const employee = await updateEmployee(id, data, req)

    res.status(200).json({
      success: true, data: employee, message: "Employee updated successfully"
    })
  } catch (e) {
    next(e)
  }
})

router.delete("/:id", checkToken, checkRole("admin"), async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      throw new ErrorHandler("ID must be a positive number", 400)
    }

    await deleteEmployee(id, req)

    res.status(200).json({
      success: true, message: "Employee deleted successfully"
    })
  } catch (e) {
    next(e)
  }
})


export {
  router as employeeRouter
}

const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const status_enum = ["FULL_TIME", "PART_TIME", "KELUAR"]
const phoneRegex = /^\+?[0-9][0-9\s-]{7,20}$/

function validateEmployeeData(data = {}) {
  const errors = {}
  const required = [
    { key: "nama", label: "Nama" },
    { key: "email", label: "Email" },
    { key: "no_telp", label: "NoTelp" },
    { key: "jabatan", label: "Jabatan" },
    { key: "status", label: "Status" },
  ]

  for (const i of required) {
    const value = data[i.key]
    if (typeof value !== "string" || value.trim() === "") {
      errors[i.key] = `${i.label} field is required`
    }
  }

  if (typeof data.status === "string" && data.status.trim() !== "" && !status_enum.includes(data.status)) {
    errors.status = "Invalid employee status"
  }

  if (typeof data.email === "string" && data.email.trim() !== "" && !email_regex.test(data.email.trim())) {
    errors.email = "Invalid email format"
  }
  
  if (typeof data.no_telp === "string" && data.no_telp.trim() !== "" && !phoneRegex.test(data.no_telp.trim())) {
    errors.no_telp = "Invalid phone format"
  }

  if (!Number.isInteger(data.department_id) || data.department_id <= 0) {
    errors.department_id = "Department ID msy be a positive integer"
  }

  return errors
}
