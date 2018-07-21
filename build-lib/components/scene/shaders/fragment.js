"use strict";

module.exports = "precision mediump float;\nprecision mediump int;\n\nvarying vec3 vColor;\n\nvoid main() {\n  gl_FragColor = vec4(vColor, 1.0);\n}";