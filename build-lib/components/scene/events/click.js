'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _three = require('three');

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug3.default)('clickEvent');

exports.default = function (renderer, sceneState, gameState, dispatch) {
  function onclick(event) {
    sceneState.camera.updateMatrixWorld();
    sceneState.raycaster.setFromCamera(sceneState.mouse, sceneState.camera);
    var intersects = sceneState.raycaster.intersectObjects(sceneState.intersectables);
    if (intersects.length > 0) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = intersects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var intersect = _step.value;

          if (intersect.object.name) {
            debug('Clicked on with a name', intersect.object.name, intersect);
            if (intersect.object.name.search('action@') !== -1) {
              var actionName = intersect.object.name.slice(7);
              var action = gameState.actions[actionName];
              dispatch(action);
              sceneState.camera.lookAt(new _three.Vector3(0, 20, -20));
            }
          } else {
            debug('Clicked on something without a name', intersect);
          }
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
    } else {
      debug('You cannot click here');
    }
  }
  renderer.domElement.addEventListener('click', onclick, true);
};