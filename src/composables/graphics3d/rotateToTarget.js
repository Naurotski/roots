const rotateToTarget = (controlsObject, targetPos, delta) => {
  const dir = targetPos.clone().sub(controlsObject.position)
  const targetAngle = Math.atan2(dir.x, dir.z) - Math.PI
  const currentAngle = controlsObject.rotation.y

  let angleDiff = targetAngle - currentAngle
  angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff))

  const turnSpeed = Math.PI * delta
  const turnStep = Math.abs(angleDiff) < turnSpeed ? angleDiff : Math.sign(angleDiff) * turnSpeed

  controlsObject.rotation.y += turnStep
}
const rotateHeadToTarget = (controlsObject, head, targetPos, delta) => {
  const dir = targetPos.clone().sub(controlsObject.position)
  const flatDir = dir.clone()
  flatDir.y = 0

  const horizontalDistance = flatDir.length()
  const verticalDifference = dir.y

  const targetPitch = Math.atan2(-verticalDifference, horizontalDistance) // Наклон головы вверх/вниз
  const currentPitch = head.rotation.x

  let pitchDiff = targetPitch - currentPitch
  pitchDiff = Math.atan2(Math.sin(pitchDiff), Math.cos(pitchDiff))

  const turnSpeed = Math.PI * delta
  const pitchStep = Math.abs(pitchDiff) < turnSpeed ? pitchDiff : Math.sign(pitchDiff) * turnSpeed

  head.rotation.x += pitchStep
}
export { rotateToTarget, rotateHeadToTarget }
