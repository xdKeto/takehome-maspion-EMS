import { getAuditLogs } from "./audit.repository.js"

const getLogs = async () => {
  const logs = await getAuditLogs()
  return logs
}

export { getLogs }
