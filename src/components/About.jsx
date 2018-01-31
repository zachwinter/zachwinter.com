import React, { Component } from 'react'
import { connect } from 'react-redux'
import '../styles/components/about.css'

class About extends Component {
  render() {
    return (
      <div className="about">
        <h1>Bio coming soon.</h1>
      </div>
    )
  }
}

const mapStateToProps = store => {
  return {
    
  }
}

export default connect(mapStateToProps)(About)