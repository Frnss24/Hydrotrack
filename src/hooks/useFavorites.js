import { useState, useEffect, useCallback } from 'react'

const FAV_KEY = 'hydrotrack_favorite_beverages'
const FAV_EVENT = 'hydrotrack:favorites-changed'

const readFavs = () => {
  try {
    const raw = localStorage.getItem(FAV_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(readFavs)

  const refresh = useCallback(() => setFavorites(readFavs()), [])

  useEffect(() => {
    window.addEventListener(FAV_EVENT, refresh)
    return () => window.removeEventListener(FAV_EVENT, refresh)
  }, [refresh])

  return { favorites }
}

export function useIsFavorited(beverageId) {
  const { favorites } = useFavorites()
  const isFavorited = favorites.some((id) => String(id) === String(beverageId))

  const toggleFavorite = () => {
    const current = readFavs()
    const idx = current.findIndex((id) => String(id) === String(beverageId))
    if (idx === -1) current.push(beverageId)
    else current.splice(idx, 1)
    localStorage.setItem(FAV_KEY, JSON.stringify(current))
    window.dispatchEvent(new Event(FAV_EVENT))
  }

  return { isFavorited, toggleFavorite }
}
