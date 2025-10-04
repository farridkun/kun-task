<template>
  <div class="tasks-layout">
    <AppHeader />
    
    <main class="main-content">
      <div class="container">
        <div class="tasks-header">
          <h1>Task Management</h1>
          <button @click="showCreateModal = true" class="btn btn-primary">
            Create Task
          </button>
        </div>

        <FilterBar
          :filters="tasksStore.filters"
          :loading="tasksStore.loading"
          @update-filters="handleFiltersUpdate"
        />

        <div v-if="tasksStore.loading && tasksStore.tasks.length === 0" class="loading">
          <Loader />
        </div>

        <div v-else-if="tasksStore.error" class="error-message">
          {{ tasksStore.error }}
          <button @click="tasksStore.fetchTasks()" class="btn btn-secondary btn-sm" style="margin-left: 1rem;">
            Retry
          </button>
        </div>

        <div v-else-if="tasksStore.tasks.length === 0" class="empty-state">
          <h2>No tasks found</h2>
          <p>Create your first task to get started</p>
          <button @click="showCreateModal = true" class="btn btn-primary">
            Create Task
          </button>
        </div>

        <div v-else class="tasks-content">
          <AppTable
            :tasks="tasksStore.tasks"
            :loading="tasksStore.loading"
            :sort="tasksStore.sort"
            @sort="handleSort"
            @edit="handleEdit"
            @delete="handleDelete"
          />

          <PaginationBar
            :pagination="tasksStore.pagination"
            @page-change="handlePageChange"
          />
        </div>
      </div>
    </main>

    <!-- Task Form Modal -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <TaskForm
          :task="editingTask"
          @save="handleSave"
          @cancel="closeModal"
        />
      </div>
    </div>

    <Toast
      v-if="toast.show"
      :type="toast.type"
      :message="toast.message"
      @close="toast.show = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useTasksStore, type Task } from '@/stores/tasks'
import AppHeader from '@/components/AppHeader.vue'
import AppTable from '@/components/AppTable.vue'
import FilterBar from '@/components/FilterBar.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import TaskForm from '@/views/TaskForm.vue'
import Loader from '@/components/Loader.vue'
import Toast from '@/components/Toast.vue'

const tasksStore = useTasksStore()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingTask = ref<Task | null>(null)

const toast = reactive({
  show: false,
  type: 'success' as 'success' | 'error',
  message: ''
})

const showToast = (type: 'success' | 'error', message: string) => {
  toast.type = type
  toast.message = message
  toast.show = true
  setTimeout(() => {
    toast.show = false
  }, 3000)
}

const handleFiltersUpdate = (filters: any) => {
  tasksStore.setFilters(filters)
  tasksStore.fetchTasks()
}

const handleSort = (field: string, order: 'asc' | 'desc') => {
  tasksStore.setSort(field, order)
  tasksStore.fetchTasks()
}

const handlePageChange = (page: number) => {
  tasksStore.setPage(page)
  tasksStore.fetchTasks()
}

const handleEdit = (task: Task) => {
  editingTask.value = task
  showEditModal.value = true
}

const handleDelete = async (task: Task) => {
  if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
    try {
      await tasksStore.deleteTask(task.id)
      showToast('success', 'Task deleted successfully')
    } catch (error) {
      showToast('error', 'Failed to delete task')
    }
  }
}

const handleSave = async (taskData: any) => {
  try {
    if (editingTask.value) {
      await tasksStore.updateTask({ ...taskData, id: editingTask.value.id })
      showToast('success', 'Task updated successfully')
    } else {
      await tasksStore.createTask(taskData)
      showToast('success', 'Task created successfully')
    }
    closeModal()
  } catch (error) {
    showToast('error', editingTask.value ? 'Failed to update task' : 'Failed to create task')
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingTask.value = null
}

onMounted(() => {
  tasksStore.fetchTasks()
})

// Watch for changes and refetch if needed
watch(() => tasksStore.error, (error) => {
  if (error) {
    showToast('error', error)
    tasksStore.clearError()
  }
})
</script>

<style scoped>
.tasks-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: var(--spacing-xl) 0;
}

.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.tasks-header h1 {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-text-primary);
}

.tasks-content {
  background-color: var(--color-bg-primary);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-2xl);
  background-color: var(--color-bg-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.empty-state h2 {
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
  font-size: var(--font-size-xl);
}

.empty-state p {
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-secondary);
}

.error-message {
  display: flex;
  align-items: center;
  padding: var(--spacing-lg);
  background-color: #fecaca;
  color: #991b1b;
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-lg);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
}

.modal-content {
  background-color: var(--color-bg-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .tasks-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }

  .tasks-header h1 {
    font-size: var(--font-size-2xl);
  }

  .modal-overlay {
    padding: var(--spacing-md);
  }
}
</style>