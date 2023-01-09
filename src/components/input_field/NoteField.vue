<script lang="ts">
export default {
  name: "NoteField",
};
</script>
<script setup lang="ts">
import { useListStore, type NoteStore } from "@/store/ListStore";
import { computed, onMounted, ref, type ComputedRef, type PropType } from "vue";
import TextField from "./TextField.vue";

const props = defineProps({
  objNote: {
    type: Object as PropType<NoteStore>,
    required: true,
  },
  bWithCheckbox: {
    type: Boolean,
    default: false,
  },
});

const listStore = useListStore();

const noteElement: ComputedRef<HTMLElement | null> = computed(() =>
  document.getElementById("noteElement" + props.objNote.id)
);
const noteField = ref<InstanceType<typeof TextField> | null>(null);

const isFocus = ref(false);
const onClose = ref(false);

const defHeight = ref(24);
const note = ref("");
const checkbox = ref(false);

const saveNote = (isSave: boolean) => {
  if (isSave) {
    if (isFocus.value && note.value.length == 0) {
      listStore.removeNote(props.objNote.id);
    } else if (isFocus.value && note.value.length > 0) {
      listStore.editNote({
        id: props.objNote.id,
        note: note.value,
        dtEdited: Date.now(),
        height: noteField.value?.height ?? 24,
        completed: checkbox.value,
      });
    }
    isFocus.value = false;
    noteElement.value?.blur();
  } else {
    isFocus.value = true;
  }
};

const clearNote = () => {
  listStore.removeNote(props.objNote.id);
};

const completed = () => {
  listStore.editNote({
    id: props.objNote.id,
    note: note.value,
    dtEdited: Date.now(),
    height: noteField.value?.height ?? 24,
    completed: checkbox.value,
  });
};

onMounted(() => {
  if (props.objNote.note.length > 0) note.value = props.objNote.note;
  defHeight.value = props.objNote.height ?? 24;
  checkbox.value = props.objNote.completed ?? false;
  noteField.value?.updateModelValue(note.value);
});
</script>
<template>
  <div class="flex flex-row">
    <li v-if="!bWithCheckbox" class="w-[10px]" />
    <div class="flex items-center grow gap-x-[10px]">
      <div class="self-start h-[22px] flex items-center">
        <input
          v-if="bWithCheckbox"
          type="checkbox"
          class="bg-white w-[15px] h-[15px]"
          v-model="checkbox"
          @change="completed()"
        />
      </div>
      <TextField
        ref="noteField"
        class="grow"
        v-model.trim="note"
        @focusin="saveNote(false)"
        @focusout="onClose ? clearNote() : saveNote(true)"
        @keydown.enter="saveNote(true)"
        :str-id="'noteElement' + objNote.id"
        :str-class-input="
          bWithCheckbox && checkbox ? 'line-through text-slate-400' : ''
        "
        :i-max-length="250"
        :i-default-height="defHeight"
        :b-simple="true"
        :b-border="false"
        :b-text-area="true"
        :b-auto-height="true"
      />
    </div>
    <div
      class="self-center cursor-pointer material-symbols-outlined"
      :class="isFocus ? 'visible' : 'invisible'"
      @mouseenter="onClose = true"
      @mouseout="onClose = false"
    >
      close
    </div>
  </div>
</template>
