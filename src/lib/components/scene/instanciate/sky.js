import { Mesh, SphereBufferGeometry, MeshBasicMaterial } from "three"

import Sky from "./../object/sky"

export default (renderer, scene, threeState) => {
  // Add Sky
  threeState.sky = new Sky()
  threeState.sky.scale.setScalar(450000)
  scene.add(threeState.sky)
  // Add Sun Helper
  threeState.sunSphere = new Mesh(
    new SphereBufferGeometry(20000, 16, 8),
    new MeshBasicMaterial({ color: 0xffffff })
  )
  threeState.sunSphere.position.y = -700000
  threeState.sunSphere.visible = false
  scene.add(threeState.sunSphere)
  /// GUI
}
