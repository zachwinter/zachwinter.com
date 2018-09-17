import React from 'react'
import { Route, Switch } from 'react-router'
import Header from './global/Header'
import Home from './pages/Home'
import Work from './pages/work/Work'
import Skills from './pages/Skills'
import Contact from './pages/Contact'

const App = () => (
  <div className="App">
    <Header />
    <main>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/work" component={Work} />
        <Route path="/skills" component={Skills} />
        <Route path="/contact" component={Contact} />
      </Switch>
    </main>
  </div>
)

export default App