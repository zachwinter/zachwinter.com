import React, { Component } from 'react'
import { connect } from 'react-redux'
import GitHub from './screens/GitHub'
import CardinalShack from './screens/CardinalShack'
import Kaleidosync from './screens/Kaleidosync'
import Visualizer from './kaleidosync/kaleidoscope'
import * as actions from './actions'
import './Work.scss'

class Work extends Component {
  render() {
    const transform = this.props.index * window.innerHeight * -1

    return (
      <div className="Work">
        <div className="screens" style={{transform: `translateY(${transform}px)`}}>
          <Kaleidosync />
          <CardinalShack />
          <GitHub />
        </div>

        <ul className={this.props.index === 2 ? 'screen-navigation black' : 'screen-navigation'}>
          { this.props.screens.map((screen, i) => <li key={i} className={i === this.props.index ? 'active' : ''}></li> ) }
        </ul>
      </div>
    )
  }

  componentDidMount() {
    const container = document.querySelector('.screens')
    const screens = [...document.querySelectorAll('.screens > *')]
    
    screens.forEach((screen) => {
      screen.style.height = window.innerHeight + 'px'
    })

    document.body.classList.add('fixed')
    document.body.addEventListener('mousewheel', this.mouseWheel)
    document.body.addEventListener('touchstart', this.touchStart)
    document.body.addEventListener('touchend', this.touchEnd)

    this.props.init({ container, screens })

    this.visualizer = new Visualizer(true)
  }

  componentWillUnmount() {
    document.body.classList.remove('fixed')
    document.body.removeEventListener('mousewheel', this.mouseWheel)
    document.body.removeEventListener('touchstart', this.touchStart)
    document.body.removeEventListener('touchend', this.touchEnd)
  }

  mouseWheel = (e) => {
    const delta = e.wheelDelta

    if (delta < -150) { this.props.next() }
    if (delta >  150) { this.props.previous() }
  }

  touchStart = (e) => {
    this.props.touchStart(e.changedTouches[0].pageY)
  }

  touchEnd = (e) => {
    const delta = e.changedTouches[0].pageY - this.props.touch

    if (delta < -50) { this.props.next() }
    if (delta >  50) { this.props.previous() }
  }
}

const mapStateToProps = (state) => {
  return {
    index: state.work.index,
    screens: state.work.screens,
    container: state.work.container,
    touch: state.work.touchStart
  }
}

const mapDispatchToProps = (dispatch) => {
  const next = () => dispatch(actions.next())
  const previous = () => dispatch(actions.previous())
  const init = (els) => dispatch(actions.init(els))
  const touchStart = (delta) => dispatch(actions.touchStart(delta))

  return { next, previous, init, touchStart }
}

export default connect(mapStateToProps, mapDispatchToProps)(Work)