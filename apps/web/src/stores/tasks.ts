import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tasksApi } from '@/api/tasks'

export interface Task {
  id: number
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  createdAt: string
  updatedAt: string
}

export interface TaskFilters {
  status?: string
  priority?: string
  q?: string
}

export interface TaskSort {
  field: string
  order: 'asc' | 'desc'
}

export interface TaskPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface CreateTaskData {
  title: string
  description?: string
  status?: Task['status']
  priority?: Task['priority']
  dueDate?: string
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  id: number
}

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<TaskFilters>({})
  const sort = ref<TaskSort>({ field: 'createdAt', order: 'desc' })
  const pagination = ref<TaskPagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  const fetchTasks = async () => {
    try {
      loading.value = true
      error.value = null

      const response = await tasksApi.getTasks({
        page: pagination.value.page,
        limit: pagination.value.limit,
        sort: sort.value.field,
        order: sort.value.order,
        ...filters.value
      })

      tasks.value = response.data
      pagination.value = response.meta
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch tasks'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createTask = async (data: CreateTaskData) => {
    try {
      const task = await tasksApi.createTask(data)
      await fetchTasks() // Refresh the list
      return task
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to create task'
      throw err
    }
  }

  const updateTask = async (data: UpdateTaskData) => {
    try {
      const task = await tasksApi.updateTask(data.id, data)
      await fetchTasks() // Refresh the list
      return task
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to update task'
      throw err
    }
  }

  const deleteTask = async (id: number) => {
    try {
      await tasksApi.deleteTask(id)
      await fetchTasks() // Refresh the list
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to delete task'
      throw err
    }
  }

  const setFilters = (newFilters: TaskFilters) => {
    filters.value = { ...newFilters }
    pagination.value.page = 1 // Reset to first page
  }

  const setSort = (field: string, order: 'asc' | 'desc') => {
    sort.value = { field, order }
    pagination.value.page = 1 // Reset to first page
  }

  const setPage = (page: number) => {
    pagination.value.page = page
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    tasks.value = []
    filters.value = {}
    sort.value = { field: 'createdAt', order: 'desc' }
    pagination.value = {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    }
    error.value = null
  }

  return {
    tasks,
    loading,
    error,
    filters,
    sort,
    pagination,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    setFilters,
    setSort,
    setPage,
    clearError,
    reset
  }
})