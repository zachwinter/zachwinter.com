<template lang="pug">
.view-toggle(v-if="!mobile")
  IconButton(icon="desktop-alt" size="small" @click="selectDesktop" :class="{ active: viewMode === 'desktop' }")
  IconButton(icon="mobile"  size="small" @click="selectMobile" :class="{ active: viewMode === 'mobile' }")
</template>

<script>
import IconButton from '@/components/common/IconButton'
import { SET_VIEW_MODE } from '@/store/modules/work'
import { bind } from '@/store/util'

export default {
  components: { IconButton },
  computed: bind([
    'work/viewMode',
    'ui/mobile'
  ]),
  methods: {
    selectDesktop () {
      this.$store.commit(`work/${SET_VIEW_MODE}`, 'desktop')
    },
    selectMobile () {
      this.$store.commit(`work/${SET_VIEW_MODE}`, 'mobile')
    }
  }
}
</script>

<style lang="scss" scoped>
.view-toggle {
  @include flex;
  margin-left: $base-margin;
}

.icon-button {
  opacity: .3;

  &.active { opacity: 1; }
}
</style> 