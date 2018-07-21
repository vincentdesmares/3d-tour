import _debug from 'debug'
const debug = _debug('scroll')

export default (renderer, sceneState, gameState, dispatch) => {
  const onMouseWheel = event => {
    event.preventDefault()
    debug('Scroll', event)
    dispatch({
      type: 'SCROLL_SCREEN',
      payload: {
        deltaY: event.deltaY
      }
    })
  }

  let oldPosY = null

  const onTouchMove = event => {
    event.preventDefault()
    const posY = event.targetTouches[0].clientY

    if (oldPosY !== null) {
      const deltaY = oldPosY - posY
      onMouseWheel({ deltaY: deltaY * 2 })
    }
    oldPosY = posY
  }

  renderer.domElement.addEventListener('wheel', onMouseWheel, false)
  renderer.domElement.addEventListener(
    'scroll',
    () => {
      debug('end of touch move')
      oldPosY = null
    },
    false
  )
  renderer.domElement.addEventListener(
    'touchend',
    () => {
      debug('end of touch move')
      oldPosY = null
    },
    false
  )
  renderer.domElement.addEventListener(
    'touchcancel',
    () => {
      debug('end of touch move')
      oldPosY = null
    },
    false
  )
  renderer.domElement.addEventListener('touchmove', onTouchMove, false)
}
