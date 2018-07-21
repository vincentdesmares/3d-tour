import React, { Component } from 'react'
import ContainerDimensions from 'react-container-dimensions'
import { connect } from 'react-redux'

class Scene extends Component {
  componentDidMount () {
    this.props.sceneInit(this.props)
  }
  componentDidUpdate (prevProps, prevState) {
    if (
      this.props.gameState !== prevProps.gameState ||
      this.props.width !== prevProps.width
    ) {
      this.props.sceneInit(this.props)
    }
  }
  render () {
    return <div ref="scene" className="tc relative" id="scene" />
  }
}

export default connect(
  null,
  dispatch => ({
    sceneInit: payload => dispatch({ type: 'SCENE_INIT', payload })
  })
)(props => (
  <ContainerDimensions>
    <Scene {...props} />
  </ContainerDimensions>
))
