import React, { Component, createRef } from 'react'
import './Contact.scss'

class Contact extends Component {
  render() {
    return (
      <div className="Contact">
        <div ref={this.links} className="links">
          <h1>Tell me your secrets.</h1>
          <a href="mailto:contact@zachwinter.com">Email</a>
          <a href="tel:18508428313">Phone</a>
          <a href="https://www.linkedin.com/in/zachwinter/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://www.github.com/zachwinter" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>
    )
  }
}

export default Contact 