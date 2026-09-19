import prisma from "../../database/index.js"

const findUser = async (data) => {
  const user = await prisma.user.findUnique({
    where: {
      username: data.username
    }
  })

  return user
}

const createUser = async (data) => {
  const user = await prisma.user.create({
    username: data.username,
    password: data.password
  })
}

export { findUser, createUser }