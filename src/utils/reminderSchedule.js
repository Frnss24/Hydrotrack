export const REMINDER_STORAGE_KEY = 'hydrotrack_reminder_settings'
export const REMINDER_LAST_NOTIFIED_KEY = 'hydrotrack_last_notified_slot'
export const REMINDER_EVENT = 'hydrotrack:reminder-changed'
export const INTERVAL_OPTIONS = [45, 60, 90, 120]

export const DEFAULT_REMINDER_SETTINGS = {
  enabled: false,
  wakeTime: '07:00',
  sleepTime: '22:00',
  intervalMinutes: 90,
}

export function loadReminderSettings() {
  try {
    const raw = localStorage.getItem(REMINDER_STORAGE_KEY)
    return raw
      ? { ...DEFAULT_REMINDER_SETTINGS, ...JSON.parse(raw) }
      : DEFAULT_REMINDER_SETTINGS
  } catch {
    return DEFAULT_REMINDER_SETTINGS
  }
}

export function saveReminderSettings(nextSettings) {
  try {
    localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(nextSettings))
    window.dispatchEvent(new Event(REMINDER_EVENT))
  } catch {
    /* ignore */
  }
}

export function toMinutes(timeStr) {
  const [h, m] = String(timeStr || '07:00').split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

export function formatMinutes(totalMin) {
  const h = Math.floor(totalMin / 60) % 24
  const m = totalMin % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function buildReminderSchedule(settings, targetMl = 2100) {
  const wakeMin = toMinutes(settings.wakeTime)
  const sleepMin = toMinutes(settings.sleepTime)
  const step = Math.max(30, Number(settings.intervalMinutes) || 90)
  const endMin = sleepMin > wakeMin ? sleepMin : wakeMin + 14 * 60

  const slots = []
  for (let t = wakeMin; t <= endMin; t += step) {
    slots.push(t)
  }
  if (slots.length === 0) slots.push(wakeMin)

  const perSessionMl = Math.round(targetMl / slots.length)
  const now = new Date()
  const nowMin = now.getHours() * 60 + now.getMinutes()

  return slots.map((min, idx) => ({
    id: idx,
    time: formatMinutes(min),
    minutes: min,
    amountMl: perSessionMl,
    label:
      idx === 0
        ? 'Minum Setelah Bangun'
        : idx === slots.length - 1
          ? 'Sesi Sebelum Tidur'
          : 'Sesi Hidrasi Berkala',
    isPast: min < nowMin,
    isNext: min >= nowMin && (idx === 0 || slots[idx - 1] < nowMin),
  }))
}

export async function showHydroNotification(title, body) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
    return false
  }

  const options = {
    body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'hydrotrack-hydration-reminder',
    renotify: true,
  }

  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration()
      if (reg && typeof reg.showNotification === 'function') {
        await reg.showNotification(title, options)
        return true
      }
    }
  } catch {
    /* fallback to window Notification */
  }

  try {
    new Notification(title, options)
    return true
  } catch {
    return false
  }
}
