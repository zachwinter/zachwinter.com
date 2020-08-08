<template lang="pug">
.contact
  h1 Tell me your secrets
  .links
    a(href="mailto:contact@zachwinter.com").email: IconButton(icon="envelope")
    a(href="tel:18508428313").phone: IconButton(icon="mobile")
    a(href="https://t.me/yozic" target="telegram").telegram: IconButton(icon="telegram-plane" set="fab")
    a(href="https://www.instagram.com/zachary.io" target="instagram").instagram: IconButton(icon="instagram" set="fab")
    a(href="https://www.linkedin.com/in/zachwinter/" target="linkedin").linkedin: IconButton(icon="linkedin" set="fab")
    a(href="https://www.github.com/zachwinter" target="github").github: IconButton(icon="github" set="fab")
</template>

<script>
import IconButton from '@/components/common/IconButton'

export default {
  components: { IconButton }
}
</script>

<style lang="scss" scoped>
.contact {
  @include page;
  @include flex(center, center, column);
}

h1 {
  @include scale(font-size 1rem 4rem);
  text-transform: uppercase;
}

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
    animation: slide-in 800ms ease-out forwards;
    transition: opacity 100ms linear !important;
    opacity: 0;
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