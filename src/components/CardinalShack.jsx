import React, { Component } from 'react'
import _ from 'lodash'
import '../styles/components/cardinal-shack.css'

class CardinalShack extends Component {
  constructor() {
    super()
  }

  render = () => {
    return (
      <div className="cardinal-shack">
        <div className="text">
          <h2>CardinalShack</h2>
          <p>Limited edition shoes.</p>
          <a href="https://cardinalshack.com" target="_blank">View Project</a>
        </div>
      </div>
    )
  }
}

export default CardinalShack