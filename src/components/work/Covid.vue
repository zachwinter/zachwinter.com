<template lang="pug">
.covid(:class="{ active }" @transitionend="$emit('transition-end')")
  WorkItem(:namespace="namespace" :total="total" :active="active" :landscape="true" :ctas="ctas")
    template(v-slot:content)
      h2: span COVID-USA
      p: span An interactive timeseries built with D3, Vue and the HTML5 Canvas.  
</template>

<script>
import workItem from '@/mixins/work-item'

export default {
  mixins: [workItem],
  data: () => ({
    namespace: 'covid',
    total: 3,
    ctas: {
      href: 'https://covid-usa.herokuapp.com/',
      target: 'covid-usa',
      text: 'View Project',
      github: 'https://www.github.com/zachwinter/COVID-USA',
      margin: false
    }
  })
}
</script>