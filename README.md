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

Creates a Kefir observable of the store's state over time.

#### Usage

```js
import { createStore } from 'redux'
import { createProjection } from 'redux-kefir'

let store = createStore(reducer)
let stateProjection = createProjection(store)
```

Use Kefir's [extensive API](https://rpominov.github.io/kefir/) to manipulate `stateProjection`.

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

Note that both examples do the same thing:

> at **_t_ + 0.05s** dispatch `{type: "count", payload: 1}`,  
> at **_t_ + 0.10s** dispatch `{type: "count", payload: 2}`,  
> at **_t_ + 0.15s** dispatch `{type: "count", payload: 3}`,  
> then end.
