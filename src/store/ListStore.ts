// export const useCounterStore = defineStore('counter', () => {
//   const count = ref(0)
//   const name = ref('Eduardo')
//   const doubleCount = computed(() => count.value * 2)
//   function increment() {
//     count.value++
//   }
//   return { count, name, doubleCount, increment }
// })

import { defineStore } from "pinia";
import { computed, ref } from "vue";

export interface NoteStore {
  id: number;
  note: string;
}

export interface ListStore {
  id: number;
  pin: boolean;
  title: string;
  note: NoteStore[];
  idNote: number;
}

export const useListStore = defineStore(
  "list",
  () => {
    // STATE
    const dataDefault = {
      pin: false,
      title: "",
      note: [],
      idNote: 0,
    };
    const data = ref<ListStore[]>([]);
    const idActive = ref();

    // GETTER
    const getList = computed(() => data.value[idActive.value]);
    const countPinned = computed(() => {
      return data.value.filter((it) => it.pin == true).length;
    });
    const countOther = computed(() => {
      return data.value.filter((it) => it.pin == false).length;
    });

    // ACTION
    function findId(id: number): boolean {
      let found = false;
      for (let i = 0; i < data.value.length; i++) {
        if (data.value[i].id == id) {
          found = true;
          break;
        }
      }
      return found;
    }
    function createListNote() {
      const temp = { id: idActive.value, ...dataDefault };
      data.value.push(temp);
    }

    function title(str: string) {
      if (!findId(idActive.value)) createListNote();

      data.value[idActive.value].title = str;
    }

    function pin() {
      if (!findId(idActive.value)) createListNote();

      data.value[idActive.value].pin = !data.value[idActive.value].pin;
    }

    function addNote(note: string) {
      if (!findId(idActive.value)) createListNote();

      const arrNote = [...data.value[idActive.value].note];

      arrNote.push({
        id: data.value[idActive.value].idNote++,
        note: note,
      });

      data.value[idActive.value].note = arrNote;
    }
    function editNote(note: NoteStore) {
      const arrNote = [...data.value[idActive.value].note];

      for (let i = 0; i < arrNote.length; i++) {
        if (arrNote[i].id === note.id) {
          arrNote[arrNote.indexOf(arrNote[i])] = {
            id: note.id,
            note: note.note,
          };
          break;
        }
      }

      data.value[idActive.value].note = arrNote;
    }
    function removeNote(idNote: number) {
      const arrNote = [...data.value[idActive.value].note];

      for (let i = 0; i < arrNote.length; i++) {
        if (arrNote[i].id === idNote) {
          arrNote.splice(arrNote.indexOf(arrNote[i]), 1);
          break;
        }
      }

      data.value[idActive.value].note = arrNote;
    }

    return {
      data,
      idActive,
      getList,
      countPinned,
      countOther,
      title,
      pin,
      addNote,
      editNote,
      removeNote,
    };
  },
  {
    persist: true,
  }
);
