import React, { Component } from 'react'
import { connect } from 'react-redux'
import '../styles/components/home.css'

class Home extends Component {
  render() {
    return (
      <div className="home">
        <header>

        </header>
      </div>
    )
  }
}

const mapStateToProps = store => {
  return {

  }
}

export default connect(mapStateToProps)(Home)