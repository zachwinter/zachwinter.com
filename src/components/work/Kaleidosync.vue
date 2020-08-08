<template lang="pug">
.kaleidosync(:class="{ active }")
  Item(:namespace="namespace" :total="total" :active="active")
    h2 Kaleidosync
    p A Spotify web client &amp; customizable WebGL visualizer.
    .ctas  
      a(href="https://kaleidosync-beta.herokuapp.com/" target="kaleidosync") View Project
      ViewToggle
</template>

<script>
import workItem from '@/mixins/work-item'

export default {
  mixins: [workItem],
  data: () => ({
    namespace: 'kaleidosync',
    total: 5
  })
}
</script>

<style lang="scss" scoped>
.kaleidosync {
  @include work-item;
}

.ctas {
  @include flex;
  margin-top: $base-margin;
}
</style>