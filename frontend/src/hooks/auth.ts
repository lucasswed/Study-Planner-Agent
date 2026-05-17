import { useCallback, useEffect, useState } from 'react'

import {
    loginUser,
    registerUser,
    type LoginPayload,
    type RegisterPayload,
} from '../api_layer/auth_calls'

const AUTH_TOKEN_KEY = 'token'
const AUTH_EVENT_NAME = 'auth-token-change'

export type AuthUser = {
  username: string
  userId?: number
}

const readToken = () => localStorage.getItem(AUTH_TOKEN_KEY)

const decodeTokenPayload = (token: string): AuthUser | null => {
  const parts = token.split('.')
  if (parts.length < 2) {
    return null
  }

  const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')

  try {
    const payload = JSON.parse(atob(padded)) as {
      sub?: string
      user_id?: number
    }
    if (!payload.sub) {
      return null
    }
    return {
      username: payload.sub,
      userId: typeof payload.user_id === 'number' ? payload.user_id : undefined,
    }
  } catch {
    return null
  }
}

export const getAuthToken = () => readToken()

export const setAuthToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  window.dispatchEvent(new Event(AUTH_EVENT_NAME))
}

export const clearAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  window.dispatchEvent(new Event(AUTH_EVENT_NAME))
}

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(() => readToken())
  const [user, setUser] = useState<AuthUser | null>(() =>
    token ? decodeTokenPayload(token) : null,
  )
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(token))

  const syncAuth = useCallback(() => {
    const currentToken = readToken()
    setToken(currentToken)
    setUser(currentToken ? decodeTokenPayload(currentToken) : null)
    setIsAuthenticated(Boolean(currentToken))
  }, [])

  useEffect(() => {
    window.addEventListener('storage', syncAuth)
    window.addEventListener(AUTH_EVENT_NAME, syncAuth)

    return () => {
      window.removeEventListener('storage', syncAuth)
      window.removeEventListener(AUTH_EVENT_NAME, syncAuth)
    }
  }, [syncAuth])

  const login = useCallback(async (payload: LoginPayload) => {
    const token = await loginUser(payload)
    setAuthToken(token)
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    const token = await registerUser(payload)
    setAuthToken(token)
  }, [])

  const logout = useCallback(() => {
    clearAuthToken()
  }, [])

  return {
    isAuthenticated,
    user,
    token,
    login,
    register,
    logout,
  }
}
