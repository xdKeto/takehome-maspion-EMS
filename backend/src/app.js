import express from "express"
import { employeeRouter } from "./modules/employee/employee.controller"
import { departmentRouter } from "./modules/department/department.controller"
import { authRouter } from "./modules/auth/auth.controller"
import { rateLimiter } from "./middlewares/rate-limiter.middleware"
import { errorHandler } from "./middlewares/error-handler.middleware"
import { auditRouter } from "./modules/audit/audit.controller"
import cors from "cors"

const app = express()

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://frontend.vercel.app"
  ]
}))
app.use(express.json())
app.use(rateLimiter(10, 100)) // max 100 in 10min

// daftar routes
app.use("/api/auth", authRouter)
app.use("/api/employees", employeeRouter)
app.use("/api/departments", departmentRouter)
app.use("/api/audit", auditRouter)

app.get("/health", (req, res) => {
  res.status(200).send({
    message: "ok, api running"
  })
})

// handlers
app.use(errorHandler)

export default app
