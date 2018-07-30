import React from "react"
import { Link } from "react-router-dom"
import { Route } from "react-router"

import ScrollTestPage from "./tests/scroll"
import EasingTestPage from "./tests/easing"

export default () => (
  <div className="flex fg1">
    <div className="fg0 pa3 h-100 br">
      <Link to="/test/scroll">Scroll</Link>
      <Link to="/test/easing">Easing</Link>
    </div>
    <div className="fg1">
      <Route exact path="/test/scroll" component={ScrollTestPage} />
      <Route exact path="/test/easing" component={EasingTestPage} />
    </div>
  </div>
)
