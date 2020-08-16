<template lang="pug">
.kaleidosync(:class="{ active }" @transitionend="$emit('transition-end')")
  WorkItem(:namespace="namespace" :total="total" :active="active" :ctas="ctas")
    template(v-slot:content)
      h2: span Kaleidosync
      p: span A Spotify web client &amp; customizable WebGL visualizer.
</template>

<script>
import workItem from '@/mixins/work-item'

export default {
  mixins: [workItem],
  data: () => ({
    namespace: 'kaleidosync',
    total: 5,
    ctas: {
      href: 'https://kaleidosync-beta.herokuapp.com',
      target: 'kaleidosync',
      text: 'View Project',
      margin: false
    }
  })
}
</script>