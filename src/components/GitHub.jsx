import React, { Component } from 'react'
import _ from 'lodash'
import '../styles/components/github.css'

class GitHub extends Component {
  constructor() {
    super()
  }

  render = () => {
    return (
      <div className="github">
        <div className="text">
          <h2>GitHub</h2>
          <p>My current projects.</p>
        </div>
      </div>
    )
  }
}

export default GitHub