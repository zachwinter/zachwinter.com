export function init(payload) {
  return { type: '@@work/INIT', payload }
}

export function startScroll(index) {
  return (dispatch, getState) => {
    const state = getState()
    
    if (state.work.scrolling === false) {      
      const transitionEnd = () => {
        state.work.container.removeEventListener('transitionend', transitionEnd)
        dispatch(endScroll())
      }

      state.work.container.addEventListener('transitionend', transitionEnd)

      dispatch({ type: '@@work/START_SCROLL', payload: index })
    }
  }
}

export function endScroll() {
  return { type: '@@work/END_SCROLL' }
}

export function touchStart(touchStart) {
  return { type: '@@work/TOUCH_START', payload: touchStart }
}

export function next() {
  return (dispatch, getState) => {
    const state = getState()
    
    if (state.work.index !== state.work.screens.length - 1) {
      dispatch(startScroll(state.work.index + 1))
    }
  }
}

export function previous() {
  return (dispatch, getState) => {
    const state = getState()

    if (state.work.index !== 0) {
      dispatch(startScroll(state.work.index - 1))
    }
  }
}

export default {
  init,
  startScroll,
  endScroll,
  touchStart,
  next,
  previous
}