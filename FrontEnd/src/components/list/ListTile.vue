<script lang="ts">
export default {
  name: "ListTile",
};
</script>
<script setup lang="ts">
defineProps({
  strClassTitle: {
    type: String,
  },
  strClassBody: {
    type: String,
  },
});
</script>
<template>
  <div
    class="flex items-center gap-x-[15px] p-[15px] cursor-pointer"
    :class="strClassBody"
  >
    <slot name="leading" />
    <div class="grow" :class="strClassTitle">
      <slot />
    </div>
    <slot name="trailing" />
  </div>
</template>
