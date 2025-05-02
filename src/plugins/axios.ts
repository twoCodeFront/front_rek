// src/plugins/axios.ts
import axios, { type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse} from 'axios'
import { useAuthStore} from "../store/auth.store.ts";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api',
    withCredentials: true,
})

// REQUEST interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const { accessToken } = useAuthStore()
        if (accessToken) {
            config.headers = config.headers ?? {}
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error: AxiosError) => Promise.reject(error),
)

// RESPONSE interceptor
api.interceptors.response.use(
    (res: AxiosResponse) => res,
    async (error: AxiosError) => {
        const auth = useAuthStore()
        const original = error.config as InternalAxiosRequestConfig & { __retry?: boolean }

        if (error.response?.status === 401 && !original.__retry) {
            original.__retry = true
            try {
                const newToken =  auth.refresh()
                original.headers = original.headers ?? {}
                original.headers.Authorization = `Bearer ${newToken}`;
                return api(original)
            } catch {
                return Promise.reject(error)
            }
        }
        return Promise.reject(error)
    },
)

export default api