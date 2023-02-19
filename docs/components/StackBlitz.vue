<script setup lang="ts">
import type { PropType } from "vue";

const props = defineProps({
  repoPath: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    default: "src/App.vue",
  },
  view: {
    type: String as PropType<"editor" | "preview" | "">,
    default: "",
  },
  resizable: {
    type: Boolean,
    default: true,
  },
});

const src = `https://stackblitz.com/github/${props.repoPath}?embed=1${
  props.file ? `&file=${encodeURIComponent(props.file)}` : ""
}&theme=dark&view=${props.view}`;
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
