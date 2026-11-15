import { apiClient } from '../config/api'
import { INITIAL_LOGS_LOCAL } from '../data/hydroLocal'
import { getUserIdentifier } from './userService'

const LOCAL_LOGS_KEY = 'hydrotrack_logs'
export const LOGS_EVENT = 'hydrotrack:logs-changed'

export const readLocalLogs = () => {
  try {
    const raw = localStorage.getItem(LOCAL_LOGS_KEY)
    if (raw) return JSON.parse(raw)
    localStorage.setItem(LOCAL_LOGS_KEY, JSON.stringify(INITIAL_LOGS_LOCAL))
    return INITIAL_LOGS_LOCAL
  } catch {
    return INITIAL_LOGS_LOCAL
  }
}

export const writeLocalLogs = (logs) => {
  try {
    localStorage.setItem(LOCAL_LOGS_KEY, JSON.stringify(logs))
    window.dispatchEvent(new Event(LOGS_EVENT))
  } catch {
    /* ignore */
  }
}

class LogService {
  async getAll() {
    const userId = getUserIdentifier()
    try {
      const res = await apiClient.get('/api/logs', {
        params: { user_identifier: userId },
      })
      const list = Array.isArray(res) ? res : res?.data || []
      if (list.length > 0) {
        return { success: true, data: list, isLocal: false }
      }
      return { success: true, data: readLocalLogs(), isLocal: true }
    } catch {
      return { success: true, data: readLocalLogs(), isLocal: true }
    }
  }

  async create(payload) {
    const userId = getUserIdentifier()
    const fullPayload = {
      ...payload,
      user_identifier: userId,
      consumed_at: payload.consumed_at || new Date().toISOString(),
    }

    try {
      const res = await apiClient.post('/api/logs', fullPayload)
      const created = res?.data || res
      const current = readLocalLogs()
      writeLocalLogs([created, ...current])
      return { success: true, data: created }
    } catch {
      const localItem = {
        ...fullPayload,
        id: `local-log-${Date.now()}`,
      }
      const current = readLocalLogs()
      writeLocalLogs([localItem, ...current])
      return { success: true, data: localItem, isLocal: true }
    }
  }

  async update(id, payload) {
    try {
      if (!String(id).startsWith('log-') && !String(id).startsWith('local-')) {
        await apiClient.put(`/api/logs/${id}`, payload)
      }
    } catch {
      /* fallback to local update */
    }
    const current = readLocalLogs()
    const updated = current.map((item) =>
      String(item.id) === String(id) ? { ...item, ...payload } : item,
    )
    writeLocalLogs(updated)
    return {
      success: true,
      data: updated.find((item) => String(item.id) === String(id)),
    }
  }

  async remove(id) {
    try {
      if (!String(id).startsWith('log-') && !String(id).startsWith('local-')) {
        await apiClient.delete(`/api/logs/${id}`)
      }
    } catch {
      /* fallback to local delete */
    }
    const current = readLocalLogs().filter(
      (item) => String(item.id) !== String(id),
    )
    writeLocalLogs(current)
    return { success: true }
  }
}

export default new LogService()
