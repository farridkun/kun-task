import { http } from './http'

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

export interface TasksQuery {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
  status?: string
  priority?: string
  q?: string
}

export interface TasksResponse {
  data: Task[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface CreateTaskData {
  title: string
  description?: string
  status?: Task['status']
  priority?: Task['priority']
  dueDate?: string
}

export interface UpdateTaskData extends Partial<CreateTaskData> {}

export const tasksApi = {
  async getTasks(query: TasksQuery = {}): Promise<TasksResponse> {
    const response = await http.get('/tasks', { params: query })
    return response.data
  },

  async createTask(data: CreateTaskData): Promise<Task> {
    const response = await http.post('/tasks', data)
    return response.data
  },

  async updateTask(id: number, data: UpdateTaskData): Promise<Task> {
    const response = await http.put(`/tasks/${id}`, data)
    return response.data
  },

  async deleteTask(id: number): Promise<void> {
    await http.delete(`/tasks/${id}`)
  }
}