import React from 'react'
import ReactDOM from 'react-dom';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux'
import HeaderReducer from './reducers/header';
import logger from 'redux-logger'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'

const history = createHistory()
const middleware = routerMiddleware(history)
const store = createStore(
  combineReducers({
    header: HeaderReducer,
    router: routerReducer
  }), applyMiddleware(middleware, logger)
)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App store={store} />
    </ConnectedRouter>
  </Provider>,

  document.getElementById('root')
)

registerServiceWorker()