// export const useCounterStore = defineStore('counter', () => {
//   const count = ref(0)
//   const name = ref('Eduardo')
//   const doubleCount = computed(() => count.value * 2)
//   function increment() {
//     count.value++
//   }
//   return { count, name, doubleCount, increment }
// })

import { sortType } from "@/util/NoteEnum";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export interface NoteStore {
  id: number;
  note: string;
  dtEdited: number;
  height: number;
  completed: boolean;
}

export interface ListStore {
  id: number;
  pin: boolean;
  title: string;
  note: NoteStore[];
  idNote: number;
  dtEdited: number;
  sortType: sortType;
  showTime: boolean;
  withCheckbox: boolean;
}

export const useListStore = defineStore(
  "list",
  () => {
    // STATE
    const lastID = ref(0);
    const dataDefault = {
      pin: false,
      title: "",
      note: [],
      idNote: 0,
      dtEdited: Date.now(),
      sortType: sortType.sDefaultAsc,
      showTime: false,
      withCheckbox: false,
    };
    const data = ref<ListStore[]>([]);
    const idActive = ref();

    // GETTER
    const getLastID = computed(() => lastID.value);
    const getList = computed(() => {
      for (let i = 0; i < data.value.length; i++) {
        if (data.value[i].id === idActive.value) {
          return data.value[i];
        }
      }
      return undefined;
    });
    const countPinned = computed(() => {
      return data.value.filter((it) => it.pin == true).length;
    });
    const countOther = computed(() => {
      return data.value.filter((it) => it.pin == false).length;
    });

    // ACTION
    function findId(id: number) {
      for (let i = 0; i < data.value.length; i++) {
        if (data.value[i].id == id) return i;
      }
      return undefined;
    }
    function updateTime() {
      const id = findId(idActive.value);
      if (id != undefined) data.value[id].dtEdited = Date.now();
    }
    function createListNote() {
      const temp = { id: lastID.value++, ...dataDefault };
      data.value.push(temp);
    }
    function deleteList() {
      const temp = [...data.value];

      for (let i = 0; i < temp.length; i++) {
        if (temp[i].id === idActive.value) {
          temp.splice(temp.indexOf(temp[i]), 1);
          break;
        }
      }

      data.value = temp;
    }

    function sort(type: sortType) {
      const id = findId(idActive.value);

      if (id != undefined) {
        const arrNote = [...data.value[id].note];

        if (type === sortType.sDefaultAsc) {
          arrNote.sort((a, b) => a.id - b.id);
        } else if (type === sortType.sDefaultDsc) {
          arrNote.sort((a, b) => b.id - a.id);
          //
        } else if (type === sortType.sDateAsc) {
          arrNote.sort((a, b) => a.dtEdited - b.dtEdited);
        } else if (type === sortType.sDateDsc) {
          arrNote.sort((a, b) => b.dtEdited - a.dtEdited);
          //
        } else if (type === sortType.sAlphaAsc) {
          arrNote.sort((a, b) => {
            let fa = a.note.toLowerCase();
            let fb = b.note.toLowerCase();

            if (fa < fb) return -1;
            else if (fa > fb) return 1;
            return 0;
          });
        } else if (type === sortType.sAlphaDsc) {
          arrNote.sort((a, b) => {
            let fa = a.note.toLowerCase();
            let fb = b.note.toLowerCase();

            if (fb < fa) return -1;
            else if (fb > fa) return 1;
            return 0;
          });
        }

        data.value[id].sortType = type;
        data.value[id].note = arrNote;
      }
    }

    function showTime() {
      const id = findId(idActive.value);

      if (id != undefined) {
        data.value[id].showTime = !data.value[id].showTime;
      }
    }

    function showCheckbox() {
      const id = findId(idActive.value);

      if (id != undefined) {
        data.value[id].withCheckbox = !data.value[id].withCheckbox;
      }
    }

    function title(str: string) {
      if (findId(idActive.value) === undefined) createListNote();
      const id = findId(idActive.value);

      if (id != undefined) {
        data.value[id].title = str;
        updateTime();
      }
    }

    function pin() {
      if (findId(idActive.value) === undefined) createListNote();
      const id = findId(idActive.value);

      if (id != undefined) data.value[id].pin = !data.value[id].pin;
    }

    function addNote(note: string, height: number) {
      if (findId(idActive.value) === undefined) createListNote();
      const id = findId(idActive.value);

      if (id != undefined) {
        const arrNote = [...data.value[id].note];

        arrNote.push({
          id: data.value[id].idNote++,
          note: note,
          dtEdited: Date.now(),
          height: height,
          completed: false,
        });

        data.value[id].note = arrNote;
        updateTime();
        sort(data.value[id].sortType);
      }
    }
    function editNote(note: NoteStore) {
      const id = findId(idActive.value);

      if (id != undefined) {
        const arrNote = [...data.value[id].note];

        for (let i = 0; i < arrNote.length; i++) {
          if (arrNote[i].id === note.id) {
            arrNote[arrNote.indexOf(arrNote[i])] = {
              id: note.id,
              note: note.note,
              dtEdited: note.dtEdited,
              height: note.height,
              completed: note.completed,
            };
            break;
          }
        }

        data.value[id].note = arrNote;
        updateTime();
        sort(data.value[id].sortType);
      }
    }
    function removeNote(idNote: number) {
      const id = findId(idActive.value);

      if (id != undefined) {
        const arrNote = [...data.value[id].note];

        for (let i = 0; i < arrNote.length; i++) {
          if (arrNote[i].id === idNote) {
            arrNote.splice(arrNote.indexOf(arrNote[i]), 1);
            break;
          }
        }

        data.value[id].note = arrNote;
        updateTime();
      }
    }

    const state = { lastID, data, idActive };
    const getters = { getLastID, getList, countPinned, countOther };
    const action = {
      deleteList,
      sort,
      showTime,
      title,
      pin,
      addNote,
      editNote,
      removeNote,
      showCheckbox,
    };

    return {
      ...state,
      ...getters,
      ...action,
    };
  },
  {
    persist: true,
  }
);