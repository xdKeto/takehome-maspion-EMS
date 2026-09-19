import "dotenv/config"
import bcrypt from "bcrypt"
import prisma from "../database/index"

const username = process.env.ADMIN_USERNAME
const password = process.env.ADMIN_PASSWORD

if (!username || !password) throw new Error("import master admin username and password in env first")

const hash = await bcrypt.hash(password, 11)

await prisma.user.upsert({
  where: { username },
  update: { password: hash, role: "ADMIN" },
  create: { username, password: hash, role: "ADMIN" },
})

await prisma.$disconnect()

console.log(`Admin ${username} is ready`)

