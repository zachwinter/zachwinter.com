<template lang="pug">
.icon-button(:class="{ disabled, [size]: size }")
  button(:class="{ border, text, [color]: color }" @click="onClick")
    icon(:icon="[set, icon]")
    span(v-if="text") {{ text }}
</template>

<script>
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
    }
  },

  methods: {
    onClick () {
      if (!this.disabled) this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-button {
  @include flex;
  transition: opacity $base-transition;

  &.disabled {
    opacity: .4;

    &:hover button {
      transform: none;
      cursor: default;
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
</style>