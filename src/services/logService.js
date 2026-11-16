import { apiClient } from '../config/api'
import { getUserIdentifier } from './userService'

export const LOGS_EVENT = 'hydrotrack:logs-changed'

const getCacheKey = () => `hydrotrack_logs_${getUserIdentifier()}`

export const readLocalLogs = () => {
  try {
    const raw = localStorage.getItem(getCacheKey())
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const writeLocalLogs = (logs) => {
  try {
    localStorage.setItem(getCacheKey(), JSON.stringify(logs))
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
      localStorage.setItem(getCacheKey(), JSON.stringify(list))
      return { success: true, data: list, isLocal: false }
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
      if (!String(id).startsWith('local-')) {
        await apiClient.put(`/api/logs/${id}`, payload)
      }
    } catch {
      /* fallback to local cache update */
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
      if (!String(id).startsWith('local-')) {
        await apiClient.delete(`/api/logs/${id}`)
      }
    } catch {
      /* fallback to local cache delete */
    }
    const current = readLocalLogs().filter(
      (item) => String(item.id) !== String(id),
    )
    writeLocalLogs(current)
    return { success: true }
  }
}

export default new LogService()
