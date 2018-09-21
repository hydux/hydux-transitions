import _app, { ActionsType, Cmd } from 'hydux'
import withPicodom, { h, React } from 'hydux/lib/enhancers/picodom-render'
import Transitions, { Units } from '../../src/index'
import * as Slide from './slide'
let U = Units
let app = withPicodom<State, Actions>()(_app)

function defaultLogger (prevState, action, nextState) {
  console.log(new Date().toLocaleTimeString())
  ;(console.group as any)('%c action', 'color: gray; font-weight: lighter;', action.name)
  console.log('%c prev state', 'color: #9E9E9E; font-weight: bold;', prevState)
  console.log('%c data', 'color: #03A9F4; font-weight: bold;', action.data)
  console.log('%c next state', 'color: #4CAF50; font-weight: bold;', nextState)
  console.groupEnd()
}
if (process.env.NODE_ENV === 'development') {
  const devTools = require('hydux/lib/enhancers/devtools').default
  const logger = require('hydux/lib/enhancers/logger').default
  const hmr = require('hydux/lib/enhancers/hmr').default
  app = logger({
    logger: defaultLogger
  })(app)
  app = devTools()(app)
  app = hmr()(app)
}

const actions = {
  run: Transitions.actions,
  timeline: Transitions.actions,
  slide: Slide.actions
}

const state = {
  run: Transitions.init([], {
    initFrame: {
      translateX: U.px(50),
    }
  }),
  timeline: Transitions.init([{
    translateX: U.px(200),
    scale: 2,
    duration: U.ms(1000),
  }, {
    translateX: U.px(100),
    scale: 1,
    duration: U.ms(2000),
  }, {
    translateX: U.px(200),
    scale: 2,
    duration: U.ms(3000),
  }], {
    initFrame: {
      translateX: U.px(100),
    }
  }),
  slide: Slide.init(),
}

type Actions = typeof actions
type State = typeof state
const pStyle = { margin: '20px' }
const view = (state: State, actions: Actions) =>
    <main>
    <button onClick={_ => actions.run.run([{
      translateX: U.px(100),
      scale: 1,
      duration: U.ms(500),
    }, {
      translateX: U.px(200),
      scale: 2,
      duration: U.ms(500),
    }])}>Run</button>
    <p style={pStyle}>
      <div
        style={{
          width: '20px',
          height: '20px',
          background: 'red',
          ...state.run.style,
        }}
        className={state.run.className}
      />
    </p>
    <hr />
      <button onClick={actions.timeline.start}>Start</button>
      <button onClick={actions.timeline.reset}>Reset</button>
      <button onClick={actions.timeline.end}>End</button>
      <p style={pStyle}>
        <div
          style={{
            width: '20px',
            height: '20px',
            background: 'red',
            ...state.timeline.style,
          }}
          className={state.timeline.className}
        />
      </p>
      <hr />
      {Slide.view(state.slide, actions.slide)}
    </main>

export default app({
  init: () => state,
  actions,
  view,
})
