<script lang="ts">
export default {
  name: "HomeView",
};
</script>
<script setup lang="ts">
import SearchField from "@/components/input_field/SearchField.vue";
import TextField from "@/components/input_field/TextField.vue";
import ModalDialog from "@/components/modal/ModalDialog.vue";
import { useListStore, type NoteStore } from "@/store/ListStore";
import { ePage } from "@/util/NoteEnum";
import NoteUtil from "@/util/NoteUtil";
import { onMounted, ref } from "vue";
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
  NoteUtil.goPage(ePage.eNote, router);
  if (id === undefined) listStore.idActive = listStore.getLastID;
  else listStore.idActive = id;
};

const signinModal = ref<InstanceType<typeof ModalDialog> | null>(null);
const signupModal = ref<InstanceType<typeof ModalDialog> | null>(null);
const seePassword = ref(false);

onMounted(() => {
  signinModal.value?.show();
});
</script>

<template>
  <div
    class="fixed top-0 w-full max-w-[600px] p-[15px] flex items-center gap-x-[15px]"
  >
    <SearchField str-placeholder="Search your notes" class="grow" />
    <div
      class="w-[46px] h-[46px] rounded-full border border-slate-100 cursor-pointer flex items-center"
      @click="signinModal?.show()"
    >
      <span class="mx-auto text-4xl font-thin material-symbols-outlined">
        person
      </span>
    </div>
  </div>
  <section v-if="listStore.data.length > 0" class="mt-[80px]">
    <div v-if="listStore.countPinned > 0" id="pinned" class="pb-[15px]">
      <div class="text-sm mx-[15px]">Pinned</div>
      <div
        v-for="list in listStore.data.filter((it) => it.pin == true)"
        :key="list.id"
        class="border rounded-2xl border-slate-100 mx-[15px] mt-[15px] p-[10px] cursor-pointer"
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
        class="border rounded-2xl border-slate-100 mx-[15px] mt-[15px] p-[10px] cursor-pointer"
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
    class="fixed bottom-0 w-full max-w-[600px] p-[25px] flex items-center justify-end"
  >
    <span
      class="text-6xl cursor-pointer opacity-70 material-symbols-outlined"
      @click="goNote()"
    >
      add_circle
    </span>
  </div>

  <ModalDialog ref="signinModal" str-title="Sign In">
    <div>
      <div class="p-[10px] flex flex-col gap-y-[10px]">
        <TextField
          str-placeholder="Email"
          str-class="border-slate-400 rounded-xl"
        />
        <TextField
          str-placeholder="Password"
          str-class="border-slate-400 rounded-xl"
          :str-type="seePassword ? 'text' : 'password'"
        >
          <template v-slot:suffix>
            <span
              class="cursor-pointer material-symbols-outlined filled text-slate-500"
              @click="seePassword = !seePassword"
            >
              {{ seePassword ? "visibility" : "visibility_off" }}
            </span>
          </template>
        </TextField>
      </div>
      <!-- <div class="invisible w-full text-sm text-center">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </div> -->
      <div
        class="flex mt-[10px] border-t border-slate-400 divide-x divide-slate-400 items-center"
      >
        <div
          class="w-full text-center p-[13px] text-slate-700 text-lg tracking-wide cursor-pointer hover:bg-slate-500/20"
          @click="
            {
              signinModal?.hide();
              signupModal?.show();
            }
          "
        >
          Sign Up
        </div>
        <div
          class="w-full text-center p-[13px] text-green-600 text-lg font-semibold tracking-wide cursor-pointer hover:bg-green-300/20"
        >
          Sign In
        </div>
      </div>
    </div>
  </ModalDialog>

  <ModalDialog ref="signupModal" str-title="Sign Up">
    <div>
      <div class="p-[10px] flex flex-col gap-y-[10px]">
        <TextField
          str-placeholder="Email"
          str-class="border-slate-400 rounded-xl"
        />
        <TextField
          str-placeholder="Password"
          str-class="border-slate-400 rounded-xl"
          :str-type="seePassword ? 'text' : 'password'"
        >
          <template v-slot:suffix>
            <span
              class="cursor-pointer material-symbols-outlined filled text-slate-500"
              @click="seePassword = !seePassword"
            >
              {{ seePassword ? "visibility" : "visibility_off" }}
            </span>
          </template>
        </TextField>
        <TextField
          str-placeholder="Confirm Password"
          str-class="border-slate-400 rounded-xl"
          :str-type="seePassword ? 'text' : 'password'"
        >
          <template v-slot:suffix>
            <span
              class="cursor-pointer material-symbols-outlined filled text-slate-500"
              @click="seePassword = !seePassword"
            >
              {{ seePassword ? "visibility" : "visibility_off" }}
            </span>
          </template>
        </TextField>
      </div>
      <div
        class="flex mt-[10px] border-t border-slate-400 divide-x divide-slate-400 items-center"
      >
        <div
          class="w-full text-center p-[13px] text-slate-700 text-lg tracking-wide cursor-pointer hover:bg-slate-500/20"
          @click="
            {
              signupModal?.hide();
              signinModal?.show();
            }
          "
        >
          Sign In
        </div>
        <div
          class="w-full text-center p-[13px] text-blue-500 text-lg font-semibold tracking-wide cursor-pointer hover:bg-blue-300/20"
        >
          Sign Up
        </div>
      </div>
    </div>
  </ModalDialog>
</template>
