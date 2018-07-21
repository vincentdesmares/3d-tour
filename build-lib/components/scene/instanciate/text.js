'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _three = require('three');

exports.default = function (scene, gameState, font, sceneState) {
  var text;
  var color = 0x000000;
  sceneState.matTransparent = new _three.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0,
    side: _three.DoubleSide
  });

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = gameState.sentences[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var sentence = _step.value;

      var textShape = new _three.BufferGeometry();
      var message = sceneState.width < sceneState.height && sentence.mobileMessage ? sentence.mobileMessage : sentence.message;

      var shapes = font.generateShapes(message, sentence.width, sentence.height);
      var geometry = new _three.ShapeGeometry(shapes);
      geometry.computeBoundingBox();

      if (sentence.rotate) {
        if (typeof sentence.rotate.x !== 'undefined') {
          geometry.rotateX(sentence.rotate.x);
        }
        if (typeof sentence.rotate.y !== 'undefined') {
          geometry.rotateY(sentence.rotate.y);
        }
        if (typeof sentence.rotate.z !== 'undefined') {
          geometry.rotateZ(sentence.rotate.z);
        }
      }
      if (sceneState.width < sceneState.height && sentence.mobilePosition) {
        geometry.translate(sentence.mobilePosition.x, sentence.mobilePosition.y, sentence.mobilePosition.z);
      } else {
        geometry.translate(sentence.position.x, sentence.position.y, sentence.position.z);
      }

      // make shape ( N.B. edge view not visible )
      textShape.fromGeometry(geometry);
      if (sentence.displayAfterScrollStart) {
        text = new _three.Mesh(textShape, sceneState.matTransparent);
      } else {
        var matLite = new _three.MeshBasicMaterial({
          color: sentence.color || color,
          side: _three.DoubleSide
        });
        text = new _three.Mesh(textShape, matLite);
      }

      text.position.z = 1;

      if (typeof sentence.action !== 'undefined') {
        text.name = 'action@' + sentence.action;
        sceneState.intersectables.push(text);
      } else {
        text.name = sentence.message;
      }

      scene.add(text);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
};