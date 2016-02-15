import { createStore, applyMiddleware } from 'redux'
import { sequentially, stream, constant } from 'kefir'

import { observableMiddleware } from '../../src/index'


describe("Middleware", () => {

  let reducer
  let store

  function logAction(payload) {
    return {type: "log", payload}
  }

  beforeEach(() => {
    reducer = (state = [], action) => {
      switch(action.type) {
        case "log":
          return state.concat([action])

        default:
          return state
      }
    }
    store = createStore(reducer, applyMiddleware(observableMiddleware))
  })

  it("should dispatch observable", function(done) {
    this.slow(150)

    expect(store.getState()).toEqual([])

    store.dispatch(sequentially(10, ["a", "b", "c"]).map(logAction))
    store.dispatch(constant({type: "log", value: "not FSA"}))

    setTimeout(() => {
      expect(store.getState()).toEqual([
        {type: "log", value: "not FSA"},
        {type: "log", payload: "a"},
        {type: "log", payload: "b"},
        {type: "log", payload: "c"}
      ])
      done()
    }, 40)
  })

  it("should dispatch action with observable payload", function(done) {
    this.slow(150)

    expect(store.getState()).toEqual([])

    store.dispatch(logAction(
      stream(emitter => {
        let x = 1

        let interval = setInterval(() => {
          if (x === 3) emitter.error(x)
          else emitter.emit(x)

          if (x > 3) emitter.end()
          x++
        }, 10)

        return () => clearInterval(interval)
      })
      .map(x => x * 15)
      .mapErrors(x => x * 11)
    ))

    setTimeout(() => {
      expect(store.getState()).toEqual([
        {type: "log", payload: 15},
        {type: "log", payload: 30},
        {type: "log", payload: 33, error: true},
        {type: "log", payload: 60}
      ])
      done()
    }, 50)
  })

})
