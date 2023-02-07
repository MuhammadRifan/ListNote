import { defineStore } from "pinia";
import { ref } from "vue";

export interface UserStore {
  name: string;
  token: string;
}

export const useUserStore = defineStore(
  "user",
  () => {
    // STATE
    const user = ref<UserStore>();

    // GETTER

    // ACTION
    function signin(params: UserStore) {
      user.value = params;
    }

    function signout() {
      user.value = undefined;
    }

    const state = { user };
    const getter = {};
    const action = { signin, signout };

    return {
      ...state,
      ...getter,
      ...action,
    };
  },
  { persist: true }
);
