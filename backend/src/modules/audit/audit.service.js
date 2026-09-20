import { getAuditLogs } from "./audit.repository"

const getLogs = async () => {
  const logs = await getAuditLogs()
  return logs
}

export { getLogs }
