import { Observable } from 'kefir'

export default function isObservable(object) {
  return object instanceof Observable
}
