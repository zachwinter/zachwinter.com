import { watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import { interpolateNumber } from 'd3-interpolate'
import { useRAF } from '../store/raf'

const RAF_ID = 'stream:multiplier'

export function useStreamMultiplier() {
  const route = useRoute()
  const multiplier = ref(route.path === '/' ? 0.1 : 1)
  const raf = useRAF()
  const duration = ref(1500)

  watch(
    () => route.path,
    (val) => {
      if (val === '/') {
        const iM = interpolateNumber(multiplier.value, 0.1)

        raf.add(
          (now, progress) => {
            multiplier.value = iM(progress)
          },
          {
            id: RAF_ID,
            duration: duration.value
          }
        )

        return
      }

      if (multiplier.value < 1) {
        const iM = interpolateNumber(multiplier.value, 1)

        raf.add(
          (now, progress) => {
            multiplier.value = iM(progress)
          },
          {
            id: RAF_ID,
            duration: duration.value
          }
        )
      }
    },
    {
      immediate: true
    }
  )

  return {
    multiplier,
    duration
  }
}
