<script lang="ts">
export default {
  name: "TextField",
};
</script>
<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  strId: {
    type: String,
  },
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
  iDefaultHeight: {
    type: Number,
    default: 0,
  },
  bBorder: {
    type: Boolean,
    default: true,
  },
  bSimple: {
    type: Boolean,
    default: false,
  },
  bTextArea: {
    type: Boolean,
    default: false,
  },
  bAutoHeight: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String,
    default: "",
  },
});

const value = ref(props.modelValue);
const height = ref(0);
const textElement = ref<InstanceType<typeof HTMLElement> | null>(null);

const emit = defineEmits(["update:modelValue", "atFocusIn", "atFocusOut"]);

const onInput = (event: any) => {
  if (!event) return;
  autoHeight();

  emit("update:modelValue", event.target?.value);
};

const autoHeight = () => {
  if (props.bAutoHeight && textElement.value != null) {
    textElement.value.parentElement?.setAttribute("style", `height:0;`);
    textElement.value.setAttribute("style", `height:0;`);
    textElement.value.parentElement?.setAttribute(
      "style",
      "height:" + textElement.value.scrollHeight + "px;"
    );
    textElement.value.setAttribute(
      "style",
      "height:" + textElement.value.scrollHeight + "px;"
    );
    height.value = textElement.value.scrollHeight;
  }
};

const updateModelValue = (val: any) => {
  value.value = val;
  emit("update:modelValue", val);
  if (props.bAutoHeight && textElement.value != null) {
    textElement.value.parentElement?.setAttribute(
      "style",
      `height:${props.iDefaultHeight}px;`
    );
    textElement.value.setAttribute(
      "style",
      `height:${props.iDefaultHeight}px;`
    );
  }
};

const atFocusIn = () => emit("atFocusIn");
const atFocusOut = () => emit("atFocusOut");

defineExpose({ updateModelValue, height });
</script>
<template>
  <div
    :class="[
      'cursor-text',
      strClass,
      bBorder ? 'border border-slate-100' : '',
      bSimple
        ? ''
        : 'flex items-center justify-between rounded-full pr-[18px] ',
    ]"
  >
    <input
      v-if="!bTextArea"
      type="text"
      v-model="value"
      @input="onInput"
      @focusin="atFocusIn"
      @focusout="atFocusOut"
      :id="strId"
      :maxlength="iMaxLength"
      :placeholder="strPlaceholder"
      :class="[
        'w-full input',
        strClassInput,
        bSimple ? '' : 'rounded-l-full pl-[18px] mr-[5px] py-[10px]',
      ]"
    />
    <textarea
      v-else-if="bTextArea"
      v-model="value"
      ref="textElement"
      @input="onInput"
      @focusin="atFocusIn"
      @focusout="atFocusOut"
      :id="strId"
      :maxlength="iMaxLength"
      :placeholder="strPlaceholder"
      :style="{ height: bAutoHeight ? textElement?.scrollHeight : '' }"
      :class="[
        'w-full input',
        strClassInput,
        bAutoHeight ? 'auto-height' : '',
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
.auto-height {
  @apply overflow-y-hidden resize-none;
}
</style>
