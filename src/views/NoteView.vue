<script lang="ts">
export default {
  name: "NoteView",
};
</script>
<script setup lang="ts">
import TextField from "@/components/input_field/TextField.vue";
import NoteField from "@/components/input_field/NoteField.vue";
import { useListStore } from "@/store/ListStore";
import { ePage, sortType } from "@/util/NoteEnum";
import NoteUtil from "@/util/NoteUtil";
import { computed, onMounted, ref, watch, type ComputedRef } from "vue";
import { useRouter } from "vue-router";
import ModalDialog from "@/components/modal/ModalDialog.vue";

const router = useRouter();
const listStore = useListStore();

const goBack = () => NoteUtil.goPage(ePage.eBack, router);

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
      listStore.addNote(newNote.value, noteNewField.value?.height ?? 0);
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

const sortModal = ref<InstanceType<typeof ModalDialog> | null>(null);
const sType = ref<sortType>();

const sorting = (sort: sortType) => {
  listStore.sort(sort);
  sType.value = sort;
  sortModal.value?.hide();
};

const deleteModal = ref<InstanceType<typeof ModalDialog> | null>(null);

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
    if (list != undefined) dateEdited.value = new Date(list.dtEdited);
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
  <div
    class="fixed flex items-center p-[15px] w-full max-w-[600px] gap-x-[10px] bg-slate-700"
    id="header"
  >
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
          <NoteField
            :id="note.id"
            :note="note.note"
            :height="note.height ?? 24"
          />
          <div
            v-if="bShowTime"
            class="text-xs italic pl-[23px] text-slate-400 py-[1px]"
          >
            {{
              NoteUtil.convert2Digit(new Date(note.dtEdited).getHours()) +
              ":" +
              NoteUtil.convert2Digit(new Date(note.dtEdited).getMinutes()) +
              ", " +
              NoteUtil.month(new Date(note.dtEdited).getMonth(), true) +
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
          class="self-center cursor-pointer material-symbols-outlined"
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
    class="fixed bottom-0 flex items-center p-[15px] w-full max-w-[600px] gap-x-[10px] bg-slate-700"
    id="footer"
  >
    <span
      class="cursor-pointer material-symbols-outlined text-slate-200"
      @click="sortModal?.show()"
    >
      sort
    </span>
    <span
      class="cursor-pointer material-symbols-outlined text-slate-200"
      :class="bShowTime ? 'filled' : ''"
      @click="showTime()"
    >
      schedule
    </span>
    <div class="text-center grow">
      <span v-if="dateEdited != undefined" class="text-sm">
        Edited
        {{
          NoteUtil.month(dateEdited.getMonth(), true) +
          " " +
          dateEdited.getDate()
        }}
      </span>
    </div>
    <span
      class="cursor-pointer material-symbols-outlined text-slate-200"
      @click="deleteModal?.show()"
    >
      delete
    </span>
  </div>

  <ModalDialog ref="sortModal" str-title="Sort By">
    <div class="flex flex-col">
      <div
        class="flex justify-between items-center gap-x-[15px] p-[15px] border-t border-slate-400/50 cursor-pointer"
        @click="
          sType === sortType.sDefaultAsc
            ? sorting(sortType.sDefaultDsc)
            : sorting(sortType.sDefaultAsc)
        "
      >
        <div
          :class="
            sType === sortType.sDefaultAsc || sType === sortType.sDefaultDsc
              ? 'font-bold'
              : ''
          "
        >
          Default
        </div>
        <div class="flex items-center">
          <span
            class="text-slate-700 material-symbols-outlined"
            :class="sType === sortType.sDefaultAsc ? '' : 'opacity-30'"
          >
            south
          </span>
          <span
            class="text-slate-700 material-symbols-outlined"
            :class="sType === sortType.sDefaultDsc ? '' : 'opacity-30'"
          >
            north
          </span>
        </div>
      </div>
      <div
        class="flex justify-between items-center gap-x-[15px] p-[15px] border-t border-slate-400/50 cursor-pointer"
        @click="
          sType === sortType.sAlphaAsc
            ? sorting(sortType.sAlphaDsc)
            : sorting(sortType.sAlphaAsc)
        "
      >
        <div
          :class="
            sType === sortType.sAlphaAsc || sType === sortType.sAlphaDsc
              ? 'font-bold'
              : ''
          "
        >
          Alphabet
        </div>
        <div class="flex items-center">
          <span
            class="text-slate-700 material-symbols-outlined"
            :class="sType === sortType.sAlphaAsc ? '' : 'opacity-30'"
          >
            south
          </span>
          <span
            class="text-slate-700 material-symbols-outlined"
            :class="sType === sortType.sAlphaDsc ? '' : 'opacity-30'"
          >
            north
          </span>
        </div>
      </div>
      <div
        class="flex justify-between items-center gap-x-[15px] p-[15px] border-t border-slate-400/50 cursor-pointer"
        @click="
          sType === sortType.sDateAsc
            ? sorting(sortType.sDateDsc)
            : sorting(sortType.sDateAsc)
        "
      >
        <div
          :class="
            sType === sortType.sDateAsc || sType === sortType.sDateDsc
              ? 'font-bold'
              : ''
          "
        >
          Date Edited
        </div>
        <div class="flex items-center">
          <span
            class="text-slate-700 material-symbols-outlined"
            :class="sType === sortType.sDateAsc ? '' : 'opacity-30'"
          >
            south
          </span>
          <span
            class="text-slate-700 material-symbols-outlined"
            :class="sType === sortType.sDateDsc ? '' : 'opacity-30'"
          >
            north
          </span>
        </div>
      </div>
    </div>
  </ModalDialog>

  <ModalDialog ref="deleteModal">
    <div>
      <div class="text-center p-[15px] text-sm tracking-wide text-slate-500">
        You cannot undo this action
      </div>
      <div
        class="border-t border-slate-400/50 text-center p-[15px] text-red-500 text-lg hover:bg-red-500/10 cursor-pointer"
        @click="deleteList()"
      >
        Delete note
      </div>
    </div>
  </ModalDialog>
</template>
