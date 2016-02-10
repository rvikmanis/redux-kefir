import { stream } from 'kefir'
import { isStore } from './utils'

export default function createProjection(store) {
  if (!isStore(store)) throw new TypeError("createProjection: store expected")

  function onActivation(emitter) {
    return store.subscribe(() =>
      emitter.emit(store.getState())
    )
  }

  return stream(onActivation).toProperty(store.getState)
}
