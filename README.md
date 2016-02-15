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

Creates a continuous state projection from store.

#### Usage

```js
import { createStore } from 'redux'
import { createProjection } from 'redux-kefir'

let store = createStore(reducer)
let stateProjection = createProjection(store)
```

Because projections are just Kefir properties,
you can use the full power of Kefir.  
Consult the [API documentation](https://rpominov.github.io/kefir/) to learn how.

Here are some examples:

###### Apply a transformation, e.g. map
```js
stateProjection = stateProjection.map(mapper)
```

###### Listen to changes
```js
stateProjection.onValue(listener)
```

###### Stop listening to changes
```js
stateProjection.offValue(listener)
```

###### Combine with other observables
```js
import { combine } from 'kefir'

let combined = combine([stateProjection, other])
```

---

### *observableMiddleware(store: [ReduxStore](http://redux.js.org/docs/basics/Store.html)): Function*

Allows Kefir observables to be dispatched.

#### Usage

```js
import { createStore, applyMiddleware } from 'redux'
import { observableMiddleware } from 'redux-kefir'
import { sequentially } from 'kefir'

let store = createStore(
  reducer,
  applyMiddleware(observableMiddleware)
)
```

###### Dispatch observable
```js
store.dispatch(
  sequentially(50, [1,2,3]).map(i => ({
    type: "count",
    payload: i
  }))
)
```

###### Dispatch action with observable payload
```js
store.dispatch({
  type: "count",
  payload: sequentially(50, [1,2,3])
})
```

*Note: both examples have the same outcome*
