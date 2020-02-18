import Sync from './sync'
import Sketch from './sketch'

export default class Visualizer {
  constructor ({
    volumeSmoothing = 100, 
    width = window.innerWidth,
    height = window.innerHeight,
    hidpi = true,
    container = document.body,
    fixed = false,
    staticIntervalBaseDuration = 10000,
    syncOnly = false,
    staticFactory = function (i) { return i }
  }) {
    /** Initialize Sync class. */

    this.sync = new Sync({
      volumeSmoothing,
      fixed,
      staticIntervalBaseDuration,
      staticFactory
    })

    if (syncOnly === false) {
      /** Initialize Sketch class. Assign `this.paint` as the main animation loop. */
      this.sketch = new Sketch({
        main: this.paint.bind(this),
        hidpi,
        width,
        height,
        container
      })

      this.watch()
    }

    this.hooks()

    if (syncOnly === false) {
      if (this.sync.fixed) {
        this.sketch.start()
      }
    }
  }

  /**
   * @method watch - Watch for changes in state.
   */
  watch () {
    this.sync.watch('active', val => {
      /** Start and stop sketch according to the `active` property on our Sync class. */
      if (val === true) {
        this.sketch.start()
      } else {
        this.sketch.stop()
      }
    })
  }

  /**
   * @method hooks - Attach hooks to interval change events. 
   */
  hooks () {

  }

  /**
   * @method paint - Paint a single frame of the main animation loop.
   */
  paint () {

  }
}