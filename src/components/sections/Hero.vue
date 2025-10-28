<template>
  <Section>
    <div class="hero">
      <p>
        <span ref="span" :class="{ visible: show }">{{ visible }}</span>
        <i>{{ visible.length ? '█' : '' }}</i>
      </p>
    </div>

    <svg
      class="svg"
      :class="{ hidden: scroll > 0 }"
      xmlns="http://www.w3.org/2000/svg"
      width="60"
      height="60"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width=".5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  </Section>
</template>

<script setup lang="ts">
import { pause } from '../../util/time'
import { useUI } from '../../store/ui'

defineProps<{ scroll: number }>()
const ui = useUI()
const string = ref("okay. I guess we're doing this.")
const visible = ref('')
const i = ref(0)
const split = computed(() => string.value.split(''))
const blink = ref(false)
const show = ref(true)

async function type(): Promise<boolean> {
  await pause(Math.random() * 70 + 20)
  visible.value += split.value[i.value]
  if (i.value < split.value.length - 1) {
    i.value++
    return type()
  }
  return true
}

watch(
  () => ui.loading,
  async (val) => {
    if (val === false) {
      // await pause(1500)
      // blink.value = true
      // await pause(500)
      // await type()
      // await pause(500)
      // show.value = false
    }
  }
)
</script>

<style lang="scss" scoped>
@keyframes blinker {
  50% {
    opacity: 0;
  }
}

section {
  padding-left: calc(#{notch(left)} + var(--outer-padding));
}

i {
  animation: blinker 1s step-start infinite;
}

.hidden {
  opacity: 0;
}

.hero {
  transition: all 1000ms var(--easing);
}

span {
  opacity: 0;
  transition: opacity 150ms var(--easing);

  &.visible {
    opacity: 1;
  }
}

@keyframes bobble {
  0% {
    transform: translateX(-50%) translateY(0rem);
  }

  50% {
    transform: translateX(-50%) translateY(-1rem);
  }

  100% {
    transform: translateX(-50%) translateY(0rem);
  }
}

.svg {
  @include position(fixed, null null 1rem 50%);
  animation: bobble 3s ease-in-out infinite;
  transition: opacity 1500ms var(--easing);
}

.hidden {
  opacity: 0;
}
</style>
