import { isFSA, isObservable } from './utils'

export default function observableMiddleware() {
  return next => action => {
    if (!isFSA(action)) {
      return isObservable(action)
        ? action.onValue(next)
        : next(action)
    }

    if (isObservable(action.payload)) {
      return action.payload.onValue(value => {
        next(Object.assign({}, action, {payload: value}))
      }).onError(error => {
        next(Object.assign({}, action, {payload: error, error: true}))
      })
    }

    return next(action)
  }
}
