import axios from 'axios'

export const api = axios.create({
  // In browser, relative base works. For SSR, consider absolute URL via env.
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err?.response?.data?.error || err?.message || 'Request failed'
    return Promise.reject(new Error(message))
  }
)

// Convenience helpers
export const CarsAPI = {
  // Comments
  listComments: (carId: string, limit = 30) =>
    api.get(`/api/cars/${carId}/comments`, { params: { limit } }).then((r) => r.data),
  addComment: (carId: string, body: string, user_id?: string) =>
    api.post(`/api/cars/${carId}/comments`, { body, user_id }).then((r) => r.data),

  // Favorites
  getFavorites: (carId: string, user_id?: string) =>
    api.get(`/api/cars/${carId}/favorites`, { params: { user_id } }).then((r) => r.data),
  favorite: (carId: string, user_id: string) =>
    api.post(`/api/cars/${carId}/favorites`, { user_id }).then((r) => r.data),
  unfavorite: (carId: string, user_id: string) =>
    api.delete(`/api/cars/${carId}/favorites`, { data: { user_id } }).then((r) => r.data),
}
