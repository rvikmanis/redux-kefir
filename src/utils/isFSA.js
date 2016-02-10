const validKeys = [
  'type',
  'payload',
  'error',
  'meta'
]

function isValidKey(key) {
  return validKeys.indexOf(key) > -1
}

export default function isFSA(action) {
  return (
    action != null &&
    action.constructor === Object &&
    typeof action.type !== 'undefined' &&
    Object.keys(action).every(isValidKey)
  )
}
