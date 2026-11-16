import { apiClient } from '../config/api'
import { getUserIdentifier } from './userService'

export const LOGS_EVENT = 'hydrotrack:logs-changed'

const getCacheKey = () => `hydrotrack_logs_${getUserIdentifier()}`

export const readLocalLogs = () => {
  try {
    localStorage.removeItem('hydrotrack_logs')
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
  async syncPendingLogs() {
    const current = readLocalLogs()
    const pending = current.filter(
      (item) => item.pendingSync || String(item.id).startsWith('local-log-'),
    )
    if (pending.length === 0) return 0

    let syncedCount = 0
    let nextLogs = [...current]

    for (const item of pending) {
      try {
        const res = await apiClient.post('/api/logs', {
          user_identifier: item.user_identifier || getUserIdentifier(),
          beverage_name: item.beverage_name,
          category: item.category,
          amount_ml: item.amount_ml,
          consumed_at: item.consumed_at,
          mood: item.mood,
          notes: item.notes,
        })
        const created = res?.data || res
        nextLogs = nextLogs.map((l) =>
          String(l.id) === String(item.id) ? created : l,
        )
        syncedCount += 1
      } catch {
        break // still offline
      }
    }

    if (syncedCount > 0) {
      writeLocalLogs(nextLogs)
    }
    return syncedCount
  }

  async getAll() {
    const userId = getUserIdentifier()
    try {
      await this.syncPendingLogs()
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
        pendingSync: true,
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
