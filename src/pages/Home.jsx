import React, { Component, createRef } from 'react'
import Typed from 'typed.js'
import './Home.scss'

class Home extends Component {
  constructor() {
    super()

    this.video = createRef()
  }

  render() {
    return (
      <div className="Home">
        <div className="container">
          <h1></h1>
        </div> 
        <video ref={this.video} muted playsInline autoPlay poster="/img/video-cover.jpg">
          <source src="/video/homepage.mp4" type="video/mp4"></source>
        </video>
      </div>
    )
  }
  
  componentDidMount() {
    this.sizeVideo()
    window.addEventListener('resize', this.resize)
    this.video.current.addEventListener('canplaythrough', this.initTyped)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
    this.typed.destroy()
  }

  initTyped = () => {
    this.video.current.removeEventListener('canplaythrough', this.initTyped)
    this.typed = new Typed('h1', {
      strings: [`I turn pixels into<br>experiences`],
      showCursor: false,
      startDelay: 2200,
      typeSpeed: 60
    })
  }

  resize = () => {
    clearTimeout(this.resizeTimeout)

    this.resizeTimeout = setTimeout(() => {
      this.sizeVideo()
    }, 100)
  }

  sizeVideo = () => {
    if ( window.innerWidth/window.innerHeight < 16/9 ) {
      this.video.current.classList.add('vertical')
    } else {
      this.video.current.classList.remove('vertical')
    }
  }
}

export default Home