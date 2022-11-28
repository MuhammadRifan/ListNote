<script lang="ts">
export default {
  name: "TextField",
};
</script>
<script setup lang="ts">
defineProps({
  strClass: {
    type: String,
  },
  strClassInput: {
    type: String,
  },
  strPlaceholder: {
    type: String,
  },
  iMaxLength: {
    type: Number,
  },
  bBorder: {
    type: Boolean,
    default: true,
  },
  bSimple: {
    type: Boolean,
    default: false,
  },
});
</script>
<template>
  <div
    class="cursor-text"
    :class="[
      strClass,
      bBorder ? 'border border-slate-100' : '',
      bSimple
        ? ''
        : 'flex items-center justify-between rounded-full pr-[18px] ',
    ]"
  >
    <input
      type="text"
      :placeholder="strPlaceholder"
      class="w-full input"
      :maxlength="iMaxLength"
      :class="[
        strClassInput,
        bSimple ? '' : 'rounded-l-full pl-[18px] mr-[5px] py-[10px]',
      ]"
    />
    <slot name="suffix" />
  </div>
</template>

<style scoped>
.input {
  @apply bg-transparent;
}
.input:focus {
  @apply outline-none;
}
</style>
