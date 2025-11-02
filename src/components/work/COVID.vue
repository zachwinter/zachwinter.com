<template>
  <Section title="COVID-USA">
    <Map class="covid-map" ref="covid" />
    <Scroller
      axis="x"
      @update:navigation="scroll.onCovidNavigation"
      @update:state="scroll.onCovidScroll"
      ref="covidScroller"
    >
      <Section
        title="Nov 2020"
        description="COVID-USA - visualizing historical active cases: Nov. 05, 2020"
      >
      </Section>
      <Section
        title="Aug 2021"
        description="COVID-USA - visualizing historical active cases: Aug. 17, 2021"
      >
      </Section>
      <Section
        title="Dec 2021"
        description="COVID-USA - visualizing historical active cases: Dec. 25, 2021"
      >
      </Section>
    </Scroller>
  </Section>
</template>

<script lang="ts" setup>
import { useScroll } from '../../store/scroll'
const covid = ref()
const covidScroller = ref()
const scroll = useScroll()

watch(
  () => scroll.covidActiveIndex,
  (val) => {
    covid.value?.selectExample(val)
  }
)

onMounted(() => {
  if (covidScroller.value) {
    scroll.covidScrollerRef = covidScroller.value
  }
})
</script>

<style lang="scss" scoped>
.covid-map {
  @include position(absolute, 0 0 null 0);
  pointer-events: auto;
}
</style>
