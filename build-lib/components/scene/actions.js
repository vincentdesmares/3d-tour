"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _cameraMovement = require("./actions/cameraMovement");

var _cameraMovement2 = _interopRequireDefault(_cameraMovement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var screensOrder = ["projects", "createProjects", "contribute", "examples"];

var initialState = {
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
};

exports.default = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var newState = _extends({}, state);
  switch (action.type) {
    case "SCENE_INIT":
      return initialState;
    case "SWITCH_SCREEN":
      newState.nextScreen = action.payload.screen;
      newState.nextScreenPercentTraveled = 0;
      newState.screenSwap = "automated";
      newState.camera = {
        position: {
          x: state.screens[state.screen].paths[action.payload.screen].position.startX,
          y: state.screens[state.screen].paths[action.payload.screen].position.startY,
          z: state.screens[state.screen].paths[action.payload.screen].position.startZ
        },
        lookAt: {
          x: state.screens[state.screen].paths[action.payload.screen].lookAt.startX,
          y: state.screens[state.screen].paths[action.payload.screen].lookAt.startY,
          z: state.screens[state.screen].paths[action.payload.screen].lookAt.startZ
        }
      };
      return newState;
    case "SCROLL_SCREEN":
      var percent = action.payload.deltaY / 1800;
      var currentScreenIndex = screensOrder.findIndex(function (e) {
        return e === newState.screen;
      });

      // We do not allow to scroll back once already at the start.
      if (currentScreenIndex === 0 && percent > 0 && newState.nextScreenPercentTraveled <= 0) {
        return newState;
      }
      // We do not allow to scroll forward at the last screen.
      if (currentScreenIndex === 3 && percent < 0 && newState.nextScreenPercentTraveled >= 0) {
        return newState;
      }

      if (newState.screenSwap === "manual" && newState.nextScreenBump < 1 && percent * -1 > 0 && newState.nextScreenPercentTraveled + percent * -1 > 1) {
        // newState.nextScreenBump = newState.nextScreenBump + percent * -1 * 3
        // return newState
      }

      newState.nextScreenPercentTraveled = newState.nextScreenPercentTraveled !== null ? newState.nextScreenPercentTraveled + percent * -1 : percent * -1;

      newState.screenSwap = "manual";
      if (newState.nextScreenPercentTraveled > 1 || newState.nextScreenPercentTraveled < 0) {
        if (newState.nextScreenPercentTraveled > 1) {
          newState.screen = "" + newState.nextScreen;
          if (currentScreenIndex < 2) {
            var newScreenIndex = screensOrder.findIndex(function (e) {
              return e === newState.screen;
            });
            newState.nextScreen = screensOrder[newScreenIndex + 1];
            newState.nextScreenPercentTraveled = 0;
            newState.nextScreenBump = 0;
          } else {
            newState.nextScreenPercentTraveled = 0;
            newState.nextScreen = null;
          }
        } else if (newState.nextScreenPercentTraveled < 0) {
          if (currentScreenIndex > 0) {
            newState.nextScreen = "" + newState.screen;
            var _newScreenIndex = screensOrder.findIndex(function (e) {
              return e === newState.screen;
            });
            newState.screen = screensOrder[_newScreenIndex - 1];
            newState.nextScreenPercentTraveled = 1;
          } else {
            newState.nextScreenPercentTraveled = 0;
            newState.nextScreen = null;
          }
        }
      } else if (newState.nextScreen === null && newState.screen === screensOrder[0]) {
        newState.nextScreen = screensOrder[1];
      }

      return newState;
    case "RENDER_LOOP":
      (0, _cameraMovement2.default)(newState, action);
      newState.gameLoop++;
      return newState;
    default:
      return state;
  }
};