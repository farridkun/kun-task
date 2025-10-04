<template>
  <div class="filter-bar">
    <div class="filter-section">
      <div class="filter-group">
        <input
          v-model="searchQuery"
          type="text"
          class="form-input"
          placeholder="Search tasks..."
          @input="handleSearchInput"
        />
      </div>
      
      <div class="filter-group">
        <select v-model="statusFilter" class="form-select" @change="handleFiltersChange">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      
      <div class="filter-group">
        <select v-model="priorityFilter" class="form-select" @change="handleFiltersChange">
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      
      <div class="filter-group">
        <button 
          @click="clearFilters" 
          class="btn btn-secondary"
          :disabled="loading"
        >
          Clear Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { TaskFilters } from '@/stores/tasks'

interface Props {
  filters: TaskFilters
  loading: boolean
}

interface Emits {
  (e: 'update-filters', filters: TaskFilters): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const searchQuery = ref('')
const statusFilter = ref('')
const priorityFilter = ref('')

let searchTimeout: number

const handleSearchInput = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    handleFiltersChange()
  }, 300) // Debounce search input
}

const handleFiltersChange = () => {
  const filters: TaskFilters = {}
  
  if (searchQuery.value.trim()) {
    filters.q = searchQuery.value.trim()
  }
  
  if (statusFilter.value) {
    filters.status = statusFilter.value
  }
  
  if (priorityFilter.value) {
    filters.priority = priorityFilter.value
  }
  
  emit('update-filters', filters)
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  priorityFilter.value = ''
  emit('update-filters', {})
}

// Initialize filters from props
onMounted(() => {
  searchQuery.value = props.filters.q || ''
  statusFilter.value = props.filters.status || ''
  priorityFilter.value = props.filters.priority || ''
})

// Watch for external filter changes
watch(() => props.filters, (newFilters) => {
  searchQuery.value = newFilters.q || ''
  statusFilter.value = newFilters.status || ''
  priorityFilter.value = newFilters.priority || ''
}, { deep: true })
</script>

<style scoped>
.filter-bar {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-lg);
  background-color: var(--color-bg-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.filter-section {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: var(--spacing-md);
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .filter-section {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
}

@media (max-width: 1024px) and (min-width: 769px) {
  .filter-section {
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
  }
}
</style>