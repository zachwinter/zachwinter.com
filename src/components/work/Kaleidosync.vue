<template>
  <Section title="Kaleidosync">
    <Scroller
      axis="x"
      @update:navigation="scroll.onKaleidosyncNavigation"
      @update:state="scroll.onKaleidosyncScroll"
      ref="kaleidosyncScroller"
    >
      <Section
        title="Kaleidosync"
        description="KALEIDOSYNC - a WebGL music visualizer that works with any audio source"
      >
        <img src="/screenshots/kaleidosync.01.png" />
      </Section>

      <Section
        title="Kaleidosync"
        description="fully customizable visuals with a live-updating shader editor"
      >
        <img src="/screenshots/kaleidosync.02.png" />
      </Section>

      <Section title="Kaleidosync" description="supports Radio Paradise, KEXP, Audius & more">
        <img src="/screenshots/kaleidosync.03.png" />
      </Section>

      <Section title="Kaleidosync" description="unobtrusive UI + tooltips when you want them">
        <img src="/screenshots/kaleidosync.04.png" />
      </Section>

      <Section title="Kaleidosync" description="~ 50 designs and counting">
        <img src="/screenshots/kaleidosync.05.png" />
      </Section>
    </Scroller>
  </Section>
</template>

<script lang="ts" setup>
import { useScroll } from '../../store/scroll'

const scroll = useScroll()
</script>
