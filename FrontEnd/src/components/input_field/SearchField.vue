<script lang="ts">
export default {
  name: "SearchField",
};
</script>
<script setup lang="ts">
import { ref } from "vue";

defineProps({
  strPlaceholder: {
    type: String,
  },
});

const emit = defineEmits(["search", "cancel"]);

const isSearching = ref(false);
const searchValue = ref("");
const lastValue = ref("");

const search = (search: boolean) => {
  if (search) {
    isSearching.value = true;
    emit("search", searchValue.value);
  } else {
    searchValue.value = "";
    isSearching.value = false;
    emit("cancel");
  }
};

const checkValue = () => {
  if (lastValue.value != searchValue.value) {
    isSearching.value = false;
  }
  lastValue.value = searchValue.value;
};
</script>
<template>
  <div
    class="flex items-center justify-between border rounded-full border-slate-100 pr-[18px]"
  >
    <input
      type="search"
      class="w-full pl-[18px] mr-[5px] py-[10px] rounded-l-full input"
      id="inputSearch"
      v-model="searchValue"
      @keyup="checkValue()"
      @search="search(true)"
      :placeholder="strPlaceholder"
    />
    <span
      class="cursor-pointer material-symbols-outlined"
      @click="isSearching ? search(false) : search(true)"
    >
      {{ isSearching ? "close" : "search" }}
    </span>
  </div>
</template>

<style scoped>
.input {
  @apply bg-transparent;
}
.input:focus {
  @apply outline-none;
}

input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
}
</style>
