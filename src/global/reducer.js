const initialState = {
  open: false,
  target: 'none',
  transitionState: 'none'
}

export default function header(state = initialState, action) {
  switch (action.type) {
    case '@@header/TOGGLE_MENU':
      return {
        ...state,
        open: !state.open
      }

    case '@@header/BEGIN_TRANSITION': 
      return {
        ...state,
        target: action.payload.title,
        transitionState: 'start'
      }

    case '@@header/FINISH_TRANSITION': 
      return {
        ...state,
        transitionState: 'end'
      }

    case '@@header/RESET_TRANSITION':
      return {
        ...state,
        target: 'none',
        transitionState: 'none'
      }

    default:
      return state
  }
}