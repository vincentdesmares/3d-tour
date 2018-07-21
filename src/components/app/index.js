import React, { Component } from "react"
import { Route } from "react-router"
import { connect } from "react-redux"

import Topbar from "./../topbar"
import Home from "./../pages/home"
import Test from "./../pages/test"

import "tachyons/css/tachyons.min.css"
import "./app.css"

const init = () => ({
  type: "INIT"
})

class App extends Component {
  componentDidMount() {
    this.props.init()
  }
  render() {
    return (
      <div className="avenir flex flex-column h-100">
        <Topbar />
        <div className="z-1 fg1 flex">
          <Route exact path="/" component={Home} />
          <Route path="/test" component={Test} />
        </div>{" "}
      </div>
    )
  }
}

export default connect(
  state => state,
  { init }
)(App)
