/**
 * Based on Aframe component : aframe-terrain-model-component
 */

import {
  BufferAttribute,
  Mesh,
  PlaneBufferGeometry,
  ShaderMaterial,
  VertexColors
} from 'three'
import terrainLoader from './../loaders/terrain'
const d3 = require('d3')

const vertexShader = require('./../shaders/vertex.js')
const fragmentShader = require('./../shaders/fragment.js')

const loadTerrain = src => {
  return new Promise((resolve, reject) => {
    terrainLoader(src, heightData => {
      resolve(heightData)
    })
  })
}

const getColorScale = colorScheme => {
  switch (colorScheme) {
    case 'viridis':
      return d3.scaleSequential(d3.interpolateViridis).domain([0, 65535])
    case 'inferno':
      return d3.scaleSequential(d3.interpolateInferno).domain([0, 65535])
    case 'magma':
      return d3.scaleSequential(d3.interpolateMagma).domain([0, 65535])
    case 'plasma':
      return d3.scaleSequential(d3.interpolatePlasma).domain([0, 65535])
    case 'warm':
      return d3.scaleSequential(d3.interpolateWarm).domain([0, 65535])
    case 'cool':
      return d3.scaleSequential(d3.interpolateCool).domain([0, 65535])
    case 'rainbow':
      return d3.scaleSequential(d3.interpolateRainbow).domain([0, 65535])
    case 'cubehelix':
      return d3
        .scaleSequential(d3.interpolateCubehelixDefault)
        .domain([0, 65535])
    default:
      console.log(
        'terrain-model error: ' +
          colorScheme +
          'is not a color scheme. Default color loaded instead.'
      )
      return d3.scaleSequential(d3.interpolateViridis).domain([0, 65535])
  }
}

/**
 * Loads the terrain data, then constructs the terrain mesh.
 */
export default async data => {
  var heightData = await loadTerrain(data.DEM)

  // Setup geometry and attribute buffers (position and color)
  var geometry = new PlaneBufferGeometry(
    data.planeWidth,
    data.planeHeight,
    data.segmentsWidth,
    data.segmentsHeight
  )
  var pAB = geometry.getAttribute('position')

  // Formula for size of new buffer attribute array is: numVertices * itemSize
  var colorArray = new Uint8Array(pAB.count * 3)
  var cAB = new BufferAttribute(colorArray, 3, true)
  var colorScale = getColorScale(data.colorScheme)

  /**
   * Set the z-component of every vector in the position attribute buffer to the (adjusted) height value from the DEM.
   * pAB.count = the number of vertices in the plane
   * Also sets vertex color.
   */
  for (let i = 0; i < pAB.count; i++) {
    let heightValue = heightData[i] / 65535
    pAB.setZ(i, heightValue)

    let colorValue = d3.color(colorScale(heightData[i]))
    cAB.setXYZ(i, colorValue.r, colorValue.g, colorValue.b)
  }

  geometry.addAttribute('color', cAB)

  // Setup material (zPosition uniform, wireframe option).
  // Note: originally I used RawShaderMaterial. This worked everywhere except Safari.
  // Switching to ShaderMaterial, adding "vertexColors", and modifying the shaders seems to make it work...
  var material = new ShaderMaterial({
    uniforms: {
      zPos: { value: data.zPosition }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    wireframe: data.wireframe,
    vertexColors: VertexColors
  })

  // Create the surface mesh and register it under entity's object3DMap
  var surface = new Mesh(geometry, material)
  surface.rotation.x = (-90 * Math.PI) / 180
  surface.name = 'terrain'
  return surface
}
