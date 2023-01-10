const POINT_KEY = 'game-point'

export const setPoint = (key: string, point: number) => {
  const localPoint = localStorage.getItem(POINT_KEY)
  let lastPoint
  if (localPoint) {
    lastPoint = JSON.parse(localPoint)
  } else {
    lastPoint = {}
  }
  lastPoint = {
    ...lastPoint,
    [key]: point
  }
  localStorage.setItem(POINT_KEY, JSON.stringify(lastPoint))
}