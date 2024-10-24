export function shuffleArray(objects: Array<any>, currentIndex: number): Array<any> {
  // do nothing if there are no objects in the queue
  if (objects.length < 1) return objects

  // removes the current playing object, to put it in later as the first
  const current = objects.slice(currentIndex, currentIndex + 1)
  objects.splice(currentIndex, 1)

  // shuffle algorithm using Math.random
  for (let i = objects.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [objects[i], objects[j]] = [objects[j], objects[i]]
  }

  // gets the first object that is confirmed to exist due to a check above
  const firstElement = current[0] // current[0] is implicitly one item as specified above when getting it.
  objects.splice(0, 0, firstElement)

  // set the state to work with the shuffled queue
  return objects
}