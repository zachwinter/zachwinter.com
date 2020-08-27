<template lang="pug">
.ctas(:class="{ margin: margin === true }")
  a(:href="href" :target="target" :class="{ [color]: color }").view {{ text }}
  a(v-if="github" :href="github" target="github"): IconButton(icon="github" set="fab" size="small")
  ViewToggle(v-if="toggle && !mobile")
</template>

<script>
import IconButton from '@/components/common/IconButton'
import ViewToggle from '@/components/work/ViewToggle'
import { dualBind } from '@/store/util'

export default {
  props: {
    href: String,
    target: String,
    text: String,
    toggle: {
      type: Boolean,
      default: true
    },
    margin: {
      type: Boolean,
      default: false
    },
    github: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: 'black'
    }
  },
  components: { ViewToggle, IconButton },
  computed: dualBind(['ui/mobile', 'work/viewMode']),
  watch: {
    mobilePortrait (val) {
      if (val) this.viewMode = 'desktop'
    }
  }
}
</script>
<style lang="scss" scoped>
.ctas {
  @include flex(center, flex-start);
  margin-top: 20px;
}

.view {
  @include button;
  padding: 0;
  height: auto;
  background: $white;
  line-height: 1;

  .dark & {
    color: $white;
    background: $black;
  }

  @include mobile {
    padding: 0;
    height: auto;
    line-height: 1;
  }

  @include mobile-portrait {
    margin-top: spacer(1);
  }
}
</style>

<style lang="scss">
.bullets.static + .ctas {
  margin-top: 0;
}
</style>