import React, { Component } from 'react'
import _ from 'lodash'
import Kaleidoscope from '../js/kaleidoscope'
import '../styles/components/kaleidosync.css'

class Kaleidosync extends Component {
  constructor() {
    super()

    this.state = {
      playing: false,
      buttonClicked: false
    }
  }

  playClick() {
    if (this.state.buttonClicked === false) {
      window.VISUALIZER.audio.play()
      this.setState({
        buttonClicked: true
      })
    }

    if (this.state.playing === true) {
      window.VISUALIZER.audio.pause()
      window.VISUALIZER.stop()
      window.VISUALIZER.canvas.stopPaint()
      this.setState({
        playing: false
      })
    } else {   
      window.VISUALIZER.activeDemo = _.sample(window.VISUALIZER.demoSongs);
      window.VISUALIZER.interval = false;
      window.VISUALIZER.setEventHooks()

      window.VISUALIZER.init()
      window.VISUALIZER.canvas.startPaint()
      this.setState({
        playing: true
      })
    } 
  }

  componentDidMount() {
    window.VISUALIZER = new Kaleidoscope(true, true)
  }
 
  componentWillUnmount() {
    window.VISUALIZER.stop()
    window.VISUALIZER.canvas.stopPaint()
    delete window.VISUALIZER
  }

  render() {
    return (
      <div className={this.state.playing ? 'kaleidosync playing' : 'kaleidosync'}>
        <div className="text">
          <h2>Kaleidosync</h2>
          <p>A web-based Spotify visualizer.</p>
          <button onClick={this.playClick.bind(this)}>
            { !this.state.playing && <span>Demo</span> }
            { this.state.playing && <span>Stop</span> }
          </button> 
          <a href="https://kaleidosync.herokuapp.com" target="_blank">View Project</a>
        </div>
        <canvas id="kaleidoscope"></canvas>
        <audio></audio>
      </div>
    )
  }
}

export default Kaleidosync