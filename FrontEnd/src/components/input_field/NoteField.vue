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

const note = ref("");
const checkbox = ref(false);

const saveNote = (isSave: boolean) => {
  if (isSave) {
    if (isFocus.value && note.value.length == 0) {
      listStore.removeNote(props.objNote.id);
    } else if (isFocus.value && note.value.length > 0) saveStore();
    isFocus.value = false;
    noteElement.value?.blur();
  } else {
    isFocus.value = true;
  }
};

const clearNote = () => listStore.removeNote(props.objNote.id);

const saveStore = () => {
  listStore.editNote({
    id: props.objNote.id,
    note: note.value,
    dtEdited: Date.now(),
    height:
      noteField.value?.height === undefined || noteField.value?.height == 0
        ? 24
        : noteField.value?.height,
    checked: checkbox.value,
  });
};

onMounted(() => {
  if (props.objNote.note.length > 0) note.value = props.objNote.note;
  checkbox.value = props.objNote.checked ?? false;
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
          @change="saveStore()"
        />
      </div>
      <TextField
        ref="noteField"
        str-class="grow"
        v-model.trim="note"
        @focusin="saveNote(false)"
        @focusout="onClose ? clearNote() : saveNote(true)"
        @keydown.enter="saveNote(true)"
        :str-id="'noteElement' + objNote.id"
        :str-class-input="
          bWithCheckbox && checkbox ? 'line-through text-slate-400' : ''
        "
        :i-max-length="250"
        :i-default-height="props.objNote.height ? props.objNote.height : 24"
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
