import React, { Component } from 'react'
import { connect } from 'react-redux'
import { SectionsContainer, Section } from 'react-fullpage'
import Kaleidosync from './Kaleidosync'
import CardinalShack from './CardinalShack'
import GitHub from './GitHub'
import '../styles/components/work.css'

class Work extends Component {
  constructor() {
    super()

    this.state = {
      screens: [],
      index: 0,
      touch: {},
      scrolling: false
    }
  }

  initSlider = () => {
    let children = document.querySelectorAll('.screens > *'),
        nodeListArray = [];

    for (var i = 0; i < children.length; i++) {
      nodeListArray.push(children[i])
    }

    this.setState({
      screens: nodeListArray,
      index: 0,
      container: document.querySelector('.screens')
    })
  }

  slideTransition = () => {
    let transform = this.state.index * (-100/this.state.screens.length);

    this.state.container.style.transform = `translateY(${transform}%)`
    this.state.container.addEventListener('transitionend', this.transitionEnd)
    window.VISUALIZER.audio.pause()
    window.VISUALIZER.stop()
    window.VISUALIZER.canvas.stopPaint()
    window.VISUALIZER.toast.hide()
  }

  transitionEnd = (e) => {
    this.setState({
      scrolling: false
    })

    this.state.container.removeEventListener('transitionend', this.transitionEnd)
  }

  touchStart = (e) => {
    this.setState({
      touch: {
        start: e.changedTouches[0].pageY,
        end: this.state.touch.end
      }
    })
  }

  touchEnd = (e) => {
    this.setState({
      touch: {
        start: this.state.touch.start,
        end: e.changedTouches[0].pageY
      }
    })

    let delta = this.state.touch.end - this.state.touch.start

    if (delta < -50) {
      this.scrollUp()
    }

    if (delta > 50) {
      this.scrollDown()
    }
  }

  scrollUp = () => {
    if (this.state.scrolling === true || this.state.index === this.state.screens.length - 1) {
      return
    }

    this.setState({
      scrolling: true,
      index: this.state.index + 1
    }, this.slideTransition)
  }

  scrollDown = () => {    
    if (this.state.scrolling === true || this.state.index === 0) {
      return
    }

    this.setState({
      scrolling: true,
      index: this.state.index - 1
    }, this.slideTransition)
  }

  goTo = (e) => {
    console.log(e)
  }

  componentDidMount = () => {
    this.initSlider()

    let scroll = (e) => {
      let delta = e.wheelDelta

      if (delta < -100) {
        this.scrollUp()
      }

      if (delta > 100) {
        this.scrollDown()
      }
    }

    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = 0
    document.body.style.right = 0
    document.body.style.left = 0

    document.body.addEventListener('mousewheel', scroll)
    document.body.addEventListener('touchstart', this.touchStart)
    document.body.addEventListener('touchend', this.touchEnd)
  }

  componentWillUnmount() {
    this.state.container.style.transform = `translateY(0%)`
  }

  render() {
    return (
      <div className="work">
        <div className="screens">
          <Kaleidosync />
          <CardinalShack />
          <GitHub />
        </div>
        <ul className={this.state.index === 2 ? 'screen-navigation black' : 'screen-navigation'}>
          { this.state.screens.map((screen, i) => <li key={i} className={i === this.state.index ? 'active' : ''} onClick={this.goTo.bind(this)}></li> )}
        </ul>
      </div>
    )
  }
} 

const mapStateToProps = store => {
  return {
    
  }
}

export default connect(mapStateToProps)(Work)