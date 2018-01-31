import React, { Component } from 'react'
import Vivus from 'vivus'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { TOGGLE_NAV, BEGIN_PAGE_TRANSITION, FINISH_PAGE_TRANSITION, RESET_PAGE_TRANSITION } from '../constants'
import '../styles/components/header.css'
 
class Header extends Component {
  render() {
    return (
      <header id="header" data-open={this.props.header.open}>
        <div className="container">
          <a className="logo" onClick={this.toggleMenu} onMouseEnter={this.drawLogo}>
            <svg id="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 178.06 250.34">
              <path d="M873.4,531.92S1160.15,225.05,934.11,549c45.79-17.9,111,7.6,57.37,71.05-40.59,48-12-64.5,48.18-100.34" transform="translate(-866.45 -390.97)" fill="none" stroke="#000" strokeMiterlimit="10" strokeWidth="19"/>
            </svg>
          </a>
        </div>

        <nav>
          <ul className="container">
            <li><a href="/" data-target="home" onClick={this.navigate}><span>Home</span></a></li>
            <li><a href="/work" data-target="work" onClick={this.navigate}><span>Work</span></a></li>
            <li><a href="/about" data-target="about" onClick={this.navigate}><span>About</span></a></li>
            <li><a href="/contact" data-target="contact" onClick={this.navigate}><span>Contact</span></a></li>
          </ul>
        </nav>

        <div id="shade" data-target={this.props.header.transitionTarget} data-transition={this.props.header.transitionState}>
          <div className="boxes">
            <div className="home"></div>
            <div className="work"></div>
            <div className="about"></div>
            <div className="contact"></div>
          </div>
        </div>
      </header> 
    )
  }

  componentDidMount = () => {
    this.shade = document.getElementById('shade')
  }

  drawLogo = () => {
    if (this.props.header.open === false) {
      new Vivus('logo', { duration: 30 })
    }
  } 

  toggleMenu = () => {
    this.props.dispatch({ type: TOGGLE_NAV })
  }

  navigate = (e) => {
    e.preventDefault()

    const route = e.currentTarget.getAttribute('href')
    const shadeClass = e.currentTarget.dataset.target

    if (this.props.store.router.location.pathname === route) {
      this.toggleMenu()
      return
    }

    if (this.props.header.transitionState === 'none') {
      this.beginPageTransition(route, shadeClass)
    }
  }

  beginPageTransition = (route, shadeClass) => {
    const transitionEnd = () => {
      this.props.dispatch( push(route) )
      this.finishPageTransition()
      this.shade.removeEventListener('transitionend', transitionEnd)
    }

    this.shade.addEventListener('transitionend', transitionEnd)

    this.toggleMenu()

    this.props.dispatch({ type: BEGIN_PAGE_TRANSITION, payload: shadeClass })
  }

  finishPageTransition = () => {
    const transitionEnd = () => {
      this.props.dispatch({ type: RESET_PAGE_TRANSITION })
      this.shade.removeEventListener('transitionend', transitionEnd)
    }

    this.shade.addEventListener('transitionend', transitionEnd)

    this.props.dispatch({ type: FINISH_PAGE_TRANSITION })
  }
}

const mapStateToProps = store => {
  return {
    store: store,
    header: store.header
  }
}

export default connect(mapStateToProps)(Header)