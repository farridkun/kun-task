<template>
  <Transition name="toast" appear>
    <div 
      v-if="show"
      class="toast"
      :class="`toast-${type}`"
    >
      <div class="toast-content">
        <span>{{ message }}</span>
        <button @click="$emit('close')" class="toast-close">
          ×
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  type: 'success' | 'error'
  message: string
  duration?: number
}

interface Emits {
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  duration: 3000
})

const emit = defineEmits<Emits>()
const show = ref(true)

onMounted(() => {
  if (props.duration > 0) {
    setTimeout(() => {
      emit('close')
    }, props.duration)
  }
})
</script>

<style scoped>
.toast {
  position: fixed;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  min-width: 300px;
  max-width: 500px;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
}

.toast-success {
  background-color: var(--color-success);
  color: white;
}

.toast-error {
  background-color: var(--color-danger);
  color: white;
}

.toast-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
}

.toast-close {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color var(--transition-fast);
}

.toast-close:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@media (max-width: 768px) {
  .toast {
    left: var(--spacing-md);
    right: var(--spacing-md);
    top: var(--spacing-md);
    min-width: auto;
  }
  
  .toast-enter-from,
  .toast-leave-to {
    transform: translateY(-100%);
  }
}
</style>