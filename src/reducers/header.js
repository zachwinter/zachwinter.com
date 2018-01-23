import { TOGGLE_MENU, BEGIN_PAGE_TRANSITION, FINISH_PAGE_TRANSITION, RESET_PAGE_TRANSITION } from '../constants'

const initialState = {
  open: false,
  transitionState: 'none',
  transitionTarget: 'none'
}

export default function header(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_MENU:
      return Object.assign({}, state, {
        open: !state.open
      });

    case BEGIN_PAGE_TRANSITION: 
      return Object.assign({}, state, {
        transitionState: 'start',
        transitionTarget: action.payload
      });

    case FINISH_PAGE_TRANSITION:
      return Object.assign({}, state, {
        transitionState: 'end'
      });

    case RESET_PAGE_TRANSITION:
      return Object.assign({}, state, {
        transitionState: 'none',
        transitionTarget: 'none'
      });

    default:
      return state
  }
}