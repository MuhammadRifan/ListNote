<script lang="ts">
export default {
  name: "HomeView",
};
</script>
<script setup lang="ts">
import SearchField from "@/components/input_field/SearchField.vue";
import { useListStore, type NoteStore } from "@/store/ListStore";
import { ePage } from "@/util/enum";
import Utility from "@/util/utility";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const listStore = useListStore();

const limitNote = (notes: NoteStore[]) => {
  const limit = ref(3);
  const temp = [];

  for (let i = 0; i < notes.length; i++) {
    if (i < limit.value) {
      temp.push(notes[i]);
    } else continue;
  }

  return temp;
};

const goNote = (id?: number) => {
  Utility.goPage(ePage.eNote, router);
  if (id === undefined) listStore.idActive = listStore.getLastID;
  else listStore.idActive = id;
};
</script>

<template>
  <div class="fixed top-0 w-full max-w-sm p-[15px]">
    <SearchField str-placeholder="Search your notes" />
  </div>
  <div class="h-[76px]" />
  <section v-if="listStore.data.length > 0">
    <div
      v-if="listStore.countPinned > 0"
      id="pinned"
      class="pt-[10px] pb-[15px]"
    >
      <div class="text-sm mx-[15px]">Pinned</div>
      <div
        v-for="list in listStore.data.filter((it) => it.pin == true)"
        :key="list.id"
        class="border rounded-2xl border-slate-100 mx-[15px] mt-[10px] p-[10px] cursor-pointer"
        @click="goNote(list.id)"
      >
        <div class="font-semibold">{{ list.title }}</div>
        <ul v-if="list.note.length > 0" class="list-disc py-[5px] px-[15px]">
          <li v-for="note in limitNote(list.note)" :key="note.id">
            <div class="truncate">
              {{ note.note }}
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div
      v-if="listStore.countOther > 0"
      id="other"
      :class="listStore.countPinned > 0 ? 'pt-[10px]' : ''"
    >
      <div v-if="listStore.countPinned > 0" class="text-sm mx-[15px]">
        Other
      </div>
      <div
        v-for="list in listStore.data.filter((it) => it.pin == false)"
        :key="list.id"
        class="border rounded-2xl border-slate-100 mx-[15px] mt-[10px] p-[10px] cursor-pointer"
        @click="goNote(list.id)"
      >
        <div class="font-semibold">{{ list.title }}</div>
        <ul v-if="list.note.length > 0" class="list-disc py-[5px] px-[15px]">
          <li v-for="note in limitNote(list.note)" :key="note.id">
            <div class="truncate">
              {{ note.note }}
            </div>
          </li>
          <div v-if="list.note.length > 3">...</div>
        </ul>
      </div>
    </div>
  </section>
  <section
    v-else
    class="flex flex-col w-full items-center text-center gap-y-[10px] my-[100px] opacity-30"
  >
    <span class="text-5xl material-symbols-outlined">lightbulb</span>
    <span class="text-lg">List you add appear here</span>
  </section>
  <div
    class="fixed bottom-0 w-full max-w-sm p-[25px] flex items-center justify-end"
  >
    <span
      class="text-6xl cursor-pointer opacity-70 material-symbols-outlined"
      @click="goNote()"
    >
      add_circle
    </span>
  </div>
</template>
