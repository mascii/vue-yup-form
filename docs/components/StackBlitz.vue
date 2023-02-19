<script setup lang="ts">
const props = defineProps({
  repoPath: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    default: "src/App.vue",
  },
  resizable: {
    type: Boolean,
    default: true,
  },
});

const src = `https://stackblitz.com/github/${props.repoPath}?embed=1${
  props.file ? `&file=${encodeURIComponent(props.file)}` : ""
}&theme=dark&view=preview`;
</script>

<template>
  <iframe :src="src" :class="{ resizable }"></iframe>
</template>

<style scoped>
iframe {
  width: 100%;
  min-height: 500px;
  border: 0;
  background: hsl(220 10% 20%);
  padding: 0 1px;
  overflow: hidden;
}

.resizable {
  resize: vertical;
  padding-bottom: 10px;
}
</style>
