import {
  BufferGeometry,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  ShapeGeometry
} from "three"

export default (scene, sceneState, font, threeState) => {
  var text
  var color = 0x000000
  threeState.matTransparent = new MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0,
    side: DoubleSide
  })

  for (const sentence of sceneState.sentences) {
    var textShape = new BufferGeometry()
    const message =
      threeState.width < threeState.height && sentence.mobileMessage
        ? sentence.mobileMessage
        : sentence.message

    var shapes = font.generateShapes(message, sentence.width, sentence.height)
    var geometry = new ShapeGeometry(shapes)
    geometry.computeBoundingBox()

    if (sentence.rotate) {
      if (typeof sentence.rotate.x !== "undefined") {
        geometry.rotateX(sentence.rotate.x)
      }
      if (typeof sentence.rotate.y !== "undefined") {
        geometry.rotateY(sentence.rotate.y)
      }
      if (typeof sentence.rotate.z !== "undefined") {
        geometry.rotateZ(sentence.rotate.z)
      }
    }
    if (threeState.width < threeState.height && sentence.mobilePosition) {
      geometry.translate(
        sentence.mobilePosition.x,
        sentence.mobilePosition.y,
        sentence.mobilePosition.z
      )
    } else {
      geometry.translate(
        sentence.position.x,
        sentence.position.y,
        sentence.position.z
      )
    }

    // make shape ( N.B. edge view not visible )
    textShape.fromGeometry(geometry)
    if (sentence.displayAfterScrollStart) {
      text = new Mesh(textShape, threeState.matTransparent)
    } else {
      var matLite = new MeshBasicMaterial({
        color: sentence.color || color,
        side: DoubleSide
      })
      text = new Mesh(textShape, matLite)
    }

    text.position.z = 1

    if (typeof sentence.action !== "undefined") {
      text.name = `action@${sentence.action}`
      threeState.intersectables.push(text)
    } else {
      text.name = sentence.message
    }

    scene.add(text)
  }
}
