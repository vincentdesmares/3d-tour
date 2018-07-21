'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _three = require('three');

var createCurve = function createCurve(scene, path, name) {
  var curve = new _three.QuadraticBezierCurve3(new _three.Vector3(path.startX, path.startY, path.startZ), new _three.Vector3(path.controlX, path.controlY, path.controlZ), new _three.Vector3(path.endX, path.endY, path.endZ));
  var points = curve.getPoints(50);
  var geometry = new _three.BufferGeometry().setFromPoints(points);
  var material = new _three.LineBasicMaterial({ color: path.color });
  var curveObject = new _three.Line(geometry, material);
  curveObject.name = name;
  scene.add(curveObject);
};

exports.default = function (scene, gameState) {
  for (var screenId in gameState.screens) {
    var screen = gameState.screens[screenId];
    for (var pathId in screen.paths) {
      var path = screen.paths[pathId].position;
      createCurve(scene, path, screenId + '-' + pathId);
      var lookAtpath = screen.paths[pathId].lookAt;
      if (lookAtpath) {
        createCurve(scene, lookAtpath, screenId + '-' + pathId + '-lookat');
      }
    }
  }
};