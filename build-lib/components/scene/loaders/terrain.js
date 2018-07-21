'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _three = require('three');

/**
 * For loading binary data into a 3D terrain model
 * @author Bjorn Sandvik / http://thematicmapping.org/
 */

var TerrainLoader = function TerrainLoader(url, onLoad, onProgress, onError) {
  var request = new XMLHttpRequest();

  if (onLoad !== undefined) {
    request.addEventListener('load', function (event) {
      onLoad(new Uint16Array(event.target.response));
      _three.DefaultLoadingManager.itemEnd(url);
    }, false);
  }
  if (onProgress !== undefined) {
    request.addEventListener('progress', function (event) {
      onProgress(event);
    }, false);
  }
  if (onError !== undefined) {
    request.addEventListener('error', function (event) {
      onError(event);
    }, false);
  }
  if (undefined.crossOrigin !== undefined) request.crossOrigin = undefined.crossOrigin;
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  request.send(null);
  _three.DefaultLoadingManager.itemStart(url);
};

exports.default = TerrainLoader;