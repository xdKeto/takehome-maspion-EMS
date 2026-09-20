import { ErrorHandler } from "../../middlewares/error-handler.middleware.js"
import { createUser, findUserByUsername } from "./auth.repository.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const loginUser = async (data) => {
  const user = await findUserByUsername(data)
  const valid = user && await bcrypt.compare(data.password, user.password)

  if (!valid) {
    throw new ErrorHandler("Invalid username or password", 401)
  }

  const sanitizedUser = userHelper(user)
  const token = jwt.sign(
    { userID: sanitizedUser.id, username: sanitizedUser.username, role: sanitizedUser.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  )

  return { token, user: sanitizedUser }
}

const registerUser = async (data) => {
  const username = await findUserByUsername(data)
  if (username) {
    throw new ErrorHandler("Username already exists", 409)
  }

  const hashedPW = await bcrypt.hash(data.password, 11)
  const user = await createUser({
    username: data.username,
    password: hashedPW,
    role: data.role.toUpperCase()
  })
  
  return userHelper(user)
}

export { loginUser, registerUser }

const userHelper = (user) => ({
  id: user.id,
  username: user.username,
  role: user.role.toLowerCase()
})
