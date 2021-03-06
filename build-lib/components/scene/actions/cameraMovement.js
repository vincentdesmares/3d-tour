"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _three = require("three");

var getCurve = function getCurve(path) {
  return new _three.QuadraticBezierCurve3(new _three.Vector3(path.startX, path.startY, path.startZ), new _three.Vector3(path.controlX, path.controlY, path.controlZ), new _three.Vector3(path.endX, path.endY, path.endZ));
};

exports.default = function (newState, action) {
  if (!newState.nextScreen || newState.nextScreen === newState.screen) {
    return newState;
  }
  var currentPath = newState.screens[newState.screen].paths[newState.nextScreen].position;

  var positionCurve = getCurve(currentPath);

  var point = positionCurve.getPoint(newState.nextScreenPercentTraveled);

  if (newState.screenSwap === "automated") {
    newState.nextScreenPercentTraveled += 50 * action.deltaTime / positionCurve.getLength();
    if (newState.nextScreenPercentTraveled >= 1) {
      newState.nextScreenPercentTraveled = 1;
      newState.screen = newState.nextScreen;
      newState.nextScreen = null;
    }
  }

  newState.camera.position.x = point.x;
  newState.camera.position.y = point.y;
  newState.camera.position.z = point.z;

  if (newState.screens[newState.screen].paths[newState.nextScreen].lookAt) {
    var lookAtCurve = getCurve(newState.screens[newState.screen].paths[newState.nextScreen].lookAt);
    var lookAtPoint = lookAtCurve.getPoint(newState.nextScreenPercentTraveled);
    newState.camera.lookAt.x = lookAtPoint.x;
    newState.camera.lookAt.y = lookAtPoint.y;
    newState.camera.lookAt.z = lookAtPoint.z;
  }
  return newState;
};