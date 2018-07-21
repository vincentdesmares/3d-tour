import { createStore, combineReducers, applyMiddleware, compose } from "redux"
import { routerReducer, routerMiddleware } from "react-router-redux"
import { reducer as form } from "redux-form"

import history from "./routing/history"
import sceneReducer from "./lib/components/scene/actions"
import renderMiddleware from "./lib/components/scene/renderMiddleware"

const middleware = routerMiddleware(history)

export default createStore(
  combineReducers({
    scene: sceneReducer,
    router: routerReducer,
    form
  }),
  {},
  compose(
    applyMiddleware(middleware, renderMiddleware),
    typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== "undefined"
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f
  )
)
