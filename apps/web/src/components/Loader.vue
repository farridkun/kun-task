<template>
  <div class="loader">
    <div class="spinner"></div>
    <span v-if="message">{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string
}

defineProps<Props>()
</script>

<style scoped>
.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
}

.loader span {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}
</style>