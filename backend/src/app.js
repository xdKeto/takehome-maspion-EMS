import express from "express"
import { employeeRouter } from "./modules/employee/employee.controller.js"
import { departmentRouter } from "./modules/department/department.controller.js"
import { authRouter } from "./modules/auth/auth.controller.js"
import { rateLimiter } from "./middlewares/rate-limiter.middleware.js"
import { errorHandler, notFoundHandler } from "./middlewares/error-handler.middleware.js"
import { auditRouter } from "./modules/audit/audit.controller.js"
import cors from "cors"

const app = express()

// vercel proxy
app.set("trust proxy", 1)

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://https://takehome-maspion-ems-backend.vercel.app"
  ]
}))

app.use((req, res, next) => {
  if (req.method === "GET" || req.method === "HEAD") return next()
  return express.json()(req, res, next)
})
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
app.use(notFoundHandler)
app.use(errorHandler)

export default app
