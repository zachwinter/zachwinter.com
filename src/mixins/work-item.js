import WorkItem from '@/components/work/WorkItem'
import ViewToggle from '@/components/work/ViewToggle'
import IconButton from '@/components/common/IconButton'
import CTAs from '@/components/work/CTAs'
import { bind } from '@/store/util'

export default {
  props: {
    active: Boolean
  },
  components: {
    WorkItem,
    ViewToggle,
    IconButton,
    CTAs
  },
  computed: bind('ui/mobile')
}