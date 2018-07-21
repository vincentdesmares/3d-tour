import {
  AmbientLight,
  AxesHelper,
  FontLoader,
  GridHelper,
  PerspectiveCamera,
  Raycaster,
  Scene,
  SpotLight,
  Vector2,
  Vector3,
  WebGLRenderer,
  Color
} from 'three'
import _debug from 'debug'
import RendererStats from '@xailabs/three-renderer-stats'

import OrbitControls from './orbitControls'
import GPUParticleSystem from './GPUParticleSystem'
import Stats from './stats'
import registerClickEvent from './events/click'
import registerScrollEvent from './events/scroll'
import instantiateCurves from './instanciate/curve'
import instanciateImages from './instanciate/image'
import instanciateTexts from './instanciate/text'

const debug = _debug('renderMiddleware')
let scene, renderer
let rendererStats, stats

var particleSystem

var INTERSECTED

var sceneState = {
  camera: null,
  world: {},
  mouse: new Vector2(),
  playerBody: {},
  ballMeshes: [],
  boxes: [],
  boxMeshes: [],
  intersectables: []
}

function init (width, height, sceneState, gameState, dispatch) {
  sceneState.width = width
  sceneState.height = height

  function onDocumentMouseMove (event) {
    event.preventDefault()
    sceneState.mouse.x = (event.clientX / width) * 2 - 1
    sceneState.mouse.y = -(event.clientY / height) * 2 + 1
  }

  debug('Init the scene')
  rendererStats = new RendererStats()
  stats = new Stats()
  sceneState.camera = new PerspectiveCamera(40, width / height, 0.01, 3000)
  sceneState.camera.aspect = width / height
  sceneState.camera.updateProjectionMatrix()
  sceneState.camera.position.x = gameState.camera.position.x
  sceneState.camera.position.y = gameState.camera.position.y
  sceneState.camera.position.z = gameState.camera.position.z
  sceneState.camera.lookAt(
    new Vector3(
      gameState.camera.lookAt.x,
      gameState.camera.lookAt.y,
      gameState.camera.lookAt.z
    )
  )

  scene = new Scene()
  // To allow debug through extensions
  window.scene = scene
  window.THREE = require('three')

  if (localStorage.debug === '*') {
    var gridHelper = new GridHelper(100, 100)
    gridHelper.position.y = -0.5
    scene.add(gridHelper)
    var axesHelper = new AxesHelper(10)
    scene.add(axesHelper)
  }

  var loaderf = new FontLoader()
  loaderf.load('/assets/fonts/helvetiker_regular.typeface.json', f =>
    instanciateTexts(scene, gameState, f, sceneState)
  )

  particleSystem = new GPUParticleSystem({
    maxParticles: 250000
  })

  scene.add(particleSystem)

  var ambientLight = new AmbientLight(0xffffff, 1)
  scene.add(ambientLight)

  renderer = new WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.gammaInput = true
  renderer.gammaOutput = true
  renderer.shadowMap.enabled = true
  renderer.setSize(width, height)

  scene.background = new Color(0xffffff)

  // Lights
  var light2 = new SpotLight()
  light2.angle = Math.PI / 16
  light2.penumbra = 0.2
  light2.castShadow = true
  light2.position.set(-1, 200, 1)
  scene.add(light2)

  sceneState.raycaster = new Raycaster()
  sceneState.raycaster.far = 400
  sceneState.raycaster.near = 1

  if (localStorage.debug === '*') {
    instantiateCurves(scene, gameState)
    const controls = new OrbitControls(sceneState.camera, renderer.domElement)
    controls.target.set(0, 20, 0)
    controls.update()
  }

  instanciateImages(gameState, scene)

  while (document.getElementById('scene').lastChild) {
    document
      .getElementById('scene')
      .removeChild(document.getElementById('scene').lastChild)
  }
  document.getElementById('scene').appendChild(renderer.domElement)
  rendererStats.domElement.style.position = 'absolute'
  rendererStats.domElement.style.left = '0px'
  rendererStats.domElement.style.bottom = '0px'
  if (localStorage.debug === '*') {
    document.getElementById('scene').appendChild(rendererStats.domElement)
    stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
    document.getElementById('scene').appendChild(stats.dom)
  }
  document.addEventListener('mousemove', onDocumentMouseMove, false)

  registerClickEvent(renderer, sceneState, gameState, dispatch)
  registerScrollEvent(renderer, sceneState, gameState, dispatch)
}

const updatesceneState = state => {
  if (state.nextScreen !== null) {
    sceneState.camera.position.x = state.camera.position.x
    sceneState.camera.position.y = state.camera.position.y
    sceneState.camera.position.z = state.camera.position.z
    sceneState.camera.lookAt(
      new Vector3(
        state.camera.lookAt.x,
        state.camera.lookAt.y,
        state.camera.lookAt.z
      )
    )
    sceneState.camera.updateMatrixWorld()
  }
}

let i = 0
const animate = (gameLoop, store) => {
  var creationTime = Date.now()
  var deltaTime = (creationTime - lastTime) / 1000.0

  stats.begin()
  i = i + 1
  if (i < 10000) {
    gameLoop(deltaTime, creationTime)
  }

  sceneState.raycaster.setFromCamera(sceneState.mouse, sceneState.camera)
  var intersects = sceneState.raycaster.intersectObjects(scene.children)
  if (intersects.length > 0) {
    if (INTERSECTED !== intersects[0].object) {
      debug(`Found something`, intersects[0].object.name)
      if (INTERSECTED) {
        // INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
      }
      INTERSECTED = intersects[0].object
      // INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex()
      // INTERSECTED.material.emissive.setHex(0xff0000)
    }
  } else {
    if (INTERSECTED) {
      debug(`Left something`)
      // INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
    }
    INTERSECTED = null
  }

  const state = store.getState().tour
  if (sceneState.matTransparent) {
    if (state.screen === 'landing') {
      sceneState.matTransparent.opacity = state.nextScreenPercentTraveled
    } else {
      sceneState.matTransparent.opacity = 1
    }
  }

  renderer.render(scene, sceneState.camera)
  rendererStats.update(renderer)
  stats.end()
  lastTime = creationTime
  requestAnimationFrame(() => animate(gameLoop, store))
}

var lastTime = Date.now()

export default store => {
  return next => action => {
    if (action.type === 'SCENE_INIT') {
      next(action)
      init(
        action.payload.width,
        action.payload.height,
        sceneState,
        store.getState().tour,
        store.dispatch
      )
      animate((deltaTime, creationTime) => {
        store.dispatch({
          type: 'RENDER_LOOP',
          deltaTime,
          creationTime
        })
      }, store)
    }
    if (action.type === 'RENDER_LOOP') {
      updatesceneState(store.getState().tour)
    }

    return next(action)
  }
}
