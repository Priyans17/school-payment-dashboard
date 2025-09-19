import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export const authAPI = {
  login: (data: { email: string; password: string }) => api.post("/auth/login", data),
  register: (data: { email: string; password: string; name: string }) => api.post("/auth/register", data),
}

export const transactionAPI = {
  getAll: (params?: { page?: number; limit?: number; sort?: string; order?: string }) =>
    api.get("/transactions", { params }),
  getBySchool: (schoolId: string, params?: { page?: number; limit?: number }) =>
    api.get(`/transactions/school/${schoolId}`, { params }),
  getStatus: (customOrderId: string) => api.get(`/transaction-status/${customOrderId}`),
}

export const paymentAPI = {
  create: (data: {
    amount: number
    student_info: {
      name: string
      id: string
      email: string
    }
    callback_url?: string
  }) => api.post("/payment/create-payment", data),
  checkStatus: (collectRequestId: string) => api.get(`/payment/status/${collectRequestId}`),
  autoApprove: (orderId: string) => api.post(`/payment/auto-approve/${orderId}`),
  adminApprove: (orderId: string, approved: boolean) => api.post(`/payment/admin-approve/${orderId}`, { approved }),
}

export const orderAPI = {
  createDummyData: () => api.post("/order/create-dummy-data"),
  createRawData: (data: {
    institute_name: string
    student_name: string
    student_id: string
    student_email: string
    order_amount: number
    transaction_amount: number
    payment_method: string
    status: string
    gateway: string
    phone_number?: string
  }) => api.post("/order/create-raw-data", data),
  exportData: (params?: { format?: string; status?: string; start_date?: string; end_date?: string }) => 
    api.get("/order/export", { params }),
}

export default api
