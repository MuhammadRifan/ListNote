<script lang="ts">
export default {
  name: "App",
};
</script>
<script setup lang="ts">
import { computed, type ComputedRef } from "vue";
import { RouterView, useRoute } from "vue-router";
// import MainLayout from "./layouts/MainLayout.vue";

const route = useRoute();
const layout: ComputedRef<string> = computed<string>(
  () => (route.meta.layout as string) ?? "div"
);
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
