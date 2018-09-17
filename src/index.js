import React from 'react'
import ReactDOM from 'react-dom'
import { applyMiddleware, compose, createStore } from 'redux'
import { Provider } from 'react-redux'
import { ConnectedRouter, connectRouter, routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk'
import { createBrowserHistory } from 'history'
import logger from 'redux-logger'
import HeaderReducer from './global/reducer'
import WorkReducer from './pages/work/reducer'
import { combineReducers } from 'redux'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import './index.scss'

const reducer = combineReducers({
  header: HeaderReducer,
  work: WorkReducer
})

const history = createBrowserHistory()

const store = createStore(
  connectRouter(history)(reducer),
  compose(
    applyMiddleware(
      routerMiddleware(history),
      thunk,
      logger
    )
  )
)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}> 
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker()