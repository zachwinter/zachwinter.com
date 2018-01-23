import React, { Component } from 'react'
import _ from 'lodash'
import Kaleidoscope from '../js/kaleidoscope'
import '../styles/components/featured-work.css'

class FeaturedWork extends Component {
  constructor() {
    super()
  }

  audioCallback = () => {
    this.audio = document.querySelector('audio')
    this.audio.src = `/static/songs/${window.VISUALIZER.activeDemo}.mp3`
    this.audio.play()
  }

  playClick() {
    if (this.playing === true) {
      window.VISUALIZER.audio.pause()
      window.VISUALIZER.stop()
      window.VISUALIZER.canvas.stopPaint()
      this.playing = false;
    } else {   
      window.VISUALIZER.audio.play()
      window.VISUALIZER.audio.pause()
      window.VISUALIZER.activeDemo = _.sample(window.VISUALIZER.demoSongs);
      window.VISUALIZER.interval = false;
      window.VISUALIZER.setEventHooks()

      window.VISUALIZER.init(this.audioCallback)
      window.VISUALIZER.canvas.startPaint()
      this.playing = true;
    } 
  }

  componentWillMount() {
    this.playing = false;
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
      <div className="featured-work">
        <div className="text">
          <h2>Kaleidosync</h2>
          <p>A web-based Spotify visualizer.</p>
          <button onClick={this.playClick.bind(this)}>
            { !this.playing && <span>Demo</span> }
            { this.playing && <span>Stop</span> }
          </button> 
          <a href="https://kaleidosync.herokuapp.com" target="_blank">View Project</a>
        </div>
        <canvas id="kaleidoscope"></canvas>
        <audio src=""></audio>
      </div>
    )
  }
}

export default FeaturedWork