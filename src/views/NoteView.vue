<script lang="ts">
export default {
  name: "NoteView",
};
</script>
<script setup lang="ts">
import TextField from "@/components/input_field/TextField.vue";
import Util from "@/util/Utility";
</script>
<template>
  <div
    class="fixed flex items-center p-[15px] w-full max-w-sm border-b gap-x-[10px]"
  >
    <span
      class="cursor-pointer material-symbols-outlined text-slate-200"
      @click="Util.goBack()"
    >
      arrow_back_ios_new
    </span>
    <span
      class="overflow-hidden text-center cursor-pointer opacity-80 grow whitespace-nowrap"
    >
      AAAAAAAAAAAAAAAAAAAAAAAAAAA
    </span>
    <span class="material-symbols-outlined text-slate-200">push_pin</span>
  </div>
  <div class="h-[54px]" />
  <div id="lists">
    <ul class="list-disc list-inside py-[10px] px-[15px]">
      <li>test</li>
      <div class="flex flex-row">
        <li></li>
        <TextField :b-border="false" :b-simple="true" />
      </div>
    </ul>
    <div
      class="border border-slate-300 w-max pl-[15px] pr-[20px] py-[5px] rounded-full mx-auto mt-[10px] flex items-center gap-x-[5px]"
    >
      <span class="material-symbols-outlined">add</span>
      Add List
    </div>
  </div>
</template>
