import { apiClient } from '../config/api'
import { BEVERAGES_LOCAL } from '../data/hydroLocal'

class BeverageService {
  async getAll() {
    try {
      const res = await apiClient.get('/api/beverages')
      const list = Array.isArray(res) ? res : res?.data || []
      if (list.length > 0) {
        return {
          success: true,
          data: list.map((b) => ({
            ...b,
            category: b.category || b.beverage_categories?.name || 'Air Murni',
          })),
          isLocal: false,
        }
      }
      return { success: true, data: BEVERAGES_LOCAL, isLocal: true }
    } catch {
      return { success: true, data: BEVERAGES_LOCAL, isLocal: true }
    }
  }
}

export default new BeverageService()
