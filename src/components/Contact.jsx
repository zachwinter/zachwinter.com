import React, { Component } from 'react'
import { connect } from 'react-redux'
import '../styles/components/contact.css'

class Contact extends Component {
  render() {
    return (
      <div className="contact">
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

export default connect(mapStateToProps)(Contact)