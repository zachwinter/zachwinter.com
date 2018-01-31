import React from 'react'
import { Route } from 'react-router-dom'

import Header from './Header'
import Footer from './Footer'
import Home from './Home'
import Work from './Work'
import About from './About'
import Contact from './Contact'

const App = () => (
  <div>
    <Header />
    <main>
      <Route exact path="/" component={Home} />
      <Route path="/work" component={Work} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
    </main>
    <Footer />
  </div>
)

export default App