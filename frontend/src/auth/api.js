const API_BASE = 'http://localhost:4000'

const TOKEN_KEY = 'dv_auth_token_v1'

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token) {
  try {
    if (!token) localStorage.removeItem(TOKEN_KEY)
    else localStorage.setItem(TOKEN_KEY, token)
  } catch {
    // ignore
  }
}

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const raw =
      data?.error?.message ?? data?.message ?? data?.error ?? data ?? 'Request failed'
    if (typeof raw === 'string') throw new Error(raw)
    try {
      throw new Error(JSON.stringify(raw))
    } catch {
      throw new Error('Request failed')
    }
  }
  return data
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  me: (token) => request('/auth/me', { token }),
  verificationRequest: ({ idType, idNumber, walletAddress }, token) =>
    request('/verification/request', {
      method: 'POST',
      body: { idType, idNumber, walletAddress },
      token,
    }),
  verificationStatus: (token) => request('/verification/status', { token }),
  adminPendingVerifications: (token) => request('/verification/admin/pending', { token }),
  adminApproveVerification: ({ email, userId }, token) =>
    request('/verification/admin/approve', {
      method: 'POST',
      body: { email, userId },
      token,
    }),
}

