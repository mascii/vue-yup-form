<script setup lang="ts">
defineProps({
  src: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <iframe
    :src="src"
    style="width: 100%; height: 500px; border: 0; overflow: hidden"
    title="vue-yup-form with Vue.Draggable"
    allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  ></iframe>
</template>
