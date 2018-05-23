export function stringToCoords(string) {
  return arrayToCoords(string.split(','))
}

export function arrayToCoords(array) {
  if (array.length === 2) {
    return {
      lat: parseFloat(array[0]),
      lng: parseFloat(array[1])
    }
  } else {
    throw 'Could not transform array to coords, because wrong length...'
  }
}

export function coordsToArray(coords) {
  return [coords.lat, coords.lng]
}

export function coordsToString(coords) {
  return `${coords.lat},${coords.lng}`
}

export function parseToCoords(value) {
  if (typeof value === "string") {
    return stringToCoords(value)
  } else if (typeof value === "object") {
    if (Array.isArray(value)) {
      return arrayToCoords(value)
    } else {
      const cloned = {
        ...value
      }
      cloned.lat = parseFloat(cloned.lat)
      cloned.lng = parseFloat(cloned.lng)
      return cloned;
    }
  }
}

export function getCoordsAs(coords, type) {
  if (type === String) {
    return coordsToString(coords)
  } else if (type === Array) {
    return coordsToArray(coords)
  } else if (type === Object) {
    return coords
  } else {
    throw `${this.storage.center} of type ${type} is not supported as coordinate storage`
  }
}
