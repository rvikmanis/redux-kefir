redux-kefir
===========

Kefir bindings for Redux

[![Test Coverage](https://codeclimate.com/github/rvikmanis/redux-kefir/badges/coverage.svg)](https://codeclimate.com/github/rvikmanis/redux-kefir/coverage)
[![Build Status](https://travis-ci.org/rvikmanis/redux-kefir.svg?branch=master)](https://travis-ci.org/rvikmanis/redux-kefir)

```
npm install --save redux-kefir
```

---

### *createProjection(store: [ReduxStore](http://redux.js.org/docs/basics/Store.html)): [KefirProperty](https://rpominov.github.io/kefir/#about-observables)*

Creates an observable of state over time from a Redux store.

```js
import { createProjection } from 'redux-kefir'
```

#### Usage

Given `store`, create a projection:

```js
let stateProjection = createProjection(store)
```

To do anything useful with the newly minted `stateProjection`, we must use the [Kefir API](https://rpominov.github.io/kefir/).

---

### *observableMiddleware: [ReduxMiddleware](http://redux.js.org/docs/advanced/Middleware.html)*

Enables dispatching Kefir observables and [Flux Standard Actions](https://github.com/acdlite/flux-standard-action) that have observable payloads.

```js
import { observableMiddleware } from 'redux-kefir'
```

#### Usage

```js
createStore = applyMiddleware(observableMiddleware)(createStore)
```

Given a `store` and an action creator `count(payload: number): FSA`, dispatch a stream of `count` actions. For clarity and DRY, we'll define a stream creator `obs`:

```js
let obs = () => Kefir.sequentially(50, [1,2,3])
```

Dispatch new observable stream, mapping its values through the action creator:
```js
store.dispatch(obs().map(count))
```

Or dispatch an FSA that has observable payload, essentially, inverting control:
```js
store.dispatch(count(obs()))
```

Both examples have the same outcome:  

at **_t_ + 0.05s** dispatched `{type: "count", payload: 1}`,  
at **_t_ + 0.10s** dispatched `{type: "count", payload: 2}`,  
at **_t_ + 0.15s** dispatched `{type: "count", payload: 3}`,  
then ended.
