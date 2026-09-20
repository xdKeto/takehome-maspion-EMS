import prisma from "../../database/index.js"

const getAuditLogs = async () => {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" }
  })

  const result = logs.map((log) => ({
    ...log, changes: JSON.parse(log.changes)
  }))

  return result
}

export { getAuditLogs }
