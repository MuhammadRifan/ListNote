<script lang="ts">
export default {
  name: "IconLoading",
};
</script>
<script setup lang="ts">
defineProps({
  strCircleWidth: {
    type: String,
    required: false,
    default: "2px",
  },
  strSize: {
    type: String,
    default: "14px",
  },
  strClass: {
    type: String,
    default: "",
  },
});
</script>
<template>
  <div
    :style="{ width: strSize, height: strSize, borderWidth: strCircleWidth }"
    :class="`rounded-full loading border-t-slate-600 border-slate-400 ${strClass}`"
  />
</template>

<style scoped>
.loading {
  animation: spin 1s infinite cubic-bezier(0.55, 0.15, 0.45, 0.85);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
