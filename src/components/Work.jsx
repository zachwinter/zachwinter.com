import React, { Component } from 'react'
import { connect } from 'react-redux'
import { SectionsContainer, Section } from 'react-fullpage'
import FeaturedWork from './FeaturedWork'
import CardinalShack from './CardinalShack'
import GitHub from './GitHub'
import '../styles/components/work.css'

class Work extends Component {
  constructor() {
    super()

    this.touch = {}
    this.scrolling
    this.transform = 0
  }

  stopVisualizer() {
    window.VISUALIZER.audio.pause()
    window.VISUALIZER.stop()
    window.VISUALIZER.canvas.stopPaint()
    window.VISUALIZER.toast.hide()
  }

  transitionEnd = (e) => {
    e.preventDefault()

    this.scrolling = false
    this.main.removeEventListener('transitionend', this.transitionEnd)
  }

  touchStart = (e) => {
    this.touch.start = e.changedTouches[0].pageY;
  }

  touchEnd = (e) => {
   this.touch.end = e.changedTouches[0].pageY;

   let delta = this.touch.end - this.touch.start

    if (delta < -50) {
      this.scrollUp()
    }

    if (delta > 50) {
      this.scrollDown()
    }
  }

  scrollUp = () => {
    if (this.scrolling === true) {
      return
    } else {
      this.scrolling = true
    }
    this.transform = this.transform - (100/this.screens.length)
    if (this.transform < -50 * (this.screens.length - 1)) { this.transform = -50 * (this.screens.length -1) }
    this.main.style.transform = `translateY(${this.transform}%)`
    this.main.addEventListener('transitionend', this.transitionEnd)
    this.stopVisualizer()
  }

  scrollDown = () => {
    if (this.scrolling === true) {
      return
    } else {
      this.scrolling = true
    }
    this.transform = this.transform + (100/this.screens.length)
    if (this.transform >= 0) { this.transform = 0; }
    this.main.style.transform = `translateY(${this.transform}%)`
    this.main.addEventListener('transitionend', this.transitionEnd)
    this.stopVisualizer()
  }

  componentDidMount = () => {
    this.screens = document.querySelectorAll('.work > *')
    this.main = document.querySelector('main')

    document.body.addEventListener('touchstart', this.touchStart)
    document.body.addEventListener('touchend', this.touchEnd)

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
  }

  render() {
    return (
      <div className="work">
        <FeaturedWork />
        <CardinalShack />
        <GitHub />
      </div>
    )
  }
} 

const mapStateToProps = store => {
  return {
    
  }
}

export default connect(mapStateToProps)(Work)