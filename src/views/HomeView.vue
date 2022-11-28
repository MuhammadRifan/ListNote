<script lang="ts">
export default {
  name: "HomeView",
};
</script>
<script setup lang="ts">
import SearchField from "@/components/input_field/SearchField.vue";
import Util from "@/util/Utility";

const go = () => {
  Util.goPage("Note");
};
</script>

<template>
  <div class="fixed top-0 w-full max-w-sm p-[15px]">
    <SearchField str-placeholder="Search your notes" />
  </div>
  <div class="h-[76px]" />
  <!-- <div class="border rounded-xl border-slate-100 m-[10px] p-[10px]">
    Content
  </div> -->
  <div
    class="flex flex-col w-full items-center text-center gap-y-[10px] my-[100px] opacity-30"
  >
    <span class="text-5xl material-symbols-outlined">lightbulb</span>
    <span class="text-lg">List you add appear here</span>
  </div>
  <div
    class="fixed bottom-0 w-full max-w-sm p-[25px] flex items-center justify-end"
  >
    <span
      class="text-6xl cursor-pointer opacity-70 material-symbols-outlined"
      @click="go()"
    >
      add_circle
    </span>
  </div>
</template>
