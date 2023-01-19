<script lang="ts">
export default {
  name: "ModalDialog",
};
</script>
<script setup lang="ts">
import { ref } from "vue";

defineProps({
  strTitle: {
    type: String,
  },
  bButtonClose: {
    type: Boolean,
    default: true,
  },
});

const modalID = "modal" + Math.floor(Math.random() * 1000).toString();

const locked = ref(false);
const isLock = ref(false);
const isShowing = ref(false);
const onShow = ref(false);

const show = () => {
  isShowing.value = true;
  onShow.value = true;
};

const hide = () => {
  isShowing.value = false;
};

const locking = () => {
  if (locked.value === false) {
    locked.value = true;
    setTimeout(() => (locked.value = false), 300);
  }
};

const lock = () => (isLock.value = true);
const unlock = () => (isLock.value = false);

defineExpose({ show, hide, lock, unlock });
</script>
<template>
  <div
    v-show="onShow"
    class="modal fixed bottom-0 z-[99] w-full max-w-[600px] h-full bg-black/40"
    :class="[isShowing ? 'showed' : 'dismissed']"
    :id="modalID"
  >
    <div class="relative h-full">
      <div class="h-full" @click="isLock ? locking() : hide()" />
      <div
        class="absolute flex flex-col w-auto gap-y-[15px] text-slate-700 bottom-[25px] inset-x-[25px]"
        :class="locked ? 'lock' : ''"
      >
        <div class="overflow-hidden bg-slate-200 rounded-2xl z-[999]">
          <div
            v-if="strTitle"
            class="text-center px-[10px] py-[15px] font-bold text-xl"
          >
            {{ strTitle }}
          </div>
          <slot />
        </div>
        <div
          v-if="bButtonClose"
          class="cursor-pointer bg-slate-200 rounded-2xl hover:bg-slate-200/80"
          @click="isLock ? locking() : hide()"
        >
          <div class="p-[10px] text-center text-lg font-bold">Close</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal {
  transition: all 0.4s ease;
  &.showed {
    opacity: 1;
    visibility: visible;
    backdrop-filter: blur(2px);
    animation: show 0.3s ease;
  }
  &.dismissed {
    opacity: 0;
    visibility: hidden;
    backdrop-filter: blur(0);
    animation: hide 0.3s ease;
  }
}
@keyframes show {
  0% {
    opacity: 0;
    visibility: hidden;
    backdrop-filter: blur(0);
  }
  100% {
    opacity: 1;
    visibility: visible;
    backdrop-filter: blur(2px);
  }
}
@keyframes hide {
  0% {
    opacity: 1;
    visibility: visible;
    backdrop-filter: blur(2px);
  }
  100% {
    opacity: 0;
    visibility: hidden;
    backdrop-filter: blur(0);
  }
}
.lock {
  animation: lock 0.3s linear;
}
@keyframes lock {
  0% {
    transform: rotate(-1deg);
  }
  20% {
    transform: rotate(1deg);
  }
  40% {
    transform: rotate(-1deg);
  }
  60% {
    transform: rotate(1deg);
  }
  80% {
    transform: rotate(1deg);
  }
  100% {
    transform: rotate(-1deg);
  }
}
</style>
