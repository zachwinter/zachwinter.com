import React, { Component } from 'react'
import { connect } from 'react-redux'

class Footer extends Component {
  render() {
    return (
      <footer id="footer">

      </footer>
    )
  }
}

const mapStateToProps = store => {
  return {

  }
}

export default connect(mapStateToProps)(Footer)