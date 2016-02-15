import { isFSA, isObservable } from './utils'

export default function observableMiddleware({dispatch}) {
  return next => action => {
    if (!isFSA(action)) {
      return isObservable(action)
        ? action.onValue(dispatch)
        : next(action)
    }

    if (isObservable(action.payload)) {
      return action.payload.onValue(value => {
        dispatch(Object.assign({}, action, {payload: value}))
      }).onError(error => {
        dispatch(Object.assign({}, action, {payload: error, error: true}))
      })
    }

    return next(action)
  }
}
