<template lang="pug">
.icon-button(:class="{ disabled, [size]: size, [textPosition]: textPosition }")
  button(:class="{ border, text, [color]: color }" @click="onClick")
    icon(:icon="[set, icon]")
    span(:class="{ visible: textVisible }" ref="text" @transitionend="onTransitionEnd") {{ displayedText }} &nbsp;
</template>

<script>
// import { once } from '@/util/dom'

export default {
  props: {
    set: {
      type: String,
      default: 'fal'
    },

    icon: {
      type: String,
      required: true
    },

    border: {
      type: Boolean,
      default: false
    },

    text: {
      type: String,
      default: null
    },

    color: {
      type: String,
      default: 'black'
    },

    disabled: {
      type: Boolean,
      default: false
    },

    size: {
      type: String,
      default: 'default'
    },

    textPosition: {
      type: String,
      default: 'bottom'
    }
  },
  data: () => ({
    displayedText: '',
    nextText: '',
    textVisible: false
  }),

  watch: {
    text: {
      async handler (val, old) { 
        if (!old) {
          this.displayedText = val
          this.textVisible = !!val
          return
        }

        this.textVisible = false
        this.nextText = val
      },
      immediate: true
    }
  },

  methods: {
    onClick () {
      if (!this.disabled) this.$emit('click')
    },
    onTransitionEnd () {
      if (!this.textVisible && typeof this.nextText === 'string') {
        this.displayedText = this.nextText
        this.nextText = null
        this.textVisible = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-button {
  @include flex;
  transition: opacity $base-transition;
  text-align: center;

  &.disabled {
    opacity: .4;

    &:hover button {
      transform: none;
      cursor: default;
    }
  }

  &.bottom {
    span {
      @include position(absolute, 110% null null 50%);
    }
  }

  &.top {
    span { 
      @include position(absolute, null null -110% 50%);
    }
  }
}

.small {
  button {
    font-size: 28px;
  }
}

button {
  @include icon-button;
}

.white {
  color: $white;

  * { color: inherit; }
}

span {
  @include position(absolute, 50% null null 50%);
  transform: translateX(-50%) translateY(-50%);
  text-align: center;
  font-size: .8rem;
  font-weight: 700;
  text-transform: uppercase;
  display: block;
  opacity: 0;
  transition: opacity $base-transition;

  &.visible { opacity: 1; }
}
</style>