import React from 'react'
import ReactDOM from 'react-dom'
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import { applyMiddleware, createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { reducer as formReducer } from 'redux-form'
import HeaderReducer from './reducers/header'
import WorkReducer from './reducers/work'
import logger from 'redux-logger'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'

const history = createHistory()
const middleware = routerMiddleware(history)
const store = createStore(
  combineReducers({
    router: routerReducer,
    form: formReducer,
    header: HeaderReducer,
    work: WorkReducer,
  }), applyMiddleware(middleware, logger)
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