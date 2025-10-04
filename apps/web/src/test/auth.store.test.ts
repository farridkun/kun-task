import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../stores/auth'
import { authApi } from '../api/auth'

// Mock the auth API
vi.mock('../api/auth')

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const store = useAuthStore()
    
    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should handle successful login', async () => {
    const mockResponse = {
      token: 'mock-token-123',
      user: { id: 1, email: 'test@example.com', name: 'Test User' }
    }
    
    vi.mocked(authApi.login).mockResolvedValue(mockResponse)
    
    const store = useAuthStore()
    await store.login({ email: 'test@example.com', password: 'password' })
    
    expect(store.user).toEqual(mockResponse.user)
    expect(store.token).toBe(mockResponse.token)
    expect(store.isAuthenticated).toBe(true)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should handle login failure', async () => {
    const mockError = {
      response: {
        data: {
          error: 'Invalid credentials'
        }
      }
    }
    vi.mocked(authApi.login).mockRejectedValue(mockError)
    
    const store = useAuthStore()
    
    try {
      await store.login({ email: 'invalid@example.com', password: 'wrongpassword' })
    } catch (error) {
      // Expected to throw
    }
    
    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(store.loading).toBe(false)
    expect(store.error).toBe('Invalid credentials')
  })

  it('should set loading state during login', async () => {
    let resolveLogin: (value: any) => void
    const loginPromise = new Promise(resolve => {
      resolveLogin = resolve
    })
    
    vi.mocked(authApi.login).mockReturnValue(loginPromise as any)
    
    const store = useAuthStore()
    const loginCall = store.login({ email: 'test@example.com', password: 'password' })
    
    expect(store.loading).toBe(true)
    
    resolveLogin!({
      token: 'mock-token',
      user: { id: 1, email: 'test@example.com', name: 'Test User' }
    })
    
    await loginCall
    expect(store.loading).toBe(false)
  })

  it('should logout and clear state', () => {
    const store = useAuthStore()
    
    // Set some initial state
    store.user = { id: 1, email: 'test@example.com', name: 'Test User' }
    store.token = 'mock-token'
    
    store.logout()
    
    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should persist token to localStorage on login', async () => {
    const mockResponse = {
      token: 'mock-token-123',
      user: { id: 1, email: 'test@example.com', name: 'Test User' }
    }
    
    vi.mocked(authApi.login).mockResolvedValue(mockResponse)
    
    const store = useAuthStore()
    await store.login({ email: 'test@example.com', password: 'password' })
    
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-token-123')
  })

  it('should remove token from localStorage on logout', () => {
    const store = useAuthStore()
    store.logout()
    
    expect(localStorage.removeItem).toHaveBeenCalledWith('token')
  })

  it('should clear error state', () => {
    const store = useAuthStore()
    store.error = 'Some error'
    
    store.clearError()
    
    expect(store.error).toBeNull()
  })
})