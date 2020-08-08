<template lang="pug">
main(:style="{ 'background-color': backgroundColor }" ref="main")
  .links
    h1 Tell me your secrets
    div
      a(href="mailto:contact@zachwinter.com" @mouseover="select('email')").email Email
      a(href="tel:18508428313" @mouseover="select('phone')").phone Phone
      a(href="https://www.linkedin.com/in/zachwinter/" target="linkedin" @mouseover="select('linkedin')").linkedin LinkedIn
      a(href="https://www.github.com/zachwinter" target="github" @mouseover="select('github')").github GitHub
  Backdrop(:mouse="mouse" :background="backgroundColor").backdrop
</template>

<script>
import Backdrop from '@/components/Backdrop'
import select from 'd3-selection/src/select'
import mouse from 'd3-selection/src/mouse'
import { mapState } from 'vuex'

export default {
  components: { Backdrop },
  data: () => ({
    hovered: null,
    mouse: {
      x: window.innerWidth/2,
      y: window.innerHeight/2
    }
  }),
  computed: {
    ...mapState(['isMobile', 'isMobileLandscape']),
    backgroundColor () {
      switch (this.hovered) {
        case 'email':
          return '#DCAB6B'
        case 'phone':
          return '#EA526F'
        case 'linkedin':
          return '#7DCE82'
        case 'github':
          return '#5B5F97'
        default:
          return '#cccccc'
      }
    }
  },
  mounted () {
    const self = this
    select(this.$refs.main).on('mousemove', function () {
      if (self.isMobile || self.isMobileLandscape) return
      const [x, y] = mouse(this)
      self.mouse.x = x
      self.mouse.y = y
    })
  },
  methods: {
    select (button) {
      this.hovered = button
    }
  }
}
</script>

<style lang="scss" scoped>
main {
  @include size(100%);
  @include flex;
  text-align: center;
  transition: background 150ms linear;
}

h1 {
  @include scale(font-size 18px 80px);
  font-weight: normal;
  color: white;
  text-transform: uppercase;
}

a {
  display: inline-block;
  padding: 15px;
  border: 2px solid black;
  margin: 0 10px;
  text-decoration: none;
  color: black;
  font-weight: normal;
  text-transform: uppercase;
  transition: all 150ms linear;
}

.links {
  width: 100%;
  padding: $outer-padding;

  @include max-width(tablet) {
    padding: $mobile-outer-padding;
  }
}

.links div {
  @include flex(center, center, row);
  @include scale(margin-top 25px 50px);
  @include max-width(tablet) {
    @include flex(center, center, column);

    a {
      display: block;
      min-width: 100%;
      margin-top: 15px;
    }
  }

  @include mobile-landscape {
    flex-direction: row; 
    margin-top: 0;

    a {
      display: inline;
      width: auto;
      min-width: auto;
    }
  }

  @include min-width(tablet) {
    &:hover a {
      opacity: .5;

      &:hover {
        opacity: 1;
        background: black;
        &.email { color: #DCAB6B; }
        &.phone { color: #EA526F; }
        &.linkedin { color: #7DCE82; }
        &.github { color: #5B5F97; }
      }
    }
  }
}

.backdrop {
  z-index: -1;
  position: absolute;
}
</style>