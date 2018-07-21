"use strict";

module.exports = "precision mediump float;\nprecision mediump int;\n\nuniform float zPos;\nvarying vec3 vPosition;\n\nvarying vec3 vColor;\n\nvoid main() {\n\n  vColor = vec3(color);\n\n  vPosition = vec3(position);\n  vPosition.z = vPosition.z * zPos;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.0 );\n}";