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
    case '@@work/INIT':
      return {
        ...state,
        container: action.payload.container,
        screens: action.payload.screens
      }

    case '@@work/START_SCROLL':
      return {
        ...state,
        scrolling: true,
        index: action.payload
      }

    case '@@work/END_SCROLL':
      return {
        ...state,
        scrolling: false
      }

    case '@@work/TOUCH_START':
      return {
        ...state,
        touchStart: action.payload
      }

    default:
      return state
  }
}