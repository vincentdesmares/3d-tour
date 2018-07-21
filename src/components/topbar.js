import React from "react"
import { Link } from "react-router-dom"

export default () => (
  <div className="flex shadow-1 z-5 fg0">
    <div className="fg0 pa3">
      <Link className="link" to="/">
        3D Tour test page{" "}
        <span role="img" alt="a crystal shard">
          💠
        </span>
      </Link>
    </div>
    <div className="fg1">center</div>
    <div className="fg0 relative pa3">
      Menu
      <div
        className="showOnParentHover absolute right-0 pa3 ba bg-white"
        style={{ top: 40 }}
      >
        <Link className="link" to="/test/scroll">
          Tests
        </Link>
      </div>
    </div>
  </div>
)
