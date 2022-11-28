<script lang="ts">
export default {
  name: "MainLayout",
};
</script>
<script setup lang="ts"></script>
<template>
  <div
    class="container max-w-sm min-h-screen mx-auto !overflow-hidden bg-slate-700 text-slate-200"
  >
    <slot></slot>
  </div>
</template>
