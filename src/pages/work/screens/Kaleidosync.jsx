import React from 'react'
import './Kaleidosync.scss'

const Kaleidosync = () => (
  <div className="Kaleidosync">
    <div className="text">
      <h2>Kaleidosync</h2>
      <p>A web-based Spotify visualizer.</p>
      <a href="https://kaleidosync.herokuapp.com" target="_blank" rel="noopener noreferrer">View Project</a>
    </div>
    <canvas id="kaleidoscope"></canvas>
  </div>
)

export default Kaleidosync