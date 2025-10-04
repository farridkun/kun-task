<template>
  <div class="login-container">
    <div class="login-card card">
      <div class="card-header">
        <h1>Login to Kun Task</h1>
        <p>Enter your credentials to access your tasks</p>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="form-input"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              class="form-input"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            style="width: 100%"
            :disabled="authStore.loading"
          >
            <span v-if="authStore.loading">Signing in...</span>
            <span v-else>Sign In</span>
          </button>
        </form>

        <div v-if="authStore.error" class="error-message">
          {{ authStore.error }}
        </div>

        <div class="demo-credentials">
          <h3>Demo Credentials:</h3>
          <p><strong>Admin:</strong> admin@example.com / admin123</p>
          <p><strong>User:</strong> user@example.com / user123</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: ''
})

const handleSubmit = async () => {
  try {
    await authStore.login(form)
    router.push('/tasks')
  } catch (error) {
    // Error is handled by the store
  }
}

onMounted(() => {
  authStore.clearError()
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.card-header h1 {
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
  font-size: var(--font-size-2xl);
  font-weight: 700;
}

.card-header p {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.error-message {
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: #fecaca;
  color: #991b1b;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
}

.demo-credentials {
  margin-top: var(--spacing-xl);
  padding: var(--spacing-md);
  background-color: var(--color-bg-tertiary);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
}

.demo-credentials h3 {
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
}

.demo-credentials p {
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .login-container {
    padding: var(--spacing-md);
  }
}
</style>