<template>
  <main>
    <span class="spinner" />
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
  @include size(100%);
  @include flex;
  @include position(fixed, 0 null null 0);
  background: var(--black);

}

.spinner {
  @include size(40px);
  @include center;
  display: block;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  border: 4px solid var(--white);
  border-bottom-color: transparent;
}
</style>
