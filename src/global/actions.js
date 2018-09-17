import { push } from 'connected-react-router'

export function toggleMenu() {
  return { type: '@@header/TOGGLE_MENU' }
}

export function beginTransition(page) {
  return { type: '@@header/BEGIN_TRANSITION', payload: page }
}

export function finishTransition() {
  return { type: '@@header/FINISH_TRANSITION' }
}

export function resetTransition() {
  return { type: '@@header/RESET_TRANSITION' }
}

export function navigate(page, shade) {
  return (dispatch) => {
    dispatch(toggleMenu())
    
    const start = () => {
      const transitionEnd = () => {
        shade.removeEventListener('transitionend', transitionEnd)
        dispatch(push(page.link))
        finish()
      }
  
      shade.addEventListener('transitionend', transitionEnd)
      dispatch(beginTransition(page))
    }

    const finish = () => {
      const transitionEnd = () => {
        shade.removeEventListener('transitionend', transitionEnd)
        dispatch(resetTransition())
      }
  
      shade.addEventListener('transitionend', transitionEnd)
      dispatch(finishTransition())
    }

    start()
  }
}

export default {
  toggleMenu,
  beginTransition,
  finishTransition,
  resetTransition,
  navigate
}