import React, { Component, createRef } from 'react'
import { connect } from 'react-redux'
import * as actions from './actions'
import Vivus from 'vivus'
import Logo from '../svg/Logo'
import './Header.scss'

class Header extends Component {
  constructor() {
    super()
    
    this.sitemap = [
      { title: 'Home', link: '/' },
      { title: 'Work', link: '/work' },
      { title: 'Skills', link: '/skills' },
      { title: 'Contact', link: '/contact' }
    ]

    this.shade = createRef()
  }

  render() {
    return (
      <header className="Header" data-open={this.props.open}>
        <div className="container">
          <a className="logo" onClick={this.toggleMenu} onMouseEnter={this.drawLogo}>
            <Logo />
          </a>
        </div>

        <nav>
          <ul className="container">
            { this.sitemap.map((page, i) =>
              <li key={i}>
                <a className={page.title} href={page.link} onClick={this.navigate.bind(this, page)}>
                  <span>{page.title}</span>
                </a>
              </li>
            )}
          </ul>
        </nav>

        <div ref={this.shade} className="Shade" data-target={this.props.target} data-transition={this.props.transitionState}>
          <div className="boxes">
            { this.sitemap.map((page, i) => <div className={page.title} key={i} /> )}
          </div>
        </div>
      </header> 
    )
  }

  drawLogo = () => {
    if (this.props.open === false) {
      new Vivus('logo', { duration: 30 })
    }
  }

  toggleMenu = () => {
    this.props.toggleMenu()
  }

  navigate = (page, e) => {
    e.preventDefault()

    if (this.props.currentPath === page.link) {
      return this.toggleMenu()
    }

    if (this.props.transitionState === 'none') {
      this.props.navigate(page, this.shade.current)
    }
  }
}

const mapStateToProps = (state) => {
  return {
    currentPath: state.router.location.pathname,
    open: state.header.open,
    target: state.header.target,
    transitionState: state.header.transitionState
  }
}

const mapDispatchToProps = (dispatch) => {
  const toggleMenu = () => dispatch(actions.toggleMenu())
  const navigate = (page, shade) => dispatch(actions.navigate(page, shade))

  return { toggleMenu, navigate }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)