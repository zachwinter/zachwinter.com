import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Home from '../components/Home'
import Work from '../components/Work'
import About from '../components/About'
import Contact from '../components/Contact'

class App extends Component {
  render() {
    return (
      <div>
        <Header store={this.props.store} />
        <main>
          <Route exact path="/" component={Home} />
          <Route path="/work" component={Work} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
        </main>
        <Footer />
      </div>
    )
  }
}

export default App