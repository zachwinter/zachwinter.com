<template>
  <div class="uniforms">
    <div
      v-for="(uniform, i) in background.uniforms"
      class="row uniform"
      cascade
      :key="`${i}-uniform}`"
    >
      <ColorInput
        v-if="uniform[1] === 2"
        :label="uniform[0]"
        :webgl="true"
        :model-value="uniform[2]"
      />
      <Toggle v-else-if="uniform[1] === 1" :label="uniform[0]" :model-value="uniform[2]" />
      <RangeInput
        v-else-if="uniform[1] === 0"
        @input="(e:any) => onInput(uniform, i, e.target.value)"
        @focus="onFocus"
        @blur="onBlur"
        ref="range"
        :model-value="uniform[2]?.[0]"
        :min="uniform[2]?.[1]"
        :max="uniform[2]?.[2]"
        :step="uniform[2]?.[3]"
        :label="uniform[0]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, shallowRef } from 'vue'
import RangeInput from '../forms/RangeInput.vue'
import ColorInput from '../forms/ColorInput.vue'
import { useBackground } from '../../store/background'
const background = useBackground()
const uniformKeys = computed(() => background.uniforms.map((v) => v[0]))

import { uniformRangeUtils } from '../../util/unifom-range-utils'

const $emits = defineEmits(['focus', 'blur', 'update'])
defineProps<{
  focused: boolean
  focusedKey: string | null
}>()

const ranges = shallowRef<any>({})
const { getMin, getMax, getStep } = uniformRangeUtils

watch(
  () => uniformKeys.value,
  (val) => {
    ranges.value = {}
    val.forEach((key, i) => {
      const val = background.uniforms[i][2]
      if (typeof val !== 'number') return
      ranges.value[key] = {
        min: getMin(key, val),
        max: getMax(key, val),
        step: getStep(key, val) || 0.00001
      }
    })
  },
  {
    immediate: true
  }
)

function isColor(val: any) {
  if (Array.isArray(val) && val.length === 3) return true
  if (val?.isColor) return true
  return false
}

function isBoolean(val: any) {
  return typeof val === 'boolean'
}

function onFocus(key: string) {
  $emits('focus', key)
}

function onInput(uniform: any, i: any, value: any) {
  $emits('update', { uniform, value: isNaN(Number(value)) ? value : Number(value), i })
}

function onBlur() {
  $emits('blur')
}
</script>

<style lang="scss" scoped>
.hidden {
  opacity: 0 !important;
}
</style>
