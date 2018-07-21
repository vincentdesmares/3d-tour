import React from "react"
import { Link } from "react-router-dom"
import { Route } from "react-router"

import ScrollTestPage from "./tests/scroll"

export default () => (
  <div className="flex fg1">
    <div className="fg0 pa3 h-100 br">
      <Link to="/test/scroll">Scroll</Link>
    </div>
    <div className="fg1">
      <Route exact path="/test/scroll" component={ScrollTestPage} />
    </div>
  </div>
)
