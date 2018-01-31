import React, { Component } from 'react'
import { connect } from 'react-redux'
import { SectionsContainer, Section } from 'react-fullpage'
import _ from 'lodash'
import Kaleidosync from './Kaleidosync'
import CardinalShack from './CardinalShack'
import GitHub from './GitHub'
import Kaleidoscope from '../visualizer/kaleidoscope'
import { INIT_WORK, START_SCROLL, END_SCROLL, TOUCH_START, TOUCH_END } from '../constants'
import '../styles/components/work.css'

class Work extends Component {
  constructor() {
    super()

    this.state = {
      visualizerDemoButtonClicked: false,
      visualizerPlaying: false
    }
  }

  render() {
    let state = this.props.store.work,
        transform = state.index * window.innerHeight * -1

    return (
      <div className="work">
        <div className="screens" style={{transform: `translateY(${transform}px)`}}>
          <Kaleidosync buttonClick={this.visualizerDemoButton} playing={this.state.visualizerPlaying} />
          <CardinalShack />
          <GitHub />
        </div>
        <ul className={state.index === 2 ? 'screen-navigation black' : 'screen-navigation'}>
          { state.screens.map((screen, i) => <li key={i} className={i === state.index ? 'active' : ''} onClick={this.goTo.bind(this, i)}></li> ) }
        </ul>
      </div>
    )
  }

  componentDidMount() {
    let screens = document.querySelectorAll('.screens > *'),
        screensArray = []

    for (var i = 0; i < screens.length; i++) {
      screens[i].style.height = window.innerHeight + 'px'
      screensArray.push(screens[i])
    }

    this.props.dispatch({
      type: INIT_WORK,
      payload: {
        container: document.querySelector('.screens'),
        screens: screensArray
      }
    })

    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = 0
    document.body.style.right = 0
    document.body.style.left = 0

    document.body.addEventListener('mousewheel', this.mouseWheel)
    document.body.addEventListener('touchstart', this.touchStart)
    document.body.addEventListener('touchend', this.touchEnd)

    window.addEventListener('resize', this.resize)

    window.VISUALIZER = new Kaleidoscope(true, true)
  }

  componentWillUnmount() {
    document.body.style.overflow = 'auto'
    document.body.style.position = 'static'
    document.body.removeEventListener('mousewheel', this.mouseWheel)
    document.body.removeEventListener('touchstart', this.touchStart)
    document.body.removeEventListener('touchend', this.touchEnd)
    window.removeEventListener('resize', this.resize)

    this.destroyVisualizer()
  }
  
  transitionEnd = (e) => {
    this.props.dispatch({ type: END_SCROLL })

    this.props.store.work.container.removeEventListener('transitionend', this.transitionEnd)
  }

  touchStart = (e) => {
    this.props.dispatch({
      type: TOUCH_START,
      payload: e.changedTouches[0].pageY
    })
  }

  touchEnd = (e) => {
    this.props.dispatch({
      type: TOUCH_END,
      payload: e.changedTouches[0].pageY
    })

    if (this.props.store.work.touchDelta < -50) {
      this.scrollUp()
    }

    if (this.props.store.work.touchDelta > 50) {
      this.scrollDown()
    }
  }

  resize = () => {
    clearTimeout(this.resizeTimeout)

    this.resizeTimeout = setTimeout(() => {
      this.setScreenSize()
      this.stopVisualizer()
      window.VISUALIZER = new Kaleidoscope(true, true)
      this.forceUpdate()
    }, 300)
  }

  mouseWheel = (e) => {
    let delta = e.wheelDelta

    if (delta < -150) {
      this.scrollUp()
    }

    if (delta > 150) {
      this.scrollDown()
    }
  }

  scrollUp = () => {
    if (this.props.store.work.index !== this.props.store.work.screens.length - 1) {
      this.goTo(this.props.store.work.index + 1)
    } 
  }

  scrollDown = () => {    
    if (this.props.store.work.index !== 0) {
      this.goTo(this.props.store.work.index - 1)
    }
  }

  goTo = (index) => {
    if (this.props.store.work.scrolling === false) {
      if (this.props.store.work.index === 0) {
        this.stopVisualizer()
      }

      this.props.store.work.container.addEventListener('transitionend', this.transitionEnd)
      
      this.props.dispatch({
        type: START_SCROLL,
        payload: index
      })
    }
  }

  startVisualizer = () => {
    window.VISUALIZER.activeDemo = _.sample(window.VISUALIZER.demoSongs);
    window.VISUALIZER.interval = false;
    window.VISUALIZER.setEventHooks()
    window.VISUALIZER.init()
    window.VISUALIZER.canvas.startPaint()
    this.setState({
      visualizerPlaying: true
    })
  }

  stopVisualizer = () => {
    window.VISUALIZER.audio.pause()
    window.VISUALIZER.stop()
    window.VISUALIZER.canvas.stopPaint()
    window.VISUALIZER.toast.hide()
    this.setState({
      visualizerPlaying: false
    })
  }

  destroyVisualizer = () => {
    this.stopVisualizer()
    delete window.VISUALIZER
  }

  visualizerDemoButton = () => {
    if (this.state.visualizerDemoButtonClicked === false) {
      window.VISUALIZER.audio.play()
      this.setState({
        visualizerDemoButtonClicked: true
      })
    }

    if (this.state.visualizerPlaying === true) {
      this.stopVisualizer()
    } else {   
      this.startVisualizer()
    } 
  }

  setScreenSize = () => {
    for (var i = 0; i < this.props.store.work.screens.length; i++) {
      this.props.store.work.screens[i].style.height = window.innerHeight + 'px'
    }
  }
} 

const mapStateToProps = (store) => {
  return {
    store
  }
}

export default connect(mapStateToProps)(Work)