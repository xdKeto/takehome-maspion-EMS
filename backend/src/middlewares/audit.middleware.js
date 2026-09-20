import prisma from "../database/index"

const sanitize = (value) => {
  const keys = new Set([
    "password", "passwordHash", "token", "accessToken", "authorization"
  ])

  if (Array.isArray(value)) return value.map(sanitize)

  if (typeof value === "object" && value) {
    const sanitized = Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !keys.has(key))
        .map(([key, item]) => [key, sanitize(item)])
    )

    return sanitized
  }

  return value
}

const auditLog = async ({
  req, target, target_id, action, changes
}) => {
  const audit = await prisma.auditLog.create({
    data: {
      target: target,
      target_id: String(target_id),
      action: action,
      changes: JSON.stringify(sanitize(changes)),
      user_id: req.user?.userID ?? null,
      username: req.user?.username ?? "server"
    }
  })

  return audit
}

export default auditLog
