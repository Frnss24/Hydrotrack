const USER_IDENTIFIER_KEY = 'hydrotrack_user_id'
const USER_PROFILE_KEY = 'hydrotrack_user_profile'
const PROFILE_EVENT = 'hydrotrack:profile-changed'

const isValidUUID = (str) =>
  typeof str === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    str,
  )

const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const getUserIdentifier = () => {
  try {
    let userId = localStorage.getItem(USER_IDENTIFIER_KEY)
    if (!userId || !isValidUUID(userId)) {
      userId = generateUUID()
      localStorage.setItem(USER_IDENTIFIER_KEY, userId)
    }
    return userId
  } catch {
    return generateUUID()
  }
}

export const getUserProfile = () => {
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  return {
    username: 'Pengguna HydroTrack',
    weightKg: 60,
    dailyTargetMl: 2100,
    bio: 'Menjaga hidrasi harian agar tetap fokus dan sehat.',
    avatar: null,
    userId: getUserIdentifier(),
  }
}

export const saveUserProfile = (profile) => {
  try {
    const data = {
      ...profile,
      dailyTargetMl: Number(profile.dailyTargetMl) || 2100,
      weightKg: Number(profile.weightKg) || 60,
      userId: getUserIdentifier(),
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(data))
    window.dispatchEvent(new Event(PROFILE_EVENT))
    return { success: true, data }
  } catch (err) {
    return { success: false, message: err.message }
  }
}

export const updateAvatar = (avatarBase64) => {
  const profile = getUserProfile()
  profile.avatar = avatarBase64
  return saveUserProfile(profile)
}

export { PROFILE_EVENT }

export default {
  getUserIdentifier,
  getUserProfile,
  saveUserProfile,
  updateAvatar,
}
