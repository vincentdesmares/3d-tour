'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _three = require('three');

var _sky = require('./../object/sky');

var _sky2 = _interopRequireDefault(_sky);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (renderer, scene, sceneState) {
  // Add Sky
  sceneState.sky = new _sky2.default();
  sceneState.sky.scale.setScalar(450000);
  scene.add(sceneState.sky);
  // Add Sun Helper
  sceneState.sunSphere = new _three.Mesh(new _three.SphereBufferGeometry(20000, 16, 8), new _three.MeshBasicMaterial({ color: 0xffffff }));
  sceneState.sunSphere.position.y = -700000;
  sceneState.sunSphere.visible = false;
  scene.add(sceneState.sunSphere);
  /// GUI
};