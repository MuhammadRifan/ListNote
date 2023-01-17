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
import ListTile from "@/components/list/ListTile.vue";

const router = useRouter();
const listStore = useListStore();

const goBack = () => NoteUtil.goPage(ePage.eBack, router);

const dateEdited = ref<Date>();

// pin
const pin = ref(false);
const pinned = () => {
  listStore.pin();
  if (listStore.getList != undefined) pin.value = listStore.getList.pin;
};

// title
const titleElement: ComputedRef<HTMLElement | null> = computed(() =>
  document.getElementById("titleElement")
);
const titleField = ref<InstanceType<typeof TextField> | null>(null);

const title = ref("");
const saveTitle = () => {
  titleElement.value?.blur();
  if (title.value.length > 0) listStore.title(title.value);
};

// new note
const noteNewElement: ComputedRef<HTMLElement | null> = computed(() =>
  document.getElementById("noteNewElement")
);
const noteNewField = ref<InstanceType<typeof TextField> | null>(null);

const isFocus = ref(false);
const onClose = ref(false);
const onCheckbox = ref(false);

const isCreateNew = ref(false);
const newNote = ref("");
const newCheckbox = ref(false);

const createNewNote = () => {
  isCreateNew.value = true;
  noteNewField.value?.updateModelValue("");
  noteNewElement.value?.focus();
};

const saveNewNote = (isSave: boolean) => {
  if (isSave) {
    if (isFocus.value && newNote.value.length > 0) {
      isCreateNew.value = false;
      listStore.addNote(
        newNote.value,
        noteNewField.value?.height ?? 0,
        newCheckbox.value
      );
      newNote.value = "";
      newCheckbox.value = false;
    }
    unFocus();
    isFocus.value = false;
  } else isFocus.value = true;
};

const clearNewNote = () => {
  newNote.value = "";
  newCheckbox.value = false;
  isFocus.value = false;
  isCreateNew.value = false;
  unFocus();
};

const unFocus = () => {
  noteNewElement.value?.blur();
  noteNewField.value?.updateModelValue("");
};

const actionModal = ref<InstanceType<typeof ModalDialog> | null>(null);

// sort
const sortModal = ref<InstanceType<typeof ModalDialog> | null>(null);
const sType = ref<sortType>();

const sorting = (sort: sortType) => {
  listStore.sort(sort);
  sType.value = sort;
  sortModal.value?.hide();
};

// delete
const deleteModal = ref<InstanceType<typeof ModalDialog> | null>(null);

const deleteList = () => {
  listStore.deleteList();
  goBack();
};

// show time
const bShowTime = ref(false);

const showTime = () => {
  listStore.showTime();
  bShowTime.value = !bShowTime.value;
};

// show checkbox
const bShowCheckbox = ref(false);

const showCheckbox = () => {
  listStore.showCheckbox();
  bShowCheckbox.value = !bShowCheckbox.value;
};

// show checked
const bShowChecked = ref(false);

const showChecked = () => {
  listStore.showChecked();
  bShowChecked.value = !bShowChecked.value;
};

const heightChecked = ref("24px");

const findHeight = () => {
  const ret = ref(0);
  if (listStore.getList) {
    const list = listStore.getList;
    for (let i = 0; i < list.note.length; i++) {
      const element = list.note[i];
      if (!element.checked) continue;
      if (element.height === undefined || element.height == 0) {
        ret.value += 24;
      } else ret.value += element.height;
    }
  }
  heightChecked.value = ret.value.toString() + "px";
};

