import { DefaultLoadingManager } from 'three'

/**
 * For loading binary data into a 3D terrain model
 * @author Bjorn Sandvik / http://thematicmapping.org/
 */

const TerrainLoader = (url, onLoad, onProgress, onError) => {
  var request = new XMLHttpRequest()

  if (onLoad !== undefined) {
    request.addEventListener(
      'load',
      function (event) {
        onLoad(new Uint16Array(event.target.response))
        DefaultLoadingManager.itemEnd(url)
      },
      false
    )
  }
  if (onProgress !== undefined) {
    request.addEventListener(
      'progress',
      function (event) {
        onProgress(event)
      },
      false
    )
  }
  if (onError !== undefined) {
    request.addEventListener(
      'error',
      function (event) {
        onError(event)
      },
      false
    )
  }
  if (this.crossOrigin !== undefined) request.crossOrigin = this.crossOrigin
  request.open('GET', url, true)
  request.responseType = 'arraybuffer'
  request.send(null)
  DefaultLoadingManager.itemStart(url)
}

export default TerrainLoader
