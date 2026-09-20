import express from "express"
import { checkRole, checkToken } from "../../middlewares/auth.middleware.js"
import { getLogs } from "./audit.service.js"

const router = express.Router()

router.get("/", checkToken, checkRole("admin"), async (req, res, next) => {
  try {
    const logs = await getLogs()

    res.status(200).json({
      success: true, data: logs
    })
  } catch (e) {
    next(e)
  }
})

export { router as auditRouter }
