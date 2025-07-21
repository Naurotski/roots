const rotateToTarget = (controlsObject, targetPos, delta, moveTarget, moveSpeed) => {
  const dir = targetPos.clone().sub(moveTarget)
  const targetAngle = Math.atan2(dir.x, dir.z) - Math.PI
  const currentAngle = controlsObject.rotation.y
  let angleDiff = targetAngle - currentAngle
  angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff))

  // Считаем время до конца движения
  const distanceToTarget = moveTarget.clone().sub(controlsObject.position).length()
  const timeToReach = distanceToTarget / moveSpeed

  // Считаем поворот за этот же интервал времени (если время > 0)
  if (timeToReach > 0) {
    const turnStep = (angleDiff / timeToReach) * delta
    controlsObject.rotation.y += turnStep
  } else {
    // Если уже пришёл, просто ставим угол как есть
    controlsObject.rotation.y = targetAngle
  }
}
const rotateHeadToTarget = (controlsObject, head, targetPos, delta, moveTarget, moveSpeed) => {
  const dir = targetPos.clone().sub(moveTarget) // Считаем от "виртуальной позиции" перед картиной
  const flatDir = dir.clone()
  flatDir.y = 0

  const horizontalDistance = flatDir.length()
  const verticalDifference = dir.y

  const targetPitch = Math.atan2(-verticalDifference, horizontalDistance)
  const currentPitch = head.rotation.x

  let pitchDiff = targetPitch - currentPitch
  pitchDiff = Math.atan2(Math.sin(pitchDiff), Math.cos(pitchDiff))

  // Считаем время до конца движения
  const distanceToTarget = moveTarget.clone().sub(controlsObject.position).length()
  const timeToReach = distanceToTarget / moveSpeed

  if (timeToReach > 0) {
    const pitchStep = (pitchDiff / timeToReach) * delta
    head.rotation.x += pitchStep
  } else {
    head.rotation.x = targetPitch
  }
}
export { rotateToTarget, rotateHeadToTarget }
