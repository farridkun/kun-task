<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <div class="logo">
          <h1>Kun Task</h1>
        </div>
        
        <nav class="nav">
          <div class="user-info">
            <span>Welcome, {{ authStore.user?.name }}</span>
            <button @click="handleLogout" class="btn btn-secondary btn-sm">
              Logout
            </button>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTasksStore } from '@/stores/tasks'

const router = useRouter()
const authStore = useAuthStore()
const tasksStore = useTasksStore()

const handleLogout = () => {
  authStore.logout()
  tasksStore.reset()
  router.push('/login')
}
</script>

<style scoped>
.app-header {
  background-color: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) 0;
}

.logo h1 {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
}

.nav {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .user-info {
    flex-direction: column;
    align-items: flex-end;
    gap: var(--spacing-sm);
  }
  
  .logo h1 {
    font-size: var(--font-size-lg);
  }
}
</style>