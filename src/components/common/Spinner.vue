<template>
  <main>
    <div class="spin-con">
      <i class="spinner" />
    </div>
  </main>
</template>

<style lang="scss" scoped>
@keyframes spin {
  0% {
    transform: translateY(-50%) translateX(-50%) rotate(0deg);
  }
  100% {
    transform: translateY(-50%) translateX(-50%) rotate(360deg);
  }
}

main {
  @include size(100vw, 100%);
  @include flex;
  @include position(fixed, 0 null null 0);
  overflow: hidden;
  background: var(--black);
  z-index: 2000;
}

.spinner {
  @include size(40px);
  @include center;
  display: block;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  border: 1px solid var(--white);
  transition: opacity 1000ms var(--easing);
  border-bottom-color: transparent;
}

.spin-con {
  transition: all 350ms var(--easing);
}

.loaded .spin-con {
  transform: scale(0);
}
</style>
