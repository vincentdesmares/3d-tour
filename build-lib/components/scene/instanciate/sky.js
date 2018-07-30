"use strict"

Object.defineProperty(exports, "__esModule", {
  value: true
})

var _three = require("three")

var _sky = require("./../object/sky")

var _sky2 = _interopRequireDefault(_sky)

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

exports.default = function(renderer, scene, threeState) {
  // Add Sky
  threeState.sky = new _sky2.default()
  threeState.sky.scale.setScalar(450000)
  scene.add(threeState.sky)
  // Add Sun Helper
  threeState.sunSphere = new _three.Mesh(
    new _three.SphereBufferGeometry(20000, 16, 8),
    new _three.MeshBasicMaterial({ color: 0xffffff })
  )
  threeState.sunSphere.position.y = -700000
  threeState.sunSphere.visible = false
  scene.add(threeState.sunSphere)
  /// GUI
}
