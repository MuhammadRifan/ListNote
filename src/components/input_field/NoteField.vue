<script lang="ts">
export default {
  name: "NoteField",
};
</script>
<script setup lang="ts">
import { useListStore } from "@/store/ListStore";
import { computed, onMounted, ref, type ComputedRef } from "vue";
import TextField from "./TextField.vue";

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
});

const listStore = useListStore();

const noteElement: ComputedRef<HTMLElement | null> = computed(() =>
  document.getElementById("noteElement" + props.id)
);
const noteField = ref<InstanceType<typeof TextField> | null>(null);

const isFocus = ref(false);
const onClose = ref(false);

const note = ref("");

const saveNote = (isSave: boolean) => {
  if (isSave) {
    if (isFocus.value && note.value.length == 0) listStore.removeNote(props.id);
    else if (isFocus.value && note.value.length > 0) {
      listStore.editNote({
        id: props.id,
        note: note.value,
      });
    }
    isFocus.value = false;
    noteElement.value?.blur();
  } else {
    isFocus.value = true;
  }
};

const clearNote = () => {
  listStore.removeNote(props.id);
};

onMounted(() => {
  if (props.note.length > 0) note.value = props.note;
  noteField.value?.updateModelValue(note.value);
});
</script>
<template>
  <div class="flex flex-row">
    <li />
    <div class="flex items-center grow gap-x-[10px]">
      <TextField
        ref="noteField"
        v-model.trim="note"
        str-class="grow h-[24px]"
        str-class-input="h-[24px]"
        @focusin="saveNote(false)"
        @focusout="onClose ? clearNote() : saveNote(true)"
        @keydown.enter="saveNote(true)"
        :str-id="'noteElement' + id"
        :i-max-length="100"
        :b-simple="true"
        :b-border="false"
        :b-text-area="true"
        :b-auto-height="true"
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
</template>
