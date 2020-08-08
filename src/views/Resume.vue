<template lang="pug">
.resume(ref="container")
  .positions
    Position(v-for="(position, i) in positions" :key="i" :position="position" :total="positions.length" :index="i" :active="index === i" ref="position")
  Navigation(:index="index" :last="positions.length - 1" @next="next" @previous="previous")
</template>

<script>
import Navigation from '@/components/common/Navigation'
import Position from '@/components/resume/Position'
import { once } from '@/util/dom'
import { pause } from '@/util/timing'
import swipe from '@/mixins/swipe'

export default {
  mixins: [swipe],
  components: { Navigation, Position },
  data: () => ({
    positions: [{
      title: 'Interactive Pixel Pusher',
      company: 'Freelance',
      period: [new Date('12/1/2009'), new Date()],
      current: true,
      description: `This is a catch-all for all freelance work since 2009, from brochure websites to data-driven web and mobile applications.`
    }, {
      title: 'UI Engineer',
      company: 'pHin',
      period: [new Date('9/1/2018'), new Date('8/1/2020')],
      current: false,
      description: `I joined pHin as a Swiss Army Knife for anything living in a web context: both internal and user-facing features, on the web and multiple views within our mobile app. I worked on internal tooling, data visualizations, marketing interfaces and more. Vue was our shop framework of choice; I wrote several non-trivial Vue applications from scratch in addition to maintaining existing legacy applications written in AngularJS.`
    }, {
      title: 'UI Engineer (Contract)',
      company: 'LG&E and KU Energy LLC',
      period: [new Date('10/1/2016'), new Date('1/1/2017')],
      current: false,
      description: `I joined a small team to help tackle a complete revamp of how LG&E techs track their work requests and handle data in the field. Leveraging the Ionic framework (Angular) we set out to build an iOS application to streamline their workflow, offering an intuitive experience for people of all levels of technical expertise.`
    }, {
      title: 'Associate UI Engineer',
      company: 'LinkedIn',
      period: [new Date('8/1/2014'), new Date('9/1/2015')],
      current: false,
      description: `Chasing my dreams of working in Silicon Valley I joined some of the Bay’s brightest at LinkedIn in creating economic opportunity for the global workforce. I worked on the Brand & Marketing team; in addition to component development for Adobe Experience Manager, I played a major role in the total refresh of business.linkedin.com.`
    }, {
      title: 'Front End Developer',
      company: 'Oohology',
      period: [new Date('11/1/2013'), new Date('8/1/2014')],
      current: false,
      description: `I developed robust fully-responsive user interfaces with extensive browser support. Our solid leadership and rigorous peer review demanded quality and resulted in the rapid growth of my skills. Sass was our CSS preprocessor of choice; I created several mixin abstractions (layout, typography, responsive scaling and more), inevitably leading to a sizable collection of reusable modules for rapid prototyping.`
    }, {
      title: 'Front End Developer',
      company: 'Mediaura',
      period: [new Date('3/1/2012'), new Date('9/1/2013')],
      current: false,
      description: `I cut up designs into semantic HTML, CSS and JavaScript in addition to general maintenance on existing projects; I also handled overflow design work. It was here that I dove into the world of CSS preprocessors; I also established responsive development as an agency standard. Joomla was the company CMS of choice (and occasionally WordPress).`
    }, {
      title: 'Front End Developer',
      company: 'DBS Interactive',
      period: [new Date('7/1/2010'), new Date('7/1/2011')],
      current: false,
      description: `I cut up UI designs into semantic XHTML, CSS and basic jQuery in addition to handling CMS integration (WordPress). In February 2011 I took on design responsibilities in addition to development.`
    }],
    index: 0,
    transitioning: false
  }),
  mounted () {
    this.initSwipe(this.$refs.container)
  },
  methods: {
    next () {
      if (this.transitioning || this.index === this.positions.length - 1) return
      this.$store.dispatch('background/scrollDown')
      this.transition()
      this.index++
    },

    previous () {
      if (this.transitioning || this.index === 0) return
      this.$store.dispatch('background/scrollUp')
      this.transition()
      this.index--
    },

    async transition () {
      this.transitioning = true
      const el = document.querySelector('.position.active')
      await Promise.race([
        once(el, 'transitionend'),
        pause(500)
      ])
      this.transitioning = false
    }
  }
}
</script>

<style lang="scss" scoped>
.resume {
  @include page;
  overflow: hidden;
}

.positions {
  @include size(100%);
  overflow: hidden;
}
</style>