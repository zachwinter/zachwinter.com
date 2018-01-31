import React, { Component } from 'react'
import Typed from 'typed.js'
import '../styles/components/home.css'

class Home extends Component {
  render() {
    return (
      <div className="home">
        <div className="container">
          <h1 id="typed"></h1>
        </div> 
        <div className="videoContainer">
          <video id="video" muted playsInline autoPlay poster="/img/video-cover.jpg">
            <source src="/static/video/homepage.mp4" type="video/mp4"></source>
          </video>
        </div>
      </div>
    )
  }
  
  componentDidMount() {
    this.video = document.getElementById('video')
    this.sizeVideo()

    window.addEventListener('resize', this.sizeVideo)

    this.video.addEventListener('canplaythrough', this.initTyped)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.sizeVideo)
    this.typed.destroy()
  }

  initTyped = () => {
    this.video.removeEventListener('canplaythrough', this.initTyped)

    this.typed = new Typed('#typed', {
      strings: [
        `I turn pixels into<br>experiences.`
      ],
      showCursor: false,
      startDelay: 2200,
      typeSpeed: 60
    })
  }

  sizeVideo = () => {
    if ( window.innerWidth/window.innerHeight < 16/9 ) {
      this.video.style.height = '100%'
      this.video.style.width = 'auto'
    } else {
      this.video.style.height = 'auto'
      this.video.style.width = '100%'
    }
  }
}

export default Home