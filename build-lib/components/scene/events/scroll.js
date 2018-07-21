'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug3.default)('scroll');

exports.default = function (renderer, sceneState, gameState, dispatch) {
  var onMouseWheel = function onMouseWheel(event) {
    event.preventDefault();
    debug('Scroll', event);
    dispatch({
      type: 'SCROLL_SCREEN',
      payload: {
        deltaY: event.deltaY
      }
    });
  };

  var oldPosY = null;

  var onTouchMove = function onTouchMove(event) {
    event.preventDefault();
    var posY = event.targetTouches[0].clientY;

    if (oldPosY !== null) {
      var deltaY = oldPosY - posY;
      onMouseWheel({ deltaY: deltaY * 2 });
    }
    oldPosY = posY;
  };

  renderer.domElement.addEventListener('wheel', onMouseWheel, false);
  renderer.domElement.addEventListener('scroll', function () {
    debug('end of touch move');
    oldPosY = null;
  }, false);
  renderer.domElement.addEventListener('touchend', function () {
    debug('end of touch move');
    oldPosY = null;
  }, false);
  renderer.domElement.addEventListener('touchcancel', function () {
    debug('end of touch move');
    oldPosY = null;
  }, false);
  renderer.domElement.addEventListener('touchmove', onTouchMove, false);
};