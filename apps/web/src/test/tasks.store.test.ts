import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTasksStore } from '../stores/tasks'
import { tasksApi } from '../api/tasks'

// Mock the tasks API
vi.mock('../api/tasks')

describe('Tasks Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

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

  const mockApiResponse = {
    data: [mockTask],
    meta: {
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1
    }
  }

  it('should initialize with default state', () => {
    const store = useTasksStore()
    
    expect(store.tasks).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.filters).toEqual({})
    expect(store.sort).toEqual({ field: 'createdAt', order: 'desc' })
    expect(store.pagination.page).toBe(1)
    expect(store.pagination.limit).toBe(10)
  })

  it('should fetch tasks successfully', async () => {
    vi.mocked(tasksApi.getTasks).mockResolvedValue(mockApiResponse)
    
    const store = useTasksStore()
    await store.fetchTasks()
    
    expect(store.tasks).toEqual([mockTask])
    expect(store.pagination).toEqual(mockApiResponse.meta)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should handle fetch tasks error', async () => {
    const mockError = new Error('Failed to fetch tasks')
    vi.mocked(tasksApi.getTasks).mockRejectedValue(mockError)
    
    const store = useTasksStore()
    
    try {
      await store.fetchTasks()
    } catch (error) {
      // Expected to throw
    }
    
    expect(store.tasks).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBe('Failed to fetch tasks')
  })

  it('should create task successfully', async () => {
    const newTask = {
      title: 'New Task',
      description: 'New Description',
      status: 'pending' as const,
      priority: 'high' as const,
      dueDate: '2024-12-31'
    }
    
    const createdTask = { ...mockTask, ...newTask, id: 2 }
    vi.mocked(tasksApi.createTask).mockResolvedValue(createdTask)
    vi.mocked(tasksApi.getTasks).mockResolvedValue({
      ...mockApiResponse,
      data: [mockTask, createdTask]
    })
    
    const store = useTasksStore()
    store.tasks = [mockTask] // Set initial state
    
    const result = await store.createTask(newTask)
    
    expect(result).toEqual(createdTask)
    expect(tasksApi.createTask).toHaveBeenCalledWith(newTask)
    expect(tasksApi.getTasks).toHaveBeenCalled()
  })

  it('should update task successfully', async () => {
    const updateData = { id: 1, title: 'Updated Task' }
    const updatedTask = { ...mockTask, title: 'Updated Task' }
    vi.mocked(tasksApi.updateTask).mockResolvedValue(updatedTask)
    vi.mocked(tasksApi.getTasks).mockResolvedValue({
      ...mockApiResponse,
      data: [updatedTask]
    })
    
    const store = useTasksStore()
    store.tasks = [mockTask] // Set initial state
    
    const result = await store.updateTask(updateData)
    
    expect(result).toEqual(updatedTask)
    expect(tasksApi.updateTask).toHaveBeenCalledWith(1, updateData)
    expect(tasksApi.getTasks).toHaveBeenCalled()
  })

  it('should delete task successfully', async () => {
    vi.mocked(tasksApi.deleteTask).mockResolvedValue(undefined)
    vi.mocked(tasksApi.getTasks).mockResolvedValue({
      ...mockApiResponse,
      data: []
    })
    
    const store = useTasksStore()
    store.tasks = [mockTask] // Set initial state
    
    await store.deleteTask(1)
    
    expect(tasksApi.deleteTask).toHaveBeenCalledWith(1)
    expect(tasksApi.getTasks).toHaveBeenCalled()
  })

  it('should set filters', () => {
    const store = useTasksStore()
    const newFilters = { status: 'completed', priority: 'high' }
    
    store.setFilters(newFilters)
    
    expect(store.filters).toEqual(newFilters)
    expect(store.pagination.page).toBe(1) // Should reset to first page
  })

  it('should set sort', () => {
    const store = useTasksStore()
    
    store.setSort('title', 'asc')
    
    expect(store.sort).toEqual({ field: 'title', order: 'asc' })
    expect(store.pagination.page).toBe(1) // Should reset to first page
  })

  it('should set current page', () => {
    const store = useTasksStore()
    
    store.setPage(2)
    
    expect(store.pagination.page).toBe(2)
  })

  it('should clear error', () => {
    const store = useTasksStore()
    store.error = 'Some error'
    
    store.clearError()
    
    expect(store.error).toBeNull()
  })

  it('should reset store to initial state', () => {
    const store = useTasksStore()
    
    // Set some state
    store.tasks = [mockTask]
    store.filters = { status: 'completed' }
    store.error = 'Some error'
    
    store.reset()
    
    expect(store.tasks).toEqual([])
    expect(store.filters).toEqual({})
    expect(store.sort).toEqual({ field: 'createdAt', order: 'desc' })
    expect(store.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    })
    expect(store.error).toBeNull()
  })
})