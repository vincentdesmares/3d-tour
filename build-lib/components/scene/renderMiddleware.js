"use strict"

Object.defineProperty(exports, "__esModule", {
  value: true
})

var _three = require("three")

var _debug2 = require("debug")

var _debug3 = _interopRequireDefault(_debug2)

var _threeRendererStats = require("@xailabs/three-renderer-stats")

var _threeRendererStats2 = _interopRequireDefault(_threeRendererStats)

var _orbitControls = require("./orbitControls")

var _orbitControls2 = _interopRequireDefault(_orbitControls)

var _GPUParticleSystem = require("./GPUParticleSystem")

var _GPUParticleSystem2 = _interopRequireDefault(_GPUParticleSystem)

var _stats = require("./stats")

var _stats2 = _interopRequireDefault(_stats)

var _click = require("./events/click")

var _click2 = _interopRequireDefault(_click)

var _scroll = require("./events/scroll")

var _scroll2 = _interopRequireDefault(_scroll)

var _curve = require("./instanciate/curve")

var _curve2 = _interopRequireDefault(_curve)

var _image = require("./instanciate/image")

var _image2 = _interopRequireDefault(_image)

var _text = require("./instanciate/text")

var _text2 = _interopRequireDefault(_text)

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

var debug = (0, _debug3.default)("renderMiddleware")
var scene = void 0,
  renderer = void 0
var rendererStats = void 0,
  stats = void 0

var particleSystem

var INTERSECTED

var threeState = {
  camera: null,
  world: {},
  mouse: new _three.Vector2(),
  playerBody: {},
  ballMeshes: [],
  boxes: [],
  boxMeshes: [],
  intersectables: []
}

function init(width, height, threeState, sceneState, dispatch) {
  threeState.width = width
  threeState.height = height

  function onDocumentMouseMove(event) {
    event.preventDefault()
    threeState.mouse.x = (event.clientX / width) * 2 - 1
    threeState.mouse.y = -(event.clientY / height) * 2 + 1
  }

  debug("Init the scene")
  rendererStats = new _threeRendererStats2.default()
  stats = new _stats2.default()
  threeState.camera = new _three.PerspectiveCamera(
    40,
    width / height,
    0.01,
    3000
  )
  threeState.camera.aspect = width / height
  threeState.camera.updateProjectionMatrix()
  threeState.camera.position.x = sceneState.camera.position.x
  threeState.camera.position.y = sceneState.camera.position.y
  threeState.camera.position.z = sceneState.camera.position.z
  threeState.camera.lookAt(
    new _three.Vector3(
      sceneState.camera.lookAt.x,
      sceneState.camera.lookAt.y,
      sceneState.camera.lookAt.z
    )
  )

  scene = new _three.Scene()
  // To allow debug through extensions
  window.scene = scene
  window.THREE = require("three")

  if (localStorage.debug === "*") {
    var gridHelper = new _three.GridHelper(100, 100)
    gridHelper.position.y = -0.5
    scene.add(gridHelper)
    var axesHelper = new _three.AxesHelper(10)
    scene.add(axesHelper)
  }

  var loaderf = new _three.FontLoader()
  loaderf.load("/assets/fonts/helvetiker_regular.typeface.json", function(f) {
    return (0, _text2.default)(scene, sceneState, f, threeState)
  })

  particleSystem = new _GPUParticleSystem2.default({
    maxParticles: 250000
  })

  scene.add(particleSystem)

  var ambientLight = new _three.AmbientLight(0xffffff, 1)
  scene.add(ambientLight)

  renderer = new _three.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.gammaInput = true
  renderer.gammaOutput = true
  renderer.shadowMap.enabled = true
  renderer.setSize(width, height)

  scene.background = new _three.Color(0xffffff)

  // Lights
  var light2 = new _three.SpotLight()
  light2.angle = Math.PI / 16
  light2.penumbra = 0.2
  light2.castShadow = true
  light2.position.set(-1, 200, 1)
  scene.add(light2)

  threeState.raycaster = new _three.Raycaster()
  threeState.raycaster.far = 400
  threeState.raycaster.near = 1

  if (localStorage.debug === "*") {
    ;(0, _curve2.default)(scene, sceneState)
    var controls = new _orbitControls2.default(
      threeState.camera,
      renderer.domElement
    )
    controls.target.set(0, 20, 0)
    controls.update()
  }

  ;(0, _image2.default)(sceneState, scene)

  while (document.getElementById("scene").lastChild) {
    document
      .getElementById("scene")
      .removeChild(document.getElementById("scene").lastChild)
  }
  document.getElementById("scene").appendChild(renderer.domElement)
  rendererStats.domElement.style.position = "absolute"
  rendererStats.domElement.style.left = "0px"
  rendererStats.domElement.style.bottom = "0px"
  if (localStorage.debug === "*") {
    document.getElementById("scene").appendChild(rendererStats.domElement)
    stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
    document.getElementById("scene").appendChild(stats.dom)
  }
  document.addEventListener("mousemove", onDocumentMouseMove, false)
  ;(0, _click2.default)(renderer, threeState, sceneState, dispatch)
  ;(0, _scroll2.default)(renderer, threeState, sceneState, dispatch)
}

var updatethreeState = function updatethreeState(state) {
  if (state.nextScreen !== null) {
    threeState.camera.position.x = state.camera.position.x
    threeState.camera.position.y = state.camera.position.y
    threeState.camera.position.z = state.camera.position.z
    threeState.camera.lookAt(
      new _three.Vector3(
        state.camera.lookAt.x,
        state.camera.lookAt.y,
        state.camera.lookAt.z
      )
    )
    threeState.camera.updateMatrixWorld()
  }
}

var i = 0
var animate = function animate(gameLoop, store) {
  var creationTime = Date.now()
  var deltaTime = (creationTime - lastTime) / 1000.0

  stats.begin()
  i = i + 1
  if (i < 10000) {
    gameLoop(deltaTime, creationTime)
  }

  threeState.raycaster.setFromCamera(threeState.mouse, threeState.camera)
  var intersects = threeState.raycaster.intersectObjects(scene.children)
  if (intersects.length > 0) {
    if (INTERSECTED !== intersects[0].object) {
      debug("Found something", intersects[0].object.name)
      if (INTERSECTED) {
        // INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
      }
      INTERSECTED = intersects[0].object
      // INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex()
      // INTERSECTED.material.emissive.setHex(0xff0000)
    }
  } else {
    if (INTERSECTED) {
      debug("Left something")
      // INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
    }
    INTERSECTED = null
  }

  var state = store.getState().scene
  if (threeState.matTransparent) {
    if (state.screen === "landing") {
      threeState.matTransparent.opacity = state.nextScreenPercentTraveled
    } else {
      threeState.matTransparent.opacity = 1
    }
  }

  renderer.render(scene, threeState.camera)
  rendererStats.update(renderer)
  stats.end()
  lastTime = creationTime
  requestAnimationFrame(function() {
    return animate(gameLoop, store)
  })
}

var lastTime = Date.now()

exports.default = function(store) {
  return function(next) {
    return function(action) {
      if (action.type === "SCENE_INIT") {
        next(action)
        init(
          action.payload.width,
          action.payload.height,
          threeState,
          store.getState().scene,
          store.dispatch
        )
        animate(function(deltaTime, creationTime) {
          store.dispatch({
            type: "RENDER_LOOP",
            deltaTime: deltaTime,
            creationTime: creationTime
          })
        }, store)
      }
      if (action.type === "RENDER_LOOP") {
        updatethreeState(store.getState().scene)
      }

      return next(action)
    }
  }
}
