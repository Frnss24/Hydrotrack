import { useState, useEffect, useCallback } from 'react'
import logService, { LOGS_EVENT } from '../services/logService'

export function useLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLocal, setIsLocal] = useState(false)

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    const res = await logService.getAll()
    setLogs(res.data || [])
    setIsLocal(Boolean(res.isLocal))
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchLogs()
    window.addEventListener(LOGS_EVENT, fetchLogs)
    return () => window.removeEventListener(LOGS_EVENT, fetchLogs)
  }, [fetchLogs])

  return { logs, loading, isLocal, refetch: fetchLogs }
}
