import express from "express"
import { loginUser, registerUser } from "./auth.service"
import { checkRole, checkToken } from "../../middlewares/auth.middleware"
import { ErrorHandler } from "../../middlewares/error-handler.middleware"

const router = express.Router()

router.post("/login", async (req, res, next) => {
  try {
    const result = await loginUser(req.body)
    res.status(200).json({
      success: true, data: result
    })
  } catch (e) {
    next(e)
  }
})

router.post("/register", checkToken, checkRole("admin"), async (req, res, next) => {
  try {
    const data = req.body

    if (!data.username || !data.password) {
      throw new ErrorHandler("Usernamd and password are required", 400)
    }

    if (!["ADMIN", "VIEWER"].includes(data.role.toUpperCase())) {
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
