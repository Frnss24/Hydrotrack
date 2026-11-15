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
