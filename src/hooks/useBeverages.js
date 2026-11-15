import { useState, useEffect, useCallback } from 'react'
import beverageService from '../services/beverageService'

export function useBeverages() {
  const [beverages, setBeverages] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBeverages = useCallback(async () => {
    setLoading(true)
    const res = await beverageService.getAll()
    setBeverages(res.data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchBeverages()
  }, [fetchBeverages])

  return { beverages, loading, refetch: fetchBeverages }
}
