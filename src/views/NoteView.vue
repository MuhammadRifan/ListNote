<script lang="ts">
export default {
  name: "NoteView",
};
</script>
<script setup lang="ts">
import TextField from "@/components/input_field/TextField.vue";
import NoteField from "@/components/input_field/NoteField.vue";
import { useListStore } from "@/store/ListStore";
import { ePage, sortType } from "@/util/enum";
import Utility from "@/util/utility";
import { computed, onMounted, ref, watch, type ComputedRef } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const listStore = useListStore();

const goBack = () => Utility.goPage(ePage.eBack, router);

const dateEdited = ref<Date>();

const pin = ref(false);
const pinned = () => {
  listStore.pin();
  if (listStore.getList != undefined) pin.value = listStore.getList.pin;
};

const titleElement: ComputedRef<HTMLElement | null> = computed(() =>
  document.getElementById("titleElement")
);
const titleField = ref<InstanceType<typeof TextField> | null>(null);

const title = ref("");
const saveTitle = (submit: boolean) => {
  if (submit) titleElement.value?.blur();
  else if (title.value.length > 0) listStore.title(title.value);
};

const noteNewElement: ComputedRef<HTMLElement | null> = computed(() =>
  document.getElementById("noteNewElement")
);
const noteNewField = ref<InstanceType<typeof TextField> | null>(null);

const isFocus = ref(false);
const onClose = ref(false);

const isCreateNew = ref(false);
const newNote = ref("");

const createNewNote = () => {
  isCreateNew.value = true;
  noteNewElement.value?.focus();
};

const saveNewNote = (isSave: boolean) => {
  if (isSave) {
    if (isFocus.value && newNote.value.length > 0) {
      isCreateNew.value = false;
      listStore.addNote(newNote.value);
      newNote.value = "";
    }
    unFocus();
    isFocus.value = false;
  } else {
    isFocus.value = true;
  }
};

const clearNewNote = () => {
  newNote.value = "";
  isFocus.value = false;
  isCreateNew.value = false;
  unFocus();
};

const unFocus = () => {
  noteNewElement.value?.blur();
  noteNewField.value?.updateModelValue("");
};

const sType = ref<sortType>();

const sorting = () => {
  if (sType.value === undefined) return;

  if (sType.value === sortType.sId) {
    sType.value = sortType.sDate;
  } else if (sType.value === sortType.sDate) {
    sType.value = sortType.sChara;
  } else if (sType.value === sortType.sChara) {
    sType.value = sortType.sId;
  }

  listStore.sort(sType.value);
};

const deleteList = () => {
  listStore.deleteList();
  goBack();
};

const bShowTime = ref(false);

const showTime = () => {
  listStore.showTime();
  bShowTime.value = !bShowTime.value;
};

watch(
  () => listStore.getList,
  (list) => {
    if (list != undefined) {
      dateEdited.value = new Date(list.dtEdited);
      sType.value = list.sortType;
    }
  }
);

onMounted(() => {
  const data = listStore.getList;
  if (data != undefined) {
    if (data.title != "") {
      title.value = data.title;
      titleField.value?.updateModelValue(title.value);
    }
    pin.value = data.pin;
    dateEdited.value = new Date(data.dtEdited);
    sType.value = data.sortType;
    bShowTime.value = data.showTime;
  }
});
</script>
<template>
  <div class="fixed flex items-center p-[15px] w-full max-w-sm gap-x-[10px]">
    <span
      class="cursor-pointer material-symbols-outlined text-slate-200"
      @click="goBack()"
    >
      arrow_back_ios_new
    </span>
    <TextField
      v-model="title"
      ref="titleField"
      str-class="grow"
      str-id="titleElement"
      str-placeholder="Title"
      str-class-input="text-center overflow-hidden"
      @focusout="saveTitle(false)"
      @keydown.enter="saveTitle(true)"
      :i-max-length="25"
      :b-border="false"
      :b-simple="true"
    />
    <span
      class="cursor-pointer material-symbols-outlined text-slate-200"
      :class="pin ? 'filled' : ''"
      @click="pinned()"
    >
      push_pin
    </span>
  </div>

  <div class="h-[54px]" />

  <div id="lists">
    <ul class="list-disc list-inside py-[10px] px-[15px]">
      <div
        v-if="
          listStore.getList != undefined && listStore.getList.note.length > 0
        "
      >
        <div v-for="note in listStore.getList.note" :key="note.id">
          <NoteField :id="note.id" :note="note.note" />
          <div
            v-if="bShowTime"
            class="text-xs text-right text-slate-400 py-[1px]"
          >
            {{
              new Date(note.dtEdited).getHours() +
              ":" +
              new Date(note.dtEdited).getMinutes() +
              ", " +
              Utility.month(new Date(note.dtEdited).getMonth(), true) +
              " " +
              new Date(note.dtEdited).getDate() +
              " " +
              new Date(note.dtEdited).getFullYear()
            }}
          </div>
        </div>
      </div>
      <div v-if="isCreateNew" class="flex flex-row">
        <li />
        <div class="flex items-center grow gap-x-[10px]">
          <TextField
            v-model="newNote"
            ref="noteNewField"
            str-id="noteNewElement"
            str-class="grow h-[24px]"
            str-class-input="h-[24px]"
            @focusin="saveNewNote(false)"
            @focusout="onClose ? clearNewNote() : saveNewNote(true)"
            @keydown.enter="saveNewNote(true)"
            :b-simple="true"
            :b-border="false"
            :b-text-area="true"
            :b-auto-height="true"
            :i-max-length="100"
          />
        </div>
        <span
          class="cursor-pointer material-symbols-outlined"
          :class="isFocus ? 'visible' : 'invisible'"
          @mouseenter="onClose = true"
          @mouseout="onClose = false"
        >
          close
        </span>
      </div>
    </ul>
    <div
      v-if="!isCreateNew"
      class="border border-slate-300 w-max pl-[15px] pr-[20px] py-[5px] rounded-full mx-auto flex items-center gap-x-[5px] cursor-pointer"
      @click="createNewNote()"
    >
      <span class="material-symbols-outlined">add</span>
      Add List
    </div>
  </div>

  <div class="h-[54px]" />

  <div
    class="fixed bottom-0 flex items-center p-[15px] w-full max-w-sm gap-x-[10px]"
  >
    <span
      class="cursor-pointer material-symbols-outlined text-slate-200"
      @click="sorting()"
    >
      sort
    </span>
    <span
      class="cursor-pointer material-symbols-outlined text-slate-200"
      @click="showTime()"
    >
      schedule
    </span>
    <div class="text-center grow">
      <span v-if="dateEdited != undefined" class="text-sm">
        Edited
        {{
          Utility.month(dateEdited.getMonth(), true) +
          " " +
          dateEdited.getDate()
        }}
      </span>
    </div>
    <span
      class="cursor-pointer material-symbols-outlined text-slate-200"
      @click="deleteList()"
    >
      delete
    </span>
  </div>
</template>
