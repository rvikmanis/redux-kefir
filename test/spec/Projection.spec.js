import { createStore } from 'redux'
import { Property } from 'kefir'

import { createProjection } from '../../src/index'


describe("Projection", () => {

  let reducer
  let store
  let projection

  function addItem(payload) {
    return {type: "add", payload}
  }

  function removeItem(index) {
    return {type: "remove", payload: index}
  }

  beforeEach(() => {
    reducer = (state = [], {type, payload}) => {
      switch(type) {
        case "add":
          return state.concat(payload)

        case "remove":
          state = state.slice()
          state.splice(payload, 1)

        default:
          return state
      }
    }
    store = createStore(reducer)
    projection = createProjection(store)
    store.dispatch(addItem(["foo", "bar", "baz"]))
  })

  it("should be a Kefir property", () => {
    expect(projection instanceof Property).toBe(true)
  })

  it("should throw an error if attempting to create it from something that is not a Redux store", () => {
    expect(() => createProjection({})).toThrow("createProjection: store expected")
    expect(() => createProjection(1)).toThrow("createProjection: store expected")
    expect(() => createProjection(null)).toThrow("createProjection: store expected")
    expect(() => createProjection("s")).toThrow("createProjection: store expected")
    expect(() => createProjection([])).toThrow("createProjection: store expected")
    expect(() => createProjection()).toThrow("createProjection: store expected")
  })

  it("should emit immediately upon registering a listener, then after each dispatch", function(done) {
    this.slow(200)

    let state = []
    projection.take(3)
    .onValue(value => state.push(value))
    .onEnd(() => {
      expect(state).toEqual([
        ["foo", "bar", "baz"],
        ["foo", "baz"],
        ["foo", "baz", "foobar", "fez"]
      ])
      done()
    })

    expect(state).toEqual([
      ["foo", "bar", "baz"],
    ])

    setTimeout(() => store.dispatch(removeItem(1)), 50)
    setTimeout(() => store.dispatch(addItem(["foobar", "fez"])), 75)

    setTimeout(() => expect(state).toEqual([
      ["foo", "bar", "baz"],
      ["foo", "baz"],
    ]), 50)

    setTimeout(() => expect(state).toEqual([
      ["foo", "bar", "baz"],
    ]), 25)
  })

})
