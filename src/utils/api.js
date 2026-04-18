import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'انتهت مهلة الاتصال بالسيرفر'
    } else if (!error.response) {
      error.message = 'لا يوجد اتصال بالإنترنت'
    }
    return Promise.reject(error)
  }
)

export default api
