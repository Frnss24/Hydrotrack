import { apiClient } from '../config/api'
import { BEVERAGES_LOCAL } from '../data/hydroLocal'

const CACHE_KEY = 'hydrotrack_beverages_cache'

class BeverageService {
  async getAll() {
    try {
      const res = await apiClient.get('/api/beverages')
      const list = Array.isArray(res) ? res : res?.data || []
      const mapped = list.map((b) => ({
        ...b,
        category: b.category || b.beverage_categories?.name || 'Air Murni',
      }))
      localStorage.setItem(CACHE_KEY, JSON.stringify(mapped))
      return {
        success: true,
        data: mapped,
        isLocal: false,
      }
    } catch {
      try {
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          return { success: true, data: JSON.parse(cached), isLocal: true }
        }
      } catch {
        /* ignore */
      }
      return { success: true, data: BEVERAGES_LOCAL, isLocal: true }
    }
  }
}

export default new BeverageService()
