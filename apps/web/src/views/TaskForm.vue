<template>
  <div class="task-form">
    <div class="form-header">
      <h2>{{ task ? 'Edit Task' : 'Create New Task' }}</h2>
    </div>
    
    <form @submit.prevent="handleSubmit" class="form-body">
      <div class="form-group">
        <label for="title" class="form-label">Title *</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          class="form-input"
          placeholder="Enter task title"
          required
        />
      </div>

      <div class="form-group">
        <label for="description" class="form-label">Description</label>
        <textarea
          id="description"
          v-model="form.description"
          class="form-textarea"
          placeholder="Enter task description"
        ></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="status" class="form-label">Status</label>
          <select id="status" v-model="form.status" class="form-select">
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div class="form-group">
          <label for="priority" class="form-label">Priority</label>
          <select id="priority" v-model="form.priority" class="form-select">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="dueDate" class="form-label">Due Date</label>
        <input
          id="dueDate"
          v-model="form.dueDate"
          type="datetime-local"
          class="form-input"
        />
      </div>

      <div class="form-actions">
        <button type="button" @click="$emit('cancel')" class="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue'
import type { Task } from '@/stores/tasks'

interface Props {
  task?: Task | null
}

interface Emits {
  (e: 'save', data: any): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = ref(false)

const form = reactive({
  title: '',
  description: '',
  status: 'pending' as 'pending' | 'in-progress' | 'completed',
  priority: 'medium' as 'low' | 'medium' | 'high',
  dueDate: ''
})

const formatDateForInput = (isoString: string) => {
  const date = new Date(isoString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

const handleSubmit = async () => {
  loading.value = true
  
  const submitData = {
    title: form.title.trim(),
    description: form.description.trim(),
    status: form.status,
    priority: form.priority,
    dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined
  }

  try {
    emit('save', submitData)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (props.task) {
    form.title = props.task.title
    form.description = props.task.description
    form.status = props.task.status
    form.priority = props.task.priority
    form.dueDate = formatDateForInput(props.task.dueDate)
  } else {
    // Set default due date to 1 week from now
    const defaultDate = new Date()
    defaultDate.setDate(defaultDate.getDate() + 7)
    form.dueDate = formatDateForInput(defaultDate.toISOString())
  }
})
</script>

<style scoped>
.task-form {
  width: 100%;
}

.form-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.form-header h2 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-text-primary);
}

.form-body {
  padding: var(--spacing-lg);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-header,
  .form-body {
    padding: var(--spacing-md);
  }
}
</style>