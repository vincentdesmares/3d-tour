import React from "react"
import Scene from "./../../../lib/components/scene"

const getInitialState = values => {
  const models = []

  for (let i = 0; i < 100; i++) {
    models.push({
      id: i,

      position: {
        x: 5,
        y: 0,
        z: 10
      }
    })
  }

  return { models }
}

export default () => (
  <div className="flex h-100">
    <div className="flex flex-column h-100 w-100">
      <div className="fg1">
        <Scene initialState={getInitialState()} />
      </div>
    </div>
  </div>
)
