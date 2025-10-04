<template>
  <div v-if="pagination.totalPages > 1" class="pagination">
    <div class="pagination-info">
      Showing {{ startIndex }} to {{ endIndex }} of {{ pagination.total }} tasks
    </div>
    
    <div class="pagination-controls">
      <button
        @click="goToPage(1)"
        class="btn btn-secondary btn-sm"
        :disabled="pagination.page === 1"
      >
        First
      </button>
      
      <button
        @click="goToPage(pagination.page - 1)"
        class="btn btn-secondary btn-sm"
        :disabled="pagination.page === 1"
      >
        Previous
      </button>
      
      <div class="page-numbers">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="typeof page === 'number' ? goToPage(page) : null"
          class="btn btn-sm"
          :class="page === pagination.page ? 'btn-primary' : 'btn-secondary'"
          :disabled="typeof page !== 'number'"
        >
          {{ page }}
        </button>
      </div>
      
      <button
        @click="goToPage(pagination.page + 1)"
        class="btn btn-secondary btn-sm"
        :disabled="pagination.page === pagination.totalPages"
      >
        Next
      </button>
      
      <button
        @click="goToPage(pagination.totalPages)"
        class="btn btn-secondary btn-sm"
        :disabled="pagination.page === pagination.totalPages"
      >
        Last
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TaskPagination } from '@/stores/tasks'

interface Props {
  pagination: TaskPagination
}

interface Emits {
  (e: 'page-change', page: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const startIndex = computed(() => {
  return (props.pagination.page - 1) * props.pagination.limit + 1
})

const endIndex = computed(() => {
  return Math.min(
    props.pagination.page * props.pagination.limit,
    props.pagination.total
  )
})

const visiblePages = computed(() => {
  const current = props.pagination.page
  const total = props.pagination.totalPages
  const pages = []
  
  // Always show first page
  if (current > 3) {
    pages.push(1)
    if (current > 4) pages.push('...')
  }
  
  // Show pages around current
  for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
    pages.push(i)
  }
  
  // Always show last page
  if (current < total - 2) {
    if (current < total - 3) pages.push('...')
    pages.push(total)
  }
  
  return pages.filter((page, index, arr) => arr.indexOf(page) === index)
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.pagination.totalPages) {
    emit('page-change', page)
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
  background-color: var(--color-bg-primary);
}

.pagination-info {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.page-numbers {
  display: flex;
  gap: var(--spacing-xs);
}

@media (max-width: 768px) {
  .pagination {
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .pagination-controls {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .page-numbers {
    order: -1;
  }
}
</style>