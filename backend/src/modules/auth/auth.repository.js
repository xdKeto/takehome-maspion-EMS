import prisma from "../../database/index.js"

const findUserByUsername = async (data) => {
  const user = await prisma.user.findUnique({
    where: {
      username: data.username
    }
  })

  return user
}

const createUser = async (data) => {
  const user = await prisma.user.create({
    data: {
      username: data.username, password: data.password, role: data.role
    }
  })

  return user
}

export { findUserByUsername, createUser }
