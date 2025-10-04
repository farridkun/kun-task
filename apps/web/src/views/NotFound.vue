<template>
  <div class="not-found">
    <div class="container">
      <div class="content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist.</p>
        <router-link to="/tasks" class="btn btn-primary">
          Go to Tasks
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed for this component
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-secondary);
}

.content {
  text-align: center;
  padding: var(--spacing-2xl);
}

.content h1 {
  font-size: 6rem;
  font-weight: 900;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
  line-height: 1;
}

.content h2 {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.content p {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
}

@media (max-width: 768px) {
  .content h1 {
    font-size: 4rem;
  }
  
  .content h2 {
    font-size: var(--font-size-xl);
  }
  
  .content {
    padding: var(--spacing-lg);
  }
}
</style>