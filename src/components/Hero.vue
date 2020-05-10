<template lang="pug">
.hero 
  div
    h1 #[span(class="hello")] #[span(class="name") I'm Zach]
    p I'm a UI/UX Engineer, currently at #[a(href="https://phin.co" target="phin") pHin].
    p Recently exploring audio-reactive animations, powered by #[a(href="http://the.echonest.com/" target="phin") the Echo Nest].
    p Check out some of my #[router-link(to="/work") work], my #[a(href="https://github.com/zachwinter" target="github") GitHub], or follow me on #[a(href="https://www.instagram.com/zachary.io" target="instagram") Instagram].
</template>

<style lang="scss" scoped>
@keyframes fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.hero {
  @include size(100%);
  padding: 0 $outer-padding;
  text-align: left;
  position: relative;
  z-index: 10;

  @include max-width(tablet) {
    padding: 0 $mobile-outer-padding;
    padding-left: calc(#{$outer-padding} + env(safe-area-inset-left));
  }

  div {
    @include flex(flex-start, flex-end, column);
    @include size(100%);
    padding-bottom: $outer-padding;
  }

  @include min-width(tablet) {
    div {
      @include flex(flex-start, center, column);
    }
  }
}

h1 {
  font-size: 58px;
  display: inline;
  color: black;
  background: white;
  padding: 10px;
  font-weight: regular;
}

p {
  font-size: 22px;
  background: white;
  padding: 5px 10px;
  margin-top: 5px;
}

@include max-width(tablet) {
  h1 {
    font-size: 25px;
  }

  p {
    font-size: 16px;
  }
}

a {
  color: $pink;
}
</style>