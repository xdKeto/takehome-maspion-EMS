import express from "express"
import { loginUser, registerUser } from "./auth.service.js"
import { checkRole, checkToken } from "../../middlewares/auth.middleware.js"
import { ErrorHandler } from "../../middlewares/error-handler.middleware.js"

const router = express.Router()

router.post("/login", async (req, res, next) => {
  try {
    const data = req.body ?? {}
    if (typeof data.username !== "string" || data.username.trim() === "" ||
      typeof data.password !== "string" || data.password === "") {
      throw new ErrorHandler("Username and password are required", 400)
    }

    const result = await loginUser(data)
    res.status(200).json({
      success: true, data: result
    })
  } catch (e) {
    next(e)
  }
})

router.post("/register", checkToken, checkRole("admin"), async (req, res, next) => {
  try {
    const data = req.body ?? {}

    if (typeof data.username !== "string" || data.username.trim() === "" ||
      typeof data.password !== "string" || data.password === "") {
      throw new ErrorHandler("Username and password are required", 400)
    }

    if (typeof data.role !== "string" || !["ADMIN", "VIEWER"].includes(data.role.toUpperCase())) {
      throw new ErrorHandler("Invalid role", 400)
    }

    const user = await registerUser(data)

    res.status(201).json({
      success: true, data: user
    })
  } catch (e) {
    next(e)
  }
})

export { router as authRouter }
