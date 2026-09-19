import express from "express"
import { employeeRouter } from "./modules/employee/employee.controller"
import { departmentRouter } from "./modules/department/department.controller"
import { rateLimiter } from "./middlewares/rate-limiter.middleware"
import { errorHandler } from "./middlewares/error-handler.middleware"

const app = express()

app.use(express.json())
app.use(rateLimiter(10, 100)) // max 100 in 10min

// daftar routes
// app.use("/api/auth", authRoutes)
app.use("/api/employees", employeeRouter)
app.use("/api/departments", departmentRouter)

app.get("/health", (req, res) => {
  res.status(200).send({
    message: "ok, api running"
  })
})

// handlers
app.use(errorHandler)

export default app