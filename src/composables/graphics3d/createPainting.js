import {
  BoxGeometry,
  Color,
  LinearFilter,
  LinearMipMapLinearFilter,
  Mesh,
  MeshStandardMaterial,
  TextureLoader,
  SRGBColorSpace
} from 'three'
import { useSpotLight } from 'src/composables/graphics3d/useSpotLight'

export const createPainting = ({
  renderer,
  point,
  normal,
  scene,
  collidableMeshes,
  url,
  width,
  height,
  paintingId
}) => {
  //  Вешаем картину (прямоугольник) в эту точку
  const texturePlane = new TextureLoader().setCrossOrigin('anonymous').load(url, (texture) => {
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy() // Лучше детализация под углом
    texture.colorSpace = SRGBColorSpace
    texture.minFilter = LinearMipMapLinearFilter // или LinearFilter, если изображение чёткое
    texture.magFilter = LinearFilter
  })
  const sideMaterial = new MeshStandardMaterial({ color: new Color(0xffffff) })

  const painting = new Mesh(new BoxGeometry(+width, +height, 0.02), [
    sideMaterial,
    sideMaterial,
    sideMaterial,
    sideMaterial,
    new MeshStandardMaterial({ map: texturePlane }),
    sideMaterial
  ])
  // Немного отодвигаем от стены по нормали
  painting.position.copy(point).add(normal.clone().multiplyScalar(0.01))
  // Ориентируем картину по нормали (поверхности)
  painting.lookAt(point.clone().add(normal))
  painting.userData.isPainting = true // Флаг, чтобы понимать, что это картина
  painting.userData.id = paintingId // Флаг, чтобы понимать, что это картина
  painting.userData.normal = normal.clone()
  scene.add(painting)
  useSpotLight(scene, painting)
  collidableMeshes.push(painting)

  return painting
}
