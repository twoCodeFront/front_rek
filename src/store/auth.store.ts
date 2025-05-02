// stores/auth.ts
import {defineStore} from 'pinia'
import {ref, computed} from 'vue'
import axios from '../plugins/axios.ts';
import type {AxiosError} from 'axios'

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: Date | null;
    password: string
    remember_token: string | null;
    created_at: Date;
    updated_at: Date;
}

export const useAuthStore = defineStore('auth', () => {
        const accessToken = ref<string | null>(localStorage.getItem('access_token'))
        const user = ref<User | null>(null)
        const isRefreshing = ref(false)
        let refreshPromise: Promise<string> | null = null

        const isLoggedIn = computed(() => !!accessToken.value)

        function setToken(token: string) {
            accessToken.value = token
            localStorage.setItem('access_token', token)
        }

        function clearAuth() {
            accessToken.value = null
            user.value = null
            localStorage.removeItem('access_token')
        }

        async function login(email: string, password: string) {
            const res = await axios.post('/login', {email, password})
            setToken(res.data.access_token)
            user.value = res.data.user
        }

        async function logout() {
            try {
                await axios.post('/logout')
            } catch {
                // ignore
            }
            clearAuth()
            // router.push({ name: 'login' })
        }

        async function getUser(): Promise<void> {
            try {
                const data = await axios.get('/api/user');
                console.log(data);
            } catch (e) {
                clearAuth();
            }
        }

        async function refresh(): Promise<string> {
            if (isRefreshing.value && refreshPromise) {
                return refreshPromise
            }

            isRefreshing.value = true
            refreshPromise = axios
                .post('/refresh')
                .then((res) => {
                    const token = res.data.access_token
                    setToken(token)
                    return token
                })
                .catch((err: AxiosError) => {
                    clearAuth()
                    // np. router.push({ name: 'login' })
                    return Promise.reject(err)
                })
                .finally(() => {
                    isRefreshing.value = false
                    refreshPromise = null
                })

            return refreshPromise
        }


        return {
            accessToken,
            user,
            isLoggedIn,
            login,
            logout,
            refresh,
            getUser
        }
    }, {
        persist: {
            key: 'auth',
            storage: localStorage,
            pick: ['accessToken', 'user']
        },
    }
)
