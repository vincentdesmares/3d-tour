// @flow
import cameraMovement from "./actions/cameraMovement"
const screensOrder = ["projects", "createProjects", "contribute", "examples"]

let initialState = {
  screen: null,
  camera: {
    position: {
      x: 80, // Red
      y: 20, // Green
      z: 0 // Blue
    },
    lookAt: { x: -200, y: 20, z: 0 }
  },
  nextScreen: null,
  nextScreenPercentTraveled: 0,
  nextScreenBump: 0,
  screenSwap: "automated",
  images: [],
  screens: {},
  sentences: []
}

export default (state: Object = initialState, action: Object = {}): Object => {
  let newState = { ...state }
  switch (action.type) {
    case "SCENE_INIT":
      return action.payload.initialState
        ? { ...initialState, ...action.payload.initialState }
        : initialState
    case "SWITCH_SCREEN":
      newState.nextScreen = action.payload.screen
      newState.nextScreenPercentTraveled = 0
      newState.screenSwap = "automated"
      newState.camera = {
        position: {
          x:
            state.screens[state.screen].paths[action.payload.screen].position
              .startX,
          y:
            state.screens[state.screen].paths[action.payload.screen].position
              .startY,
          z:
            state.screens[state.screen].paths[action.payload.screen].position
              .startZ
        },
        lookAt: {
          x:
            state.screens[state.screen].paths[action.payload.screen].lookAt
              .startX,
          y:
            state.screens[state.screen].paths[action.payload.screen].lookAt
              .startY,
          z:
            state.screens[state.screen].paths[action.payload.screen].lookAt
              .startZ
        }
      }
      return newState
    case "SCROLL_SCREEN":
      const percent = action.payload.deltaY / 1800
      const currentScreenIndex = screensOrder.findIndex(
        e => e === newState.screen
      )

      // We do not allow to scroll back once already at the start.
      if (
        currentScreenIndex === 0 &&
        percent > 0 &&
        newState.nextScreenPercentTraveled <= 0
      ) {
        return newState
      }
      // We do not allow to scroll forward at the last screen.
      if (
        currentScreenIndex === 3 &&
        percent < 0 &&
        newState.nextScreenPercentTraveled >= 0
      ) {
        return newState
      }

      if (
        newState.screenSwap === "manual" &&
        newState.nextScreenBump < 1 &&
        percent * -1 > 0 &&
        newState.nextScreenPercentTraveled + percent * -1 > 1
      ) {
        // newState.nextScreenBump = newState.nextScreenBump + percent * -1 * 3
        // return newState
      }

      newState.nextScreenPercentTraveled =
        newState.nextScreenPercentTraveled !== null
          ? newState.nextScreenPercentTraveled + percent * -1
          : percent * -1

      newState.screenSwap = "manual"
      if (
        newState.nextScreenPercentTraveled > 1 ||
        newState.nextScreenPercentTraveled < 0
      ) {
        if (newState.nextScreenPercentTraveled > 1) {
          newState.screen = "" + newState.nextScreen
          if (currentScreenIndex < 2) {
            const newScreenIndex = screensOrder.findIndex(
              e => e === newState.screen
            )
            newState.nextScreen = screensOrder[newScreenIndex + 1]
            newState.nextScreenPercentTraveled = 0
            newState.nextScreenBump = 0
          } else {
            newState.nextScreenPercentTraveled = 0
            newState.nextScreen = null
          }
        } else if (newState.nextScreenPercentTraveled < 0) {
          if (currentScreenIndex > 0) {
            newState.nextScreen = "" + newState.screen
            const newScreenIndex = screensOrder.findIndex(
              e => e === newState.screen
            )
            newState.screen = screensOrder[newScreenIndex - 1]
            newState.nextScreenPercentTraveled = 1
          } else {
            newState.nextScreenPercentTraveled = 0
            newState.nextScreen = null
          }
        }
      } else if (
        newState.nextScreen === null &&
        newState.screen === screensOrder[0]
      ) {
        newState.nextScreen = screensOrder[1]
      }

      return newState
    case "RENDER_LOOP":
      cameraMovement(newState, action)
      newState.gameLoop++
      return newState
    default:
      return state
  }
}
