import express from "express"
import { getAllDepartments } from "./department.service"

const router = express.Router()

router.get("/", async (req, res, next) => {
  try {
    const departments = await getAllDepartments()

    res.status(200).json({
      success: true, data: departments
    })

  } catch (e) {
    next(e)
  }

})

export { router as departmentRouter }
