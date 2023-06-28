<template>
  <section>
    <aside>
      <p>Jump to date:</p>
      <div class="tabs">
        <Button class="tab" v-for="(date, i) in dates" :key="i" @click="select(i)">{{
          $format(date)
        }}</Button>
      </div>
    </aside>
    <iframe :src="src"></iframe>
  </section>
</template>

<script setup lang="ts">
import { format } from 'date-fns'

const dates = ref(['11052020', '08172021', '12252021', '09012022'])
const active = ref(0)
const src = computed(() => `http://covid-usa.herokuapp.com/#${dates.value[active.value]}`)

function select(i: number) {
  active.value = i
}

function $format(string: string) {
  const day = string.slice(2, 4)
  const month = string.slice(0, 2)
  const year = string.slice(-4)

  return format(new Date(`${month}/${day}/${year}`), 'LL/dd/yyyy')
}
</script>

<style lang="scss" scoped>
section {
  @include flex(flex-start, flex-start, column);
  width: 100%;
}

aside,
iframe {
  @include strip;
}

aside {
  @include vertical-rhythm;
  padding: var(--outer-padding);
}

iframe {
  @include size(100%, 70vh);
}

.tabs {
  @include flex(flex-start, space-between, row);
  width: 100%;
  gap: var(--base-spacer);

  @include mobile-portrait {
    flex-wrap: wrap;
  }

 .tab {
    width: 50% !important;
  }
}
</style>