listStore.$subscribe(() => findHeight());

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
    bShowCheckbox.value = data.withCheckbox;
    bShowChecked.value = data.showChecked;
    findHeight();
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
      @focusout="saveTitle()"
      @keydown.enter="saveTitle()"
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

  <main id="lists" class="my-[54px]">
    <ul class="list-disc list-inside py-[10px] px-[15px]">
      <div
        v-if="
          listStore.getList != undefined && listStore.getList.note.length > 0
        "
      >
        <!-- Checkbox List -->
        <div v-if="listStore.getList.withCheckbox">
          <div
            v-for="note in listStore.getList.note.filter((it) => {
              return !it.checked;
            })"
            :key="note.id"
          >
            <NoteField :obj-note="note" :b-with-checkbox="bShowCheckbox" />
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
        <!-- Default List -->
        <div v-else>
          <div v-for="note in listStore.getList.note" :key="note.id">
            <NoteField :obj-note="note" :b-with-checkbox="bShowCheckbox" />
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
        <!--  -->
      </div>
      <!-- Input New Field -->
      <div
        class="flex flex-row"
        :class="
          isCreateNew
            ? 'opacity-100 h-auto cursor-auto'
            : 'opacity-0 h-0 cursor-none overflow-hidden'
        "
      >
        <li v-if="!bShowCheckbox" class="w-[10px]" />
        <div class="flex items-center grow gap-x-[10px]">
          <div class="self-start h-[22px] flex items-center">
            <input
              v-if="bShowCheckbox"
              type="checkbox"
              class="bg-white w-[15px] h-[15px]"
              v-model="newCheckbox"
              @mouseenter="onCheckbox = true"
              @mouseout="onCheckbox = false"
            />
          </div>
          <TextField
            v-model="newNote"
            ref="noteNewField"
            str-id="noteNewElement"
            str-class="bg-red-500 grow"
            @focusin="!onCheckbox ? saveNewNote(false) : ''"
            @focusout="
              onClose
                ? clearNewNote()
                : onCheckbox
                ? noteNewElement?.focus()
                : newNote.length == 0
                ? clearNewNote()
                : saveNewNote(true)
            "
            @keydown.enter="saveNewNote(true)"
            :str-class-input="
              bShowCheckbox && newCheckbox ? 'line-through text-slate-400' : ''
            "
            :b-simple="true"
            :b-border="false"
            :b-text-area="true"
            :b-auto-height="true"
            :i-default-height="24"
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
      <!-- Button New Field -->
      <div
        v-if="!isCreateNew"
        class="flex items-center cursor-pointer add-button w-max"
        @click="createNewNote()"
      >
        <span class="material-symbols-outlined">add</span>
        Add List
      </div>
      <!-- Checked List -->
      <div
        v-if="
          listStore.getList != undefined &&
          listStore.getList.note.length > 0 &&
          listStore.getList.withCheckbox
        "
      >
        <!-- Checked Button -->
        <div
          class="py-[10px] flex items-center gap-x-[15px] cursor-pointer"
          @click="showChecked()"
        >
          <span
            class="transition duration-300 material-symbols-outlined"
            :class="bShowChecked ? 'rotate-0' : '-rotate-90 -translate-y-[2px]'"
          >
            expand_more
          </span>
          Checked
        </div>
        <!-- Checked List -->
        <div
          id="checkedList"
          class="overflow-hidden transition-all duration-300"
          :style="{ height: bShowChecked ? heightChecked : '0px' }"
        >
          <!-- :class="bShowChecked ? 'h-[' + heightChecked + 'px]' : 'h-0'" -->
          <div
            v-for="note in listStore.getList.note.filter((it) => {
              return it.checked;
            })"
            :key="note.id"
          >
            <NoteField :obj-note="note" :b-with-checkbox="bShowCheckbox" />
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
        <!--  -->
      </div>
      <!-- -->
    </ul>
  </main>

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
      @click="actionModal?.show()"
    >
      more_vert
    </span>
  </div>

  <ModalDialog ref="actionModal">
    <div>
      <ListTile
        @click="
          {
            actionModal?.hide();
            showCheckbox();
          }
        "
      >
        <span :class="bShowCheckbox ? 'font-bold' : ''">Checkbox</span>
        <template v-slot:trailing>
          <span
            class="material-symbols-outlined"
            :class="bShowCheckbox ? 'opacity-90 filled' : 'opacity-30'"
          >
            {{ bShowCheckbox ? "visibility" : "visibility_off" }}
          </span>
        </template>
      </ListTile>
      <ListTile
        class="border-t border-slate-400/50"
        @click="
          {
            actionModal?.hide();
            showTime();
          }
        "
      >
        <span :class="bShowTime ? 'font-bold' : ''">Show Time</span>
        <template v-slot:trailing>
          <span
            class="material-symbols-outlined"
            :class="bShowTime ? 'opacity-90 filled' : 'opacity-30'"
          >
            {{ bShowTime ? "visibility" : "visibility_off" }}
          </span>
        </template>
      </ListTile>
      <ListTile
        class="border-t border-slate-400/50"
        @click="
          {
            actionModal?.hide();
            deleteModal?.show();
          }
        "
      >
        <span class="font-semibold tracking-wide text-red-500">
          Delete Note
        </span>
        <template v-slot:trailing>
          <span class="text-red-500 material-symbols-outlined">delete</span>
        </template>
      </ListTile>
    </div>
  </ModalDialog>

  <ModalDialog ref="sortModal" str-title="Sort By">
    <div class="flex flex-col">
      <ListTile
        class="border-t border-slate-400/50"
        @click="
          sType === sortType.sDefaultAsc
            ? sorting(sortType.sDefaultDsc)
            : sorting(sortType.sDefaultAsc)
        "
      >
        <span
          :class="
            sType === sortType.sDefaultAsc || sType === sortType.sDefaultDsc
              ? 'font-bold'
              : ''
          "
        >
          Default
        </span>
        <template v-slot:trailing>
          <div class="flex items-center">
            <span
              class="material-symbols-outlined"
              :class="sType === sortType.sDefaultAsc ? '' : 'opacity-30'"
            >
              south
            </span>
            <span
              class="material-symbols-outlined"
              :class="sType === sortType.sDefaultDsc ? '' : 'opacity-30'"
            >
              north
            </span>
          </div>
        </template>
      </ListTile>
      <ListTile
        class="border-t border-slate-400/50"
        @click="
          sType === sortType.sAlphaAsc
            ? sorting(sortType.sAlphaDsc)
            : sorting(sortType.sAlphaAsc)
        "
      >
        <span
          :class="
            sType === sortType.sAlphaAsc || sType === sortType.sAlphaDsc
              ? 'font-bold'
              : ''
          "
        >
          Alphabet
        </span>
        <template v-slot:trailing>
          <div class="flex items-center">
            <span
              class="material-symbols-outlined"
              :class="sType === sortType.sAlphaAsc ? '' : 'opacity-30'"
            >
              south
            </span>
            <span
              class="material-symbols-outlined"
              :class="sType === sortType.sAlphaDsc ? '' : 'opacity-30'"
            >
              north
            </span>
          </div>
        </template>
      </ListTile>
      <ListTile
        class="border-t border-slate-400/50"
        @click="
          sType === sortType.sDateAsc
            ? sorting(sortType.sDateDsc)
            : sorting(sortType.sDateAsc)
        "
      >
        <span
          :class="
            sType === sortType.sDateAsc || sType === sortType.sDateDsc
              ? 'font-bold'
              : ''
          "
        >
          Date Edited
        </span>
        <template v-slot:trailing>
          <div class="flex items-center">
            <span
              class="material-symbols-outlined"
              :class="sType === sortType.sDateAsc ? '' : 'opacity-30'"
            >
              south
            </span>
            <span
              class="material-symbols-outlined"
              :class="sType === sortType.sDateDsc ? '' : 'opacity-30'"
            >
              north
            </span>
          </div>
        </template>
      </ListTile>
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

<style lang="scss" scoped>
.add-button {
  @apply pl-[15px] pr-[20px] py-[5px] my-[10px] border border-slate-300 rounded-full mx-auto gap-x-[5px];
}
</style>
