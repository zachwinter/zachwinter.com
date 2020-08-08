<template lang="pug">
div: span
</template>

<style lang="scss" scoped>
@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

div {
  @include size(80px); 
  position: absolute;
  margin: auto;
  z-index: 50;
  display: block;
  pointer-events: none;
}

span {
  @include size(64px);
  display: block;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #fff;
  border-color: #fff transparent #fff transparent;
  animation: rotate .6s linear infinite;
}
</style>