import { Mesh, MeshBasicMaterial, PlaneGeometry, ImageUtils } from 'three'

export default (gameState, scene) => {
  for (const image of gameState.images) {
    var mat = new MeshBasicMaterial({
      map: ImageUtils.loadTexture(image.src),
      tranparency: true,
      opacity: 1,
      alphaTest: 0.3
    })

    var geometry = new PlaneGeometry(image.width / 100, image.height / 100, 32)
    var groundMesh = new Mesh(geometry, mat)
    groundMesh.rotateY(1.5)

    groundMesh.name = image.src

    if (typeof image.position.startX !== 'undefined') {
      geometry.translate(
        image.position.startX,
        image.position.startY,
        image.position.startZ
      )
    }

    scene.add(groundMesh)
  }
}
