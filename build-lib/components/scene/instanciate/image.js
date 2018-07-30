"use strict"

Object.defineProperty(exports, "__esModule", {
  value: true
})

var _three = require("three")

exports.default = function(sceneState, scene) {
  var _iteratorNormalCompletion = true
  var _didIteratorError = false
  var _iteratorError = undefined

  try {
    for (
      var _iterator = sceneState.images[Symbol.iterator](), _step;
      !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
      _iteratorNormalCompletion = true
    ) {
      var image = _step.value

      var mat = new _three.MeshBasicMaterial({
        map: _three.ImageUtils.loadTexture(image.src),
        tranparency: true,
        opacity: 1,
        alphaTest: 0.3
      })

      var geometry = new _three.PlaneGeometry(
        image.width / 100,
        image.height / 100,
        32
      )
      var groundMesh = new _three.Mesh(geometry, mat)
      groundMesh.rotateY(1.5)

      groundMesh.name = image.src

      if (typeof image.position.startX !== "undefined") {
        geometry.translate(
          image.position.startX,
          image.position.startY,
          image.position.startZ
        )
      }

      scene.add(groundMesh)
    }
  } catch (err) {
    _didIteratorError = true
    _iteratorError = err
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return()
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError
      }
    }
  }
}
