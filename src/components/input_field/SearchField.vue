<script lang="ts">
export default {
  name: "SearchField",
};
</script>
<script setup lang="ts">
import { computed, ref, type ComputedRef } from "vue";

defineProps({
  strPlaceholder: {
    type: String,
  },
});

const iFocus = ref(false);
const inputField: ComputedRef<HTMLElement | null> = computed(() =>
  document.getElementById("inputSearch")
);
const searchValue = ref("");

const transform = (isFocus: boolean) => {
  iFocus.value = isFocus;
};

const clearSearch = () => {
  if (iFocus.value) {
    searchValue.value = "";
    inputField.value?.blur();
  } else {
    inputField.value?.focus();
  }
};
</script>
<template>
  <div
    class="flex items-center justify-between border rounded-full border-slate-100 pr-[18px]"
  >
    <input
      type="text"
      class="w-full pl-[18px] mr-[5px] py-[10px] rounded-l-full input"
      id="inputSearch"
      v-model="searchValue"
      :placeholder="strPlaceholder"
      @focusin="transform(true)"
      @focusout="transform(false)"
    />
    <div class="relative flex">
      <span
        class="material-symbols-outlined transisi"
        :class="iFocus ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'"
      >
        search
      </span>
      <span
        class="absolute cursor-pointer material-symbols-outlined transisi"
        :class="iFocus ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'"
        @click="clearSearch()"
      >
        close
      </span>
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply bg-transparent;
}
.input:focus {
  @apply outline-none;
}
.transisi {
  transition: opacity 0.3s linear, transform 0.3s linear;
}
</style>
