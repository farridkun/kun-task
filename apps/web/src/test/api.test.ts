import { describe, it, expect, beforeEach, vi } from 'vitest'
import { authApi } from '../api/auth'
import { tasksApi } from '../api/tasks'
import { http } from '../api/http'

// Mock the http client
vi.mock('../api/http')

describe('API Services', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Auth API', () => {
    it('should login with credentials', async () => {
      const mockResponse = {
        data: {
          token: 'mock-token',
          user: { id: 1, email: 'test@example.com', name: 'Test User' }
        }
      }
      
      vi.mocked(http.post).mockResolvedValue(mockResponse)
      
      const credentials = { email: 'test@example.com', password: 'password' }
      const result = await authApi.login(credentials)
      
      expect(result).toEqual(mockResponse.data)
      expect(http.post).toHaveBeenCalledWith('/login', credentials)
    })

    it('should handle login error', async () => {
      const mockError = new Error('Login failed')
      vi.mocked(http.post).mockRejectedValue(mockError)
      
      const credentials = { email: 'invalid@example.com', password: 'wrong' }
      
      await expect(authApi.login(credentials)).rejects.toThrow('Login failed')
    })
  })

  describe('Tasks API', () => {
    const mockTask = {
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      status: 'pending' as const,
      priority: 'medium' as const,
      dueDate: '2024-12-31',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }

    it('should fetch tasks with query parameters', async () => {
      const mockResponse = {
        data: {
          data: [mockTask],
          meta: { page: 1, limit: 10, total: 1, totalPages: 1 }
        }
      }
      
      vi.mocked(http.get).mockResolvedValue(mockResponse)
      
      const query = { page: 1, limit: 10, status: 'pending' }
      const result = await tasksApi.getTasks(query)
      
      expect(result).toEqual(mockResponse.data)
      expect(http.get).toHaveBeenCalledWith('/tasks', { params: query })
    })

    it('should create a new task', async () => {
      const mockResponse = { data: mockTask }
      vi.mocked(http.post).mockResolvedValue(mockResponse)
      
      const taskData = {
        title: 'New Task',
        description: 'New Description',
        status: 'pending' as const,
        priority: 'high' as const,
        dueDate: '2024-12-31'
      }
      
      const result = await tasksApi.createTask(taskData)
      
      expect(result).toEqual(mockTask)
      expect(http.post).toHaveBeenCalledWith('/tasks', taskData)
    })

    it('should update a task', async () => {
      const updatedTask = { ...mockTask, title: 'Updated Task' }
      const mockResponse = { data: updatedTask }
      vi.mocked(http.put).mockResolvedValue(mockResponse)
      
      const updateData = { title: 'Updated Task' }
      const result = await tasksApi.updateTask(1, updateData)
      
      expect(result).toEqual(updatedTask)
      expect(http.put).toHaveBeenCalledWith('/tasks/1', updateData)
    })

    it('should delete a task', async () => {
      vi.mocked(http.delete).mockResolvedValue({ data: null })
      
      await tasksApi.deleteTask(1)
      
      expect(http.delete).toHaveBeenCalledWith('/tasks/1')
    })

    it('should handle API errors', async () => {
      const mockError = {
        response: {
          data: { error: 'Task not found' },
          status: 404
        }
      }
      
      vi.mocked(http.get).mockRejectedValue(mockError)
      
      await expect(tasksApi.getTasks()).rejects.toEqual(mockError)
    })
  })
})