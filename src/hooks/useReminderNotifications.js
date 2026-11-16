import { useEffect } from 'react'
import {
  loadReminderSettings,
  buildReminderSchedule,
  showHydroNotification,
  REMINDER_LAST_NOTIFIED_KEY,
  REMINDER_EVENT,
} from '../utils/reminderSchedule'
import { getUserProfile } from '../services/userService'
import logService from '../services/logService'

export function useGlobalAppEffects() {
  // 1. Auto-sync offline pending logs whenever connection returns
  useEffect(() => {
    const handleOnline = () => {
      logService.syncPendingLogs()
    }
    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [])

  // 2. Global reminder scheduler (keeps running across all tabs)
  useEffect(() => {
    const checkReminder = () => {
      if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
        return
      }
      const settings = loadReminderSettings()
      if (!settings.enabled) return

      const profile = getUserProfile()
      const schedule = buildReminderSchedule(settings, profile.dailyTargetMl || 2100)
      const now = new Date()
      const nowHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes(),
      ).padStart(2, '0')}`
      const todayKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${nowHHMM}`

      const matchingSlot = schedule.find((s) => s.time === nowHHMM)
      if (!matchingSlot) return

      const lastNotified = localStorage.getItem(REMINDER_LAST_NOTIFIED_KEY)
      if (lastNotified === todayKey) return

      localStorage.setItem(REMINDER_LAST_NOTIFIED_KEY, todayKey)
      showHydroNotification(
        `Waktunya Minum (${matchingSlot.time} WIB) - HydroTrack`,
        `Target sesi ini: +${matchingSlot.amountMl} ml air agar hidrasimu tetap terjaga.`,
      )
    }

    checkReminder()
    const timer = setInterval(checkReminder, 20000)
    window.addEventListener(REMINDER_EVENT, checkReminder)
    return () => {
      clearInterval(timer)
      window.removeEventListener(REMINDER_EVENT, checkReminder)
    }
  }, [])
}
