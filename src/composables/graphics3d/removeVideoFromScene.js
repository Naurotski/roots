export const removeVideoFromScene = (scene, videoId) =>
  new Promise((resolve) => {
    console.log('removeVideoFromScene ---------')
    try {
      const videoMesh = scene.getObjectByName(`video-mesh-${videoId}`)
      if (videoMesh) {
        const texture = videoMesh.material?.map
        if (texture?.dispose) texture.dispose()

        const video = videoMesh.userData.video
        if (video && video.pause) {
          video.pause()
          video.src = ''
        }

        const tex = videoMesh.userData.videoTexture || videoMesh.material?.map
        tex.dispose()

        scene.remove(videoMesh)
        videoMesh.geometry?.dispose?.()
        videoMesh.material?.dispose?.()
      } else {
        console.warn(`Video object with ID ${videoId} not found in scene`)
      }
    } finally {
      resolve()
    }
  })
