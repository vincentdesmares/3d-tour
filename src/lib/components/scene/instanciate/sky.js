import { Mesh, SphereBufferGeometry, MeshBasicMaterial } from 'three'

import Sky from './../object/sky'

export default (renderer, scene, sceneState) => {
  // Add Sky
  sceneState.sky = new Sky()
  sceneState.sky.scale.setScalar(450000)
  scene.add(sceneState.sky)
  // Add Sun Helper
  sceneState.sunSphere = new Mesh(
    new SphereBufferGeometry(20000, 16, 8),
    new MeshBasicMaterial({ color: 0xffffff })
  )
  sceneState.sunSphere.position.y = -700000
  sceneState.sunSphere.visible = false
  scene.add(sceneState.sunSphere)
  /// GUI
}
