export const removeVideoFromScene = (scene, videoId) => {
  console.log('removeVideoFromScene ---')
  const videoMesh = scene.getObjectByName(`video-mesh-${videoId}`)
  if (videoMesh) {
    // Удалить текстуру, если она есть
    const texture = videoMesh.material?.map
    if (texture?.dispose) texture.dispose()

    // Остановить видео, если сохранено в пользовательском поле
    const video = videoMesh.userData.video
    if (video && video.pause) {
      video.pause()
      video.src = ''
    }
    // корректно удалить текстуру
    const tex = videoMesh.userData.videoTexture || videoMesh.material?.map
    if (tex?.dispose) tex.dispose()
    // Удалить из сцены и освободить ресурсы
    scene.remove(videoMesh)
    videoMesh.geometry?.dispose?.()
    videoMesh.material?.dispose?.()
  } else {
    console.warn(`Video object with ID ${videoId} not found in scene`)
  }
}
