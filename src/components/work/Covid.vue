<template lang="pug">
.covid(:class="{ active }")
  Item(:namespace="namespace" :total="total" :active="active" :landscape="true")
    h2 COVID-USA
    p An interactive timeseries built with D3, Vue and the HTML5 Canvas.  
    .ctas
      a(href="https://covid-usa.herokuapp.com/" target="covid") View Project
      ViewToggle
</template>

<script>
import workItem from '@/mixins/work-item'

export default {
  mixins: [workItem],
  data: () => ({
    namespace: 'covid',
    total: 3
  })
}
</script>

<style lang="scss" scoped>
.covid {
  @include work-item;
}

.ctas {
  @include flex;
  margin-top: $base-margin;
}
</style>