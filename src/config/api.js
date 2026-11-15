import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'Terjadi kesalahan pada server.'
    let status = null
    if (error.response) {
      status = error.response.status
      message =
        error.response.data?.message ||
        error.response.data?.error ||
        `Server error (${status})`
    } else if (error.request) {
      message = 'Mode offline / API belum terhubung.'
    } else {
      message = error.message || message
    }
    return Promise.reject({ message, status })
  },
)

export { apiClient, BASE_URL }
