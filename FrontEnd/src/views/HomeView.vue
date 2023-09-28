<script lang="ts">
export default {
  name: "HomeView",
};
</script>
<script setup lang="ts">
import SearchField from "@/components/input_field/SearchField.vue";
import TextField from "@/components/input_field/TextField.vue";
import ModalDialog from "@/components/modal/ModalDialog.vue";
import IconLoading from "@/components/icons/IconLoading.vue";
import {
  useListStore,
  type ListStore,
  type NoteStore,
} from "@/store/ListStore";
import { ePage } from "@/util/NoteEnum";
import NoteUtil from "@/util/NoteUtil";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/UserStore";

const router = useRouter();
const listStore = useListStore();
const userStore = useUserStore();

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

const findLastUpdate = (lists: ListStore[]): string => {
  const newest = ref(0);

  for (let i = 0; i < lists.length; i++) {
    const date = Date.parse(lists[i].dtEdited);
    if (date > newest.value) newest.value = date;
  }

  if (newest.value == 0) return "Data not found";
  else {
    let str = "";
    str += NoteUtil.convert2Digit(new Date(newest.value).getDate()) + "/";
    str += NoteUtil.convert2Digit(new Date(newest.value).getMonth() + 1) + "/";
    str += new Date(newest.value).getFullYear() + " ";
    str += NoteUtil.convert2Digit(new Date(newest.value).getHours()) + ":";
    str += NoteUtil.convert2Digit(new Date(newest.value).getMinutes());
    return str;
  }
};

const goNote = (id?: number) => {
  NoteUtil.goPage(ePage.eNote, router);
  if (id === undefined) listStore.idActive = listStore.getLastID;
  else listStore.idActive = id;
};

const isSearching = ref(false);
const listSearch = ref<ListStore[]>([]);

const search = (str: string) => {
  isSearching.value = true;
  listSearch.value = listStore.data.filter((ls) => {
    return (
      ls.title.toLowerCase().includes(str) ||
      ls.note.filter((nt) => nt.note.toLowerCase().includes(str)).length > 0
    );
  });
};

const cloudLastUpdate = ref("");
const localLastUpdate = ref("");

const accountPanel = ref<InstanceType<typeof ModalDialog> | null>(null);

const openAccountPanel = () => {
  accountPanel.value?.show();
  localLastUpdate.value = findLastUpdate(listStore.data);
  cloudLastUpdate.value = findLastUpdate(tempDoang.value);
};

const upload = () => {
  console.log(JSON.stringify(listStore.data));
  cloudLastUpdate.value = findLastUpdate(tempDoang.value);
};

const tempDoang = ref<ListStore[]>([
  {
    id: 0,
    pin: false,
    title: "pokeeeee",
    note: [
      {
        id: 0,
        note: "pkaksada",
        dtEdited: "2023-02-02T04:45:17.270Z",
        height: 24,
        checked: false,
      },
      {
        id: 1,
        note: "asdaasda",
        dtEdited: "2023-02-02T04:45:20.325Z",
        height: 24,
        checked: false,
      },
      {
        id: 2,
        note: "adasdadada",
        dtEdited: "2023-02-02T04:45:22.713Z",
        height: 24,
        checked: false,
      },
      {
        id: 3,
        note: "asdadasaa",
        dtEdited: "2023-02-02T04:45:25.202Z",
        height: 24,
        checked: false,
      },
      {
        id: 4,
        note: "a",
        dtEdited: "2023-02-02T04:45:26.946Z",
        height: 24,
        checked: false,
      },
      {
        id: 5,
        note: "sd",
        dtEdited: "2023-02-02T04:45:29.039Z",
        height: 24,
        checked: false,
      },
      {
        id: 6,
        note: "pooake",
        dtEdited: "2023-02-02T04:45:32.190Z",
        height: 24,
        checked: false,
      },
      {
        id: 7,
        note: "mkvfjnj",
        dtEdited: "2023-02-02T04:45:35.113Z",
        height: 24,
        checked: false,
      },
    ],
    idNote: 8,
    dtEdited: "2023-02-02T04:45:35.113Z",
    sortType: "DefaultAsc",
    showTime: false,
    showChecked: true,
    withCheckbox: false,
  },
  {
    id: 1,
    pin: false,
    title: "peler",
    note: [
      {
        id: 0,
        note: "peler",
        dtEdited: "2023-02-02T05:56:35.233Z",
        height: 24,
        checked: false,
      },
      {
        id: 1,
        note: "ku",
        dtEdited: "2023-02-02T05:56:37.690Z",
        height: 24,
        checked: false,
      },
      {
        id: 2,
        note: "keren",
        dtEdited: "2023-02-02T05:56:40.586Z",
        height: 24,
        checked: false,
      },
    ],
    idNote: 3,
    dtEdited: "2023-02-02T05:56:40.586Z",
    sortType: "DefaultAsc",
    showTime: false,
    showChecked: true,
    withCheckbox: false,
  },
] as ListStore[]);

