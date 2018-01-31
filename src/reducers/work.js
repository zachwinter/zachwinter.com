import { INIT_WORK, START_SCROLL, END_SCROLL, TOUCH_START, TOUCH_END } from '../constants'

const initialState = {
  container: {},
  screens: [],
  index: 0,
  touchStart: 0,
  touchEnd: 0,
  touchDelta: 0,
  scrolling: false
}

export default function work(state = initialState, action) {
  switch (action.type) {
    case INIT_WORK:
      return Object.assign({}, state, {
        container: action.payload.container,
        screens: action.payload.screens
      })

    case START_SCROLL:
      return Object.assign({}, state, {
        scrolling: true,
        index: action.payload
      })

    case END_SCROLL:
      return Object.assign({}, state, {
        scrolling: false
      })

    case TOUCH_START:
      return Object.assign({}, state, {
        touchStart: action.payload
      })

    case TOUCH_END:
      return Object.assign({}, state, {
        touchEnd: action.payload,
        touchDelta: action.payload - state.touchStart
      })

    default:
      return state
  }
}