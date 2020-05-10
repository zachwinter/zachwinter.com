<template lang="pug">
.header
  header
    Logo(@click="toggleNav")
    transition(name="fade")
      nav(v-if="showNav")
        span(@click="toggleNav"): router-link(to="/") Home
        span(@click="toggleNav"): router-link(to="/work") Work
        span(@click="toggleNav"): router-link(to="/contact") Contact
  .shade(:class="{ visible: showNav }")
</template>

<script>
import Logo from '@/components/Logo'

export default {
  components: { Logo },
  data: () => ({
    showNav: false
  }),
  methods: {
    toggleNav () {
      this.showNav = !this.showNav
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  @include position(fixed, $outer-padding null null $outer-padding);
  z-index: 9999;
  padding-left: env(safe-area-inset-left);

  @include max-width(tablet) {
    @include position(fixed, $mobile-outer-padding null null $mobile-outer-padding);
  }
}

@keyframes fadeslide {
  0% {
    transform: translateX(50px);
    opacity: 0;
  }

  100% {
    transform: translateX(0px);
    opacity: 1;
  }
}

nav {    
  margin-top: $outer-padding;

  span { display: flex; }

  a {
    animation: fadeslide .3s $base-easing forwards;
    opacity: 0;
     transform: translateX(50px);
    display: flex;
    color: black;
    font-weight: normal;
    font-size: 22px;
    text-decoration: none;
    text-transform: uppercase;
    padding: 10px;
    background: white;
    color: black;
    margin-bottom: 5px;
  }

  @for $i from 1 through 3 {
    span:nth-child(#{$i}) a {
      animation-delay: ($i - 1) * 50ms;
    }
  }
}

.shade {
  @include position(fixed, 0 0 0 0);
  z-index: 500;
  background: rgba(255, 255, 255, .5);
  backdrop-filter: blur(10px);
  opacity: 0;
  pointer-events: none;
  transition: opacity .2s $base-easing;

  &.visible { opacity: 1; }
}
</style>