import React from 'react'
import '../styles/components/kaleidosync.css'

const Kaleidosync = (props) => (
  <div className={props.playing ? 'kaleidosync playing' : 'kaleidosync'}>
    <div className="text">
      <h2>Kaleidosync</h2>
      <p>A web-based Spotify visualizer.</p>
      <button onClick={props.buttonClick}>
        { !props.playing && <span>Demo</span> }
        { props.playing && <span>Stop</span> }
      </button> 
      <a href="https://kaleidosync.herokuapp.com" target="_blank">View Project</a>
    </div>
    <canvas id="kaleidoscope"></canvas>
    <audio></audio>
  </div>
)

export default Kaleidosync