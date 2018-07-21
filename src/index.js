import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { ConnectedRouter } from "react-router-redux"

import App from "./components/app"
import registerServiceWorker from "./registerServiceWorker"
import store from "./store"
import history from "./routing/history"

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
)
registerServiceWorker()
