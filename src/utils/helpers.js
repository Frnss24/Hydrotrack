export const formatTime = (isoString) => {
  if (!isoString) return '—'
  const d = new Date(isoString)
  if (Number.isNaN(d.getTime())) return isoString
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

export const formatDate = (isoString) => {
  if (!isoString) return '—'
  const d = new Date(isoString)
  if (Number.isNaN(d.getTime())) return isoString
  return d.toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export const isSameDay = (dateA, dateB) => {
  const a = new Date(dateA)
  const b = new Date(dateB)
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export const getLast7DaysChart = (logs) => {
  const days = []
  const now = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    const totalMl = logs
      .filter((log) => isSameDay(log.consumed_at, d))
      .reduce((sum, log) => sum + (Number(log.amount_ml) || 0), 0)

    days.push({
      label: d.toLocaleDateString('id-ID', { weekday: 'short' }),
      dateStr: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      totalMl,
      isToday: i === 0,
    })
  }
  return days
}

export const truncate = (str, max = 90) => {
  if (!str || str.length <= max) return str || ''
  return str.slice(0, max).trimEnd() + '…'
}

export const getHydrationIndex = (beverageName = '', category = '') => {
  const text = `${beverageName} ${category}`.toLowerCase()
  if (text.includes('susu') || text.includes('milk')) return 115
  if (text.includes('kelapa') || text.includes('isotonik') || text.includes('elektrolit')) return 108
  if (text.includes('infused') || text.includes('lemon') || text.includes('mentimun')) return 98
  if (text.includes('jus') || text.includes('buah')) return 95
  if (text.includes('teh') || text.includes('tea')) return 92
  if (text.includes('kopi') || text.includes('coffee')) return 80
  if (text.includes('soda') || text.includes('manis')) return 75
  return 100
}

export const getEffectiveHydrationMl = (log) => {
  const raw = Number(log?.amount_ml) || 0
  const index =
    typeof log?.hydration_index === 'number'
      ? log.hydration_index
      : getHydrationIndex(log?.beverage_name, log?.category)
  return Math.round(raw * (index / 100))
}
