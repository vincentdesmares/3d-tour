import { Vector3 } from 'three'
import _debug from 'debug'
const debug = _debug('clickEvent')

export default (renderer, sceneState, gameState, dispatch) => {
  function onclick (event) {
    sceneState.camera.updateMatrixWorld()
    sceneState.raycaster.setFromCamera(sceneState.mouse, sceneState.camera)
    var intersects = sceneState.raycaster.intersectObjects(
      sceneState.intersectables
    )
    if (intersects.length > 0) {
      for (const intersect of intersects) {
        if (intersect.object.name) {
          debug('Clicked on with a name', intersect.object.name, intersect)
          if (intersect.object.name.search('action@') !== -1) {
            const actionName = intersect.object.name.slice(7)
            const action = gameState.actions[actionName]
            dispatch(action)
            sceneState.camera.lookAt(new Vector3(0, 20, -20))
          }
        } else {
          debug('Clicked on something without a name', intersect)
        }
      }
    } else {
      debug('You cannot click here')
    }
  }
  renderer.domElement.addEventListener('click', onclick, true)
}
