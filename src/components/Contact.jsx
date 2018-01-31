import React, { Component } from 'react'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import axios from 'axios'
import '../styles/components/contact.css'

class Contact extends Component {
  constructor() {
    super()

    this.state = {
      index: 0,
      active: {}
    }
  }

  render() {
    return (
      <div className="contact">
        <header></header>
        <div className="form-container">
          <form autoComplete="off" className="contact-form" onSubmit={this.handleSubmit}>
            <div className={this.state.index === 0 ? 'active' : ''}> 
              <p>First off, what's your name?</p>
              <Field autoFocus name="name" type="text" component="input" onKeyDown={this.handleKeyDown} />
            </div>
            <div className={this.state.index === 1 ? 'active' : ''}> 
              <p>And your email?</p>
              <Field name="email" type="text" component="input" type="email" onKeyDown={this.handleKeyDown} />
            </div>
            <div className={this.state.index === 2 ? 'active' : ''}> 
              <p>What would you like to talk about?</p>
              <Field name="message" component="textarea" />
              <button type="submit">Send</button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  componentDidMount = () => {
    this.setState({
      active: document.querySelector('.contact-form .active')
    }, () => {
      this.showSection()
    })
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 9) { e.preventDefault(); }

    if (e.keyCode === 13 && this.state.active !== 2) {
      this.nextSection()
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()

    let values = this.props.model.values

    axios.post('/mail', values)
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  lastSection = () => {
    this.hideSection(() => {
      this.setState({
        index: this.state.index - 1
      }, () => {
        this.setState({
          active: document.querySelector('.contact-form .active')
        }, () => this.showSection())
      })
    })
  }

  nextSection = () => {
    this.hideSection(() => {
      this.setState({
        index: this.state.index + 1
      }, () => {
        this.setState({
          active: document.querySelector('.contact-form .active')
        }, () => this.showSection())
      })
    })
  }

  showSection = () => {
    const transitionEnd = () => {
      let element = this.state.index < 2 ? 'input' : 'textarea'

      document.querySelector(`.contact-form .active ${element}`).focus()
      this.state.active.removeEventListener('transitionend', transitionEnd)
    }

    this.state.active.style.display = 'block'
    setTimeout(() => {
      this.state.active.classList.add('show')
      this.state.active.addEventListener('transitionend', transitionEnd)
    }, 20)
  }

  hideSection = (callback) => {
    const transitionEnd = () => {
      this.state.active.style.display = 'none'
      this.state.active.removeEventListener('transitionend', transitionEnd)

      callback()
    }

    this.state.active.classList.add('hide')
    this.state.active.addEventListener('transitionend', transitionEnd)
  }
}

Contact = reduxForm({
  form: 'contact'
})(Contact)

const selector = formValueSelector('contact')

Contact = connect(state => {
  return {
    model: state.form.contact
  }
})(Contact)

export default Contact