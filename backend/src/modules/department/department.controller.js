import express from "express"
import { getAllDepartments } from "./department.service"

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const departments = await getAllDepartments()

    res.status(200).send(departments)
    
  } catch (e) {
    res.status(500).send("Failed to fetch departments")
  }
  
})

export { router as departmentRouter }