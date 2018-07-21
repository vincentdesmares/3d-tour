import {
  QuadraticBezierCurve3,
  Vector3,
  BufferGeometry,
  LineBasicMaterial,
  Line
} from 'three'

const createCurve = (scene, path, name) => {
  var curve = new QuadraticBezierCurve3(
    new Vector3(path.startX, path.startY, path.startZ),
    new Vector3(path.controlX, path.controlY, path.controlZ),
    new Vector3(path.endX, path.endY, path.endZ)
  )
  var points = curve.getPoints(50)
  var geometry = new BufferGeometry().setFromPoints(points)
  var material = new LineBasicMaterial({ color: path.color })
  var curveObject = new Line(geometry, material)
  curveObject.name = name
  scene.add(curveObject)
}

export default (scene, gameState) => {
  for (const screenId in gameState.screens) {
    const screen = gameState.screens[screenId]
    for (const pathId in screen.paths) {
      const path = screen.paths[pathId].position
      createCurve(scene, path, `${screenId}-${pathId}`)
      const lookAtpath = screen.paths[pathId].lookAt
      if (lookAtpath) {
        createCurve(scene, lookAtpath, `${screenId}-${pathId}-lookat`)
      }
    }
  }
}
