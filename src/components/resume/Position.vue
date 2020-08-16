<template lang="pug">
.position(v-if="position" :class="{ active }" @transitionend="$emit('transition-end')")
  div
    .title {{ position.title }} @ #[strong {{ position.company }}]
    .period {{ from }} - {{ to }}
    .description {{ position.description }}
</template>

<script>
import format from 'date-fns/format'

const DATE_FORMAT = 'MMM yyyy'

export default {
  props: {
    position: {
      type: Object,
      required: true
    },
    active: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    from () {
      return format(this.position.period[0], DATE_FORMAT)
    },
    to () {
      if (this.position.current) return 'Now'
      return format(this.position.period[1], DATE_FORMAT)
    }
  }
}
</script>

<style lang="scss" scoped>
$offset: 30%;

span {
  background: rgba($white, .5);

  .dark & { background: rgba($black, .5); }
}
.position {
  @include flex;
  @include position(fixed, 0 0 0 0);
  @include position(fixed, 0 notch(right) 0 notch(left));
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 $outer-padding;
  text-align: center;
}

.title {
  @include scale(font-size 1.5rem 3rem);
  transition: opacity $resume-transition, transform $resume-transition;
  transform: scale(1.2) translateY(-20px);
  opacity: 0;
  position: relative;
}

.period {
  @include scale(font-size 1rem 1.5rem);
  line-height: 1;
  opacity: 0;
  transition: opacity $resume-transition, transform $resume-transition;
  text-transform: uppercase;
  transform: scale(.3) translateY(20px);
  margin: spacer(1) 0 spacer(2) 0;
  // will-change: transform, opacity;
} 

.description {
  @include scale(font-size 1rem 1.5rem);
  opacity: 0;
  transition: opacity $resume-transition, transform $resume-transition;
  transform: translateY(-$offset) scale(.7);
  // will-change: transform, opacity;
}

.active {
  .description, .title, .period {
    transform: translateY(0%);
    opacity: 1;
  }
}

@include mobile-landscape {
  .title {
    font-size: 1.5rem;
  }
  
  .description {
    font-size: .7rem;
  }
}
</style> 