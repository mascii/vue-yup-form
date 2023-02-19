<script setup lang="ts">
defineProps({
  error: {
    type: Error,
    required: false,
  },
});
</script>

<template>
  <span v-if="error">{{ error.message }}</span>
</template>
