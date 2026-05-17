const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.toString().replace(/\/$/, '') ??
  'http://localhost:8000'

type AuthTokenResponse = {
  token: string
}

export type LoginPayload = {
  username: string
  password: string
}

export type RegisterPayload = {
  username: string
  password: string
  confirmPassword: string
}

const parseErrorMessage = async (response: Response) => {
  try {
    const data = (await response.json()) as { detail?: string }
    if (data?.detail) {
      return data.detail
    }
  } catch {
  }
  return response.statusText || 'Request failed'
}

export const loginUser = async ({ username, password }: LoginPayload) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response))
  }

  const data = (await response.json()) as AuthTokenResponse
  return data.token
}

export const registerUser = async ({
  username,
  password,
  confirmPassword,
}: RegisterPayload) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      password,
      confirm_password: confirmPassword,
    }),
  })

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response))
  }

  const data = (await response.json()) as AuthTokenResponse
  return data.token
}
