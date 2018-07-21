'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _three = require('three');

var _terrain = require('./../loaders/terrain');

var _terrain2 = _interopRequireDefault(_terrain);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * Based on Aframe component : aframe-terrain-model-component
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */

var d3 = require('d3');

var vertexShader = require('./../shaders/vertex.js');
var fragmentShader = require('./../shaders/fragment.js');

var loadTerrain = function loadTerrain(src) {
  return new Promise(function (resolve, reject) {
    (0, _terrain2.default)(src, function (heightData) {
      resolve(heightData);
    });
  });
};

var getColorScale = function getColorScale(colorScheme) {
  switch (colorScheme) {
    case 'viridis':
      return d3.scaleSequential(d3.interpolateViridis).domain([0, 65535]);
    case 'inferno':
      return d3.scaleSequential(d3.interpolateInferno).domain([0, 65535]);
    case 'magma':
      return d3.scaleSequential(d3.interpolateMagma).domain([0, 65535]);
    case 'plasma':
      return d3.scaleSequential(d3.interpolatePlasma).domain([0, 65535]);
    case 'warm':
      return d3.scaleSequential(d3.interpolateWarm).domain([0, 65535]);
    case 'cool':
      return d3.scaleSequential(d3.interpolateCool).domain([0, 65535]);
    case 'rainbow':
      return d3.scaleSequential(d3.interpolateRainbow).domain([0, 65535]);
    case 'cubehelix':
      return d3.scaleSequential(d3.interpolateCubehelixDefault).domain([0, 65535]);
    default:
      console.log('terrain-model error: ' + colorScheme + 'is not a color scheme. Default color loaded instead.');
      return d3.scaleSequential(d3.interpolateViridis).domain([0, 65535]);
  }
};

/**
 * Loads the terrain data, then constructs the terrain mesh.
 */

exports.default = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data) {
    var heightData, geometry, pAB, colorArray, cAB, colorScale, i, heightValue, colorValue, material, surface;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return loadTerrain(data.DEM);

          case 2:
            heightData = _context.sent;


            // Setup geometry and attribute buffers (position and color)
            geometry = new _three.PlaneBufferGeometry(data.planeWidth, data.planeHeight, data.segmentsWidth, data.segmentsHeight);
            pAB = geometry.getAttribute('position');

            // Formula for size of new buffer attribute array is: numVertices * itemSize

            colorArray = new Uint8Array(pAB.count * 3);
            cAB = new _three.BufferAttribute(colorArray, 3, true);
            colorScale = getColorScale(data.colorScheme);

            /**
             * Set the z-component of every vector in the position attribute buffer to the (adjusted) height value from the DEM.
             * pAB.count = the number of vertices in the plane
             * Also sets vertex color.
             */

            for (i = 0; i < pAB.count; i++) {
              heightValue = heightData[i] / 65535;

              pAB.setZ(i, heightValue);

              colorValue = d3.color(colorScale(heightData[i]));

              cAB.setXYZ(i, colorValue.r, colorValue.g, colorValue.b);
            }

            geometry.addAttribute('color', cAB);

            // Setup material (zPosition uniform, wireframe option).
            // Note: originally I used RawShaderMaterial. This worked everywhere except Safari.
            // Switching to ShaderMaterial, adding "vertexColors", and modifying the shaders seems to make it work...
            material = new _three.ShaderMaterial({
              uniforms: {
                zPos: { value: data.zPosition }
              },
              vertexShader: vertexShader,
              fragmentShader: fragmentShader,
              wireframe: data.wireframe,
              vertexColors: _three.VertexColors
            });

            // Create the surface mesh and register it under entity's object3DMap

            surface = new _three.Mesh(geometry, material);

            surface.rotation.x = -90 * Math.PI / 180;
            surface.name = 'terrain';
            return _context.abrupt('return', surface);

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();