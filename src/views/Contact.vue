<template lang="pug">
.contact(ref="container")
  h1: span Let's chat!
  p: span I'm actively exploring new opportunities.
  .links
    a(href="tel:18508428313").phone: IconButton(icon="mobile")
    a(href="mailto:contact@zachwinter.com").email: IconButton(icon="envelope")
    a(href="https://www.linkedin.com/in/zachwinter/" target="linkedin").linkedin: IconButton(icon="linkedin" set="fab")
    a(href="https://t.me/yozic" target="telegram").telegram: IconButton(icon="telegram-plane" set="fab")
    a(href="https://www.instagram.com/zachary.io" target="instagram").instagram: IconButton(icon="instagram" set="fab")
    a(href="https://www.github.com/zachwinter" target="github").github: IconButton(icon="github" set="fab")
</template>

<script>
import IconButton from '@/components/common/IconButton'
import { bind } from '@/store/util'

export default {
  components: { IconButton },
  computed: bind(['nav/previous', 'nav/next']),
  watch: {
    previous () {
      this.$store.commit(`nav/SET_TRANSITIONING`, true)
      this.$router.push({ name: 'Work' })
    },
    next () {
      this.$store.commit(`nav/SET_TRANSITIONING`, true)
      this.$router.push({ name: 'Resume' })
    }
  },
  mounted () {
    this.$store.dispatch('nav/set', {
      previous: {
        visible: true,
        text: 'Work'
      },
      next: {
        visible: true,
        text: 'Resume'
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.contact {
  @include page;
  @include flex(center, center, column);
}

h1 {
  @include scale(font-size 1.5rem 4rem);
  margin-bottom: $base-margin;
  text-transform: uppercase;
}

p {
  @include scale(font-size 1rem 2rem);
}

// h1, p {
//   @include span-text;
// }

@keyframes slide-in {
  0% {
    transform: translateY(30px) scale(0);
    opacity: 0;
  }
  
  100% {
    transform: translateY(0px);
    opacity: 1;
  }
}

.links {
  @include flex;
  margin-top: $base-margin;

  a {
    @include cascade(6, 150ms);
    animation: slide-in 500ms ease-out forwards;
    transition: opacity 100ms linear !important;
    opacity: 0;
    padding: 0 10px;

    @include max-width(mobile) {
      padding: 0 5px;
    }
  }

  &:hover {
    .icon-button {
      opacity: .2 !important;
    }

    .icon-button:hover {
      transition-duration: 100ms;
      opacity: 1 !important;
    }
  }
}
</style>