const download = () => {
  listStore.replace(tempDoang.value);
  localLastUpdate.value = findLastUpdate(listStore.data);
};

const signinModal = ref<InstanceType<typeof ModalDialog> | null>(null);
const signupModal = ref<InstanceType<typeof ModalDialog> | null>(null);

const openSignIn = (fromSignUp: boolean) => {
  if (fromSignUp) signupModal.value?.hide();
  else {
    userInField.value?.updateModelValue("");
    passInField.value?.updateModelValue("");
    errorInMsg.value = "";
    showPassIn.value = false;

    userUpField.value?.updateModelValue("");
    passUpField.value?.updateModelValue("");
    conPassUpField.value?.updateModelValue("");
    errorUpMsg.value = "";
    showPassUp.value = false;
    showConPassUp.value = false;
  }
  if (!loadingUp.value) signinModal.value?.show();
};

const openSignUp = () => {
  signinModal.value?.hide();
  if (!loadingIn.value) signupModal.value?.show();
};

const userInField = ref<InstanceType<typeof TextField> | null>(null);
const passInField = ref<InstanceType<typeof TextField> | null>(null);

const errorInMsg = ref("");
const showPassIn = ref(false);
const loadingIn = ref(false);
const userIn = ref("");
const passIn = ref("");

const signin = async () => {
  if (!verifyIn()) return;

  errorInMsg.value = "";
  loadingIn.value = true;
  signinModal.value?.lock();

  await NoteUtil.AxiosWrapper("POST", "/auth/login", {
    username: userIn.value,
    password: passIn.value,
  }).then(
    (val) => {
      loadingIn.value = false;
      signinModal.value?.unlock();
      userStore.signin({
        name: val.data.username,
        token: val.data.access_token,
      });
      signinModal.value?.hide();
    },
    (err) => {
      loadingIn.value = false;
      signinModal.value?.unlock();
      errorInMsg.value = err.message;
    }
  );
};

const verifyIn = (): boolean => {
  errorInMsg.value = "";
  if (userIn.value.length == 0) {
    errorInMsg.value = "Username harus diisi";
  } else if (passIn.value.length == 0) {
    errorInMsg.value = "Password harus diiisi";
  }

  return errorInMsg.value.length == 0;
};

const userUpField = ref<InstanceType<typeof TextField> | null>(null);
const passUpField = ref<InstanceType<typeof TextField> | null>(null);
const conPassUpField = ref<InstanceType<typeof TextField> | null>(null);

const errorUpMsg = ref("");
const showPassUp = ref(false);
const showConPassUp = ref(false);
const loadingUp = ref(false);
const userUp = ref("");
const passUp = ref("");
const conPassUp = ref("");

const signup = async () => {
  if (!verifyUp()) return;

  errorUpMsg.value = "";
  loadingUp.value = true;
  signupModal.value?.lock();

  await NoteUtil.AxiosWrapper("POST", "/auth/register", {
    username: userUp.value,
    password: passUp.value,
  }).then(
    (val) => {
      loadingUp.value = false;
      signupModal.value?.unlock();
      openSignIn(true);
    },
    (err) => {
      loadingUp.value = false;
      signupModal.value?.unlock();
      errorUpMsg.value = err.message;
    }
  );
};

