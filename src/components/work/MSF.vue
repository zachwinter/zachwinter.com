<template>
  <Scroller
    axis="x"
    @update:navigation="scroll.onMSFNavigation"
    @update:state="scroll.onMSFScroll"
    ref="msfScroller"
  >
    <Section title="MSF" description="MSF: nonprofit recovery housing">
      <img src="/screenshots/msf.01.jpg" />
    </Section>

    <Section title="Mindful Service Foundation">
      <img src="/screenshots/msf.02.jpg" />
    </Section>

    <Section title="Mindful Service Foundation">
      <img src="/screenshots/msf.03.jpg" />
    </Section>

    <Section title="Mindful Service Foundation">
      <img src="/screenshots/msf.04.jpg" />
    </Section>
  </Scroller>
</template>

<script lang="ts" setup>
import { useScroll } from '../../store/scroll'

const scroll = useScroll()
</script>
