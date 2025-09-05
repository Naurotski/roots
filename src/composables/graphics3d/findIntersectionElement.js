const findTaggedParent = (object) => {
  let current = object
  while (current) {
    if (
      current.userData.isPainting ||
      current.userData.isSticker ||
      current.userData.isPlaceableObject
    ) {
      return current
    }
    current = current.parent
  }
  return null
}

const findIntersectionElement = (intersects) => {
  let intersectedElement = null
  let parentIntersectedElementObject = null
  for (const elem of intersects) {
    const parent = findTaggedParent(elem.object)
    if (parent) {
      intersectedElement = elem
      parentIntersectedElementObject = parent
      break
    }
  }
  return { intersectedElement, parentIntersectedElementObject }
}
export { findTaggedParent, findIntersectionElement }
