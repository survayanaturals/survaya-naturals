// src/services/api.js
// Central API service connecting frontend to backend

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const request = async (path, options = {}) => {
  const token = localStorage.getItem('survaya_admin_token')
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'API error')
  return data
}

// ─── Products ─────────────────────────────────────────────────────────────────
export const productsAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/products${qs ? '?' + qs : ''}`)
  },
  getById: id => request(`/products/${id}`),
}

// ─── Orders ───────────────────────────────────────────────────────────────────
export const ordersAPI = {
  // Place a new order
  place: orderData => request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),

  // Track order by orderId string
  track: orderId => request(`/orders/track/${orderId}`),

  // Submit UPI payment screenshot
  submitPaymentProof: async (orderId, file) => {
    const formData = new FormData()
    formData.append('screenshot', file)
    const token = localStorage.getItem('survaya_admin_token')
    const res = await fetch(`${BASE_URL}/orders/${orderId}/payment-proof`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Upload failed')
    return data
  },
}

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminAPI = {
  login: (email, password) =>
    request('/admin/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  getMe: () => request('/admin/auth/me'),

  getStats: () => request('/admin/stats'),

  getOrders: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/admin/orders${qs ? '?' + qs : ''}`)
  },

  updateOrderStatus: (id, status, note) =>
    request(`/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, note }),
    }),

  createProduct: data =>
    request('/admin/products', { method: 'POST', body: JSON.stringify(data) }),

  updateProduct: (id, data) =>
    request(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteProduct: id =>
    request(`/admin/products/${id}`, { method: 'DELETE' }),
}
