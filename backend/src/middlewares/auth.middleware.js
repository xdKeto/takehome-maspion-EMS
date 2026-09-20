import jwt from "jsonwebtoken"
import { ErrorHandler } from "./error-handler.middleware.js"

const checkToken = (req, res, next) => {
  try {
    const header = req.headers.authorization
    if (!header?.startsWith("Bearer ")) {
      throw new ErrorHandler("Authentication required", 401)
    }

    const token = header.slice("Bearer ".length)
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch (e) {
    if (["TokenExpiredError", "JsonWebTokenError"].includes(e.name)) {
      return next(new ErrorHandler("Token is invalid or expired", 401))
    }
    next(e)
  }
}

const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ErrorHandler("Forbidden", 403))
    }
    next()
  }
}

export { checkToken, checkRole }
