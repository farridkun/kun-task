<template>
  <div class="table-container">
    <table class="table">
      <thead>
        <tr>
          <th 
            @click="handleSort('title')"
            class="sortable"
            :class="getSortClass('title')"
          >
            Title
          </th>
          <th 
            @click="handleSort('status')"
            class="sortable"
            :class="getSortClass('status')"
          >
            Status
          </th>
          <th 
            @click="handleSort('priority')"
            class="sortable"
            :class="getSortClass('priority')"
          >
            Priority
          </th>
          <th 
            @click="handleSort('dueDate')"
            class="sortable"
            :class="getSortClass('dueDate')"
          >
            Due Date
          </th>
          <th 
            @click="handleSort('createdAt')"
            class="sortable"
            :class="getSortClass('createdAt')"
          >
            Created
          </th>
          <th class="actions-column">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in tasks" :key="task.id">
          <td>
            <div class="task-title">
              <strong>{{ task.title }}</strong>
              <div v-if="task.description" class="task-description">
                {{ task.description }}
              </div>
            </div>
          </td>
          <td>
            <span class="badge" :class="`badge-${task.status}`">
              {{ formatStatus(task.status) }}
            </span>
          </td>
          <td>
            <span class="badge" :class="`badge-${task.priority}`">
              {{ formatPriority(task.priority) }}
            </span>
          </td>
          <td>{{ formatDate(task.dueDate) }}</td>
          <td>{{ formatDate(task.createdAt) }}</td>
          <td>
            <div class="actions">
              <button 
                @click="$emit('edit', task)" 
                class="btn btn-secondary btn-sm"
                title="Edit task"
              >
                Edit
              </button>
              <button 
                @click="$emit('delete', task)" 
                class="btn btn-danger btn-sm"
                title="Delete task"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div v-if="loading" class="table-loading">
      <Loader />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task, TaskSort } from '@/stores/tasks'
import Loader from './Loader.vue'

interface Props {
  tasks: Task[]
  loading: boolean
  sort: TaskSort
}

interface Emits {
  (e: 'sort', field: string, order: 'asc' | 'desc'): void
  (e: 'edit', task: Task): void
  (e: 'delete', task: Task): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleSort = (field: string) => {
  const currentOrder = props.sort.field === field ? props.sort.order : 'desc'
  const newOrder = currentOrder === 'asc' ? 'desc' : 'asc'
  emit('sort', field, newOrder)
}

const getSortClass = (field: string) => {
  if (props.sort.field !== field) return ''
  return props.sort.order === 'asc' ? 'sort-asc' : 'sort-desc'
}

const formatStatus = (status: string) => {
  return status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatPriority = (priority: string) => {
  return priority.charAt(0).toUpperCase() + priority.slice(1)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}
</script>

<style scoped>
.table-container {
  position: relative;
  overflow-x: auto;
}

.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
  transition: background-color var(--transition-fast);
}

.sortable:hover {
  background-color: var(--color-bg-secondary);
}

.sortable::after {
  content: '';
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  opacity: 0.3;
}

.sort-asc::after {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid var(--color-text-secondary);
  opacity: 1;
}

.sort-desc::after {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid var(--color-text-secondary);
  opacity: 1;
}

.task-title strong {
  color: var(--color-text-primary);
}

.task-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-xs);
  line-height: 1.4;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.actions {
  display: flex;
  gap: var(--spacing-sm);
}

.actions-column {
  width: 140px;
  min-width: 140px;
}

.table-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .task-description {
    max-width: 200px;
  }
  
  .actions {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  
  .actions-column {
    width: 80px;
    min-width: 80px;
  }
  
  .btn {
    padding: var(--spacing-xs);
    font-size: var(--font-size-xs);
  }
}
</style>