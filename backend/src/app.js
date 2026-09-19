import express from "express"
import { employeeRouter } from "./modules/employee/employee.controller"
import { departmentRouter } from "./modules/department/department.controller"

const app = express()

// middlewares disini, ratelimit
app.use(express.json())
// rate limit

// daftar routes
// app.use("/api/auth", authRoutes)
app.use("/api/employees", employeeRouter)
app.use("/api/departments", departmentRouter)

app.get("/health", (req, res) => {
  res.status(200).send({
    message: "ok, api running"
  })
})

// error handler, app.use(errorHandler)

export default app