const verifyUp = (): boolean => {
  errorUpMsg.value = "";
  if (userUp.value.length == 0) {
    errorUpMsg.value = "Username harus diisi";
  } else if (passUp.value.length < 8) {
    errorUpMsg.value = "Password minimal 8 karakter";
  } else if (passUp.value != conPassUp.value) {
    errorUpMsg.value = "Password tidak sama";
  }

  return errorUpMsg.value.length == 0;
};

onMounted(() => {
  console.log(userStore.userss);
});
</script>

<template>
  <div class="fixed top-0 w-full max-w-[600px] p-[15px]">
    <div class="flex items-center gap-x-[15px]">
      <SearchField
        str-placeholder="Search your notes"
        class="grow"
        @search="(val: string) => search(val.toLowerCase())"
        @cancel="isSearching = false"
      />
      <div
        class="w-[46px] h-[46px] rounded-full border border-slate-100 cursor-pointer flex items-center"
        @click="
          userStore.user != undefined ? openAccountPanel() : openSignIn(false)
        "
      >
        <span class="mx-auto text-4xl font-thin material-symbols-outlined">
          person
        </span>
      </div>
    </div>
    <div v-if="isSearching" class="text-sm mt-[10px]">
      {{
        listSearch.length > 0
          ? `Found ${listSearch.length} result :`
          : "No result found :("
      }}
    </div>
  </div>

  <div :class="isSearching ? 'h-[106px]' : 'h-[80px]'" />

  <section v-if="isSearching">
    <div v-if="listSearch.length > 0">
      <div
        v-for="list in listSearch"
        :key="list.id"
        class="border rounded-2xl border-slate-100 mx-[15px] p-[10px] cursor-pointer"
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
  </section>

  <section v-else-if="listStore.data.length > 0">
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
          ref="userInField"
          v-model="userIn"
          str-placeholder="Username"
          str-class="border-slate-400 rounded-xl"
        />
        <TextField
          ref="passInField"
          v-model="passIn"
          str-placeholder="Password"
          str-class="border-slate-400 rounded-xl"
          :str-type="showPassIn ? 'text' : 'password'"
        >
          <template v-slot:suffix>
            <span
              class="cursor-pointer material-symbols-outlined filled text-slate-500"
              @click="showPassIn = !showPassIn"
            >
              {{ showPassIn ? "visibility" : "visibility_off" }}
            </span>
          </template>
        </TextField>
      </div>
      <div
        class="w-full text-sm text-center text-red-500"
        :class="errorInMsg.length > 0 ? '' : 'hidden'"
      >
        {{ errorInMsg }}
      </div>
      <div
        class="flex mt-[10px] border-t border-slate-400 divide-x divide-slate-400 items-stretch"
      >
        <div
          class="w-full text-center p-[13px] cursor-pointer hover:bg-slate-500/20"
          @click="openSignUp()"
        >
          <span class="text-lg tracking-wide text-slate-700">Sign Up</span>
        </div>
        <div
          class="w-full text-center p-[13px] cursor-pointer hover:bg-green-300/30"
          :class="loadingIn ? 'bg-green-300/30' : ''"
          @click="signin()"
        >
          <IconLoading
            v-if="loadingIn"
            str-class="mx-auto border-green-500/30 border-t-green-600"
            str-size="24px"
            str-circle-width="4.5px"
          />
          <span
            v-else
            class="text-lg font-semibold tracking-wide text-green-600"
          >
            Sign In
          </span>
        </div>
      </div>
    </div>
  </ModalDialog>

  <ModalDialog ref="signupModal" str-title="Sign Up">
    <div>
      <div class="p-[10px] flex flex-col gap-y-[10px]">
        <TextField
          ref="userUpField"
          v-model="userUp"
          str-placeholder="Username"
          str-class="border-slate-400 rounded-xl"
        />
        <TextField
          ref="passUpField"
          v-model="passUp"
          str-placeholder="Password"
          str-class="border-slate-400 rounded-xl"
          :str-type="showPassUp ? 'text' : 'password'"
        >
          <template v-slot:suffix>
            <span
              class="cursor-pointer material-symbols-outlined filled text-slate-500"
              @click="showPassUp = !showPassUp"
            >
              {{ showPassUp ? "visibility" : "visibility_off" }}
            </span>
          </template>
        </TextField>
        <TextField
          ref="conPassUpField"
          v-model="conPassUp"
          str-placeholder="Confirm Password"
          str-class="border-slate-400 rounded-xl"
          :str-type="showConPassUp ? 'text' : 'password'"
        >
          <template v-slot:suffix>
            <span
              class="cursor-pointer material-symbols-outlined filled text-slate-500"
              @click="showConPassUp = !showConPassUp"
            >
              {{ showConPassUp ? "visibility" : "visibility_off" }}
            </span>
          </template>
        </TextField>
      </div>
      <div
        class="w-full text-sm text-center text-red-500"
        :class="errorUpMsg.length > 0 ? '' : 'hidden'"
      >
        {{ errorUpMsg }}
      </div>
      <div
        class="flex mt-[10px] border-t border-slate-400 divide-x divide-slate-400 items-stretch"
      >
        <div
          class="w-full text-center p-[13px] cursor-pointer hover:bg-slate-500/20"
          @click="openSignIn(true)"
        >
          <span class="text-lg tracking-wide text-slate-700">Sign In</span>
        </div>
        <div
          class="w-full text-center p-[13px] cursor-pointer hover:bg-blue-300/30"
          :class="loadingUp ? 'bg-blue-300/30' : ''"
          @click="signup()"
        >
          <IconLoading
            v-if="loadingUp"
            str-class="mx-auto border-blue-500/30 border-t-blue-600"
            str-size="24px"
            str-circle-width="4.5px"
          />
          <span
            v-else
            class="text-lg font-semibold tracking-wide text-blue-500"
          >
            Sign Up
          </span>
        </div>
      </div>
    </div>
  </ModalDialog>

  <ModalDialog ref="accountPanel" str-title="Account">
    <div class="px-[15px] pb-[15px]">
      <div class="flex flex-row gap-x-[10px] items-center">
        <span class="font-bold">Username:</span>
        <span class="flex-1 truncate">
          {{ userStore.user?.name ?? "Please sign in first" }}
        </span>
        <div class="btn px-[15px] py-[2px] text-sm min-w-max">
          Change Username
        </div>
      </div>
      <div class="flex gap-x-[15px] my-[10px]">
        <div class="flex-1 btn py-[2px] !bg-slate-200">Change Password</div>
        <div
          class="flex-1 btn py-[2px] !bg-slate-200"
          @click="
            {
              userStore.signout();
              accountPanel?.hide();
            }
          "
        >
          Sign Out
        </div>
      </div>
      <div class="flex flex-row gap-x-[15px]">
        <div
          class="flex-1 overflow-hidden text-center border border-slate-500 rounded-2xl"
        >
          <span class="text-lg border-b border-slate-500">Cloud</span>
          <div class="my-[5px]">
            <div class="text-sm">Last Edited:</div>
            <div class="text-sm italic font-semibold">
              {{ cloudLastUpdate }}
            </div>
          </div>
          <div
            class="text-lg border-t cursor-pointer bg-sky-500/50 border-slate-500"
            @click="download()"
          >
            Download
          </div>
        </div>
        <div
          class="flex-1 overflow-hidden text-center border border-slate-500 rounded-2xl"
        >
          <span class="text-lg border-b border-slate-500">Local</span>
          <div class="my-[5px]">
            <div class="text-sm">Last Edited:</div>
            <div class="text-sm italic font-semibold">
              {{ localLastUpdate }}
            </div>
          </div>
          <div
            class="text-lg border-t cursor-pointer bg-emerald-500/50 border-slate-500"
            @click="upload()"
          >
            Upload
          </div>
        </div>
      </div>
    </div>
  </ModalDialog>
</template>

<style scoped>
.btn {
  @apply border rounded-full border-slate-500 bg-slate-400/30 cursor-pointer text-center;
}
</style>
