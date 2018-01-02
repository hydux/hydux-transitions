import _app, { ActionsType, Cmd } from 'hydux'
import withPicodom, { h, React } from 'hydux/lib/enhancers/picodom-render'
import Transitions, { Units } from '../../src/index'

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

const Slide = {
  actions: {
    left: {
      prev: Transitions.actions,
      next: Transitions.actions,
    },
    right: {
      prev: Transitions.actions,
      next: Transitions.actions,
    },
    goLeft: () => (state: SlideState) => (actions: SlideActions) => {
      let next = state.index + 1
      if (next === state.slides.length) {
        next = 0
      }
      return [{
        ...state,
        index: next,
        currents: { prev: state.index, next },
        direction: 'left',
      }, Cmd.ofSub<SlideActions>(actions => {
        actions.left.prev.start()
        actions.left.next.start()
      })]
    },
    goRight: () => (state: SlideState) => (actions: SlideActions) => {
      let next = state.index - 1
      if (next === -1) {
        next = state.slides.length - 1
      }
      return [{
        ...state,
        index: next,
        currents: { prev: state.index, next },
        direction: 'right',
      }, Cmd.ofSub<SlideActions>(actions => {
        actions.right.prev.start()
        actions.right.next.start()
      })]
    },
  },
  init: () => Slide.state,
  state: {
    slides: ['red', 'yellow', 'blue'],
    currents: {
      prev: 0,
      next: 1,
    },
    index: 0,
    direction: 'left' as 'left' | 'right',
    right: {
      prev: Transitions.init([{
        translateX: Units.percent(100),
        duration: Units.ms(2000),
      }]),
      next: Transitions.init([{
        translateX: Units.percent(0),
        duration: Units.ms(2000),
      }], {
        initFrame: {
          translateX: Units.percent(-100),
        }
      })
    },
    left: {
      prev: Transitions.init([{
        translateX: Units.percent(-100),
        duration: Units.ms(2000),
      }]),
      next: Transitions.init([{
        translateX: Units.percent(0),
        duration: Units.ms(2000),
      }], {
        initFrame: {
          translateX: Units.percent(100),
        }
      })
    },
  }
}

const actions = {
  timeline: Transitions.actions,
  slide: Slide.actions
}

const state = {
  timeline: Transitions.init([{
    translateX: Units.px(200),
    scale: 2,
    duration: Units.ms(1000),
  }, {
    translateX: Units.px(100),
    scale: 1,
    duration: Units.ms(2000),
  }, {
    translateX: Units.px(200),
    scale: 2,
    duration: Units.ms(3000),
  }], {
    initFrame: {
      translateX: Units.px(100),
    }
  }),
  slide: Slide.init(),
}

type Actions = typeof actions
type State = typeof state
type SlideActions = typeof Slide.actions
type SlideState = typeof Slide.state
const pStyle = { margin: '20px' }
const view = (state: State) => (actions: Actions) =>
    <main>
      <style>{`

      `}</style>
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
      <button onClick={actions.slide.goLeft}>Go Left</button>
      <button onClick={actions.slide.goRight}>Go Right</button>
      <p style={{
        position: 'relative',
        width: '100px',
        height: '100px',
        overflow: 'hidden',
      }}>
        <div
          style={{
            width: '100px',
            height: '100px',
            position: 'absolute',
            top: '0px',
            left: '0px',
            background: state.slide.slides[state.slide.currents.prev],
            ...state.slide[state.slide.direction].prev.style,
          }}
          // key={state.slide.slides[state.slide.currents.prev]}
          className={state.slide[state.slide.direction].prev.className}
        />
        <div
          style={{
            width: '100px',
            height: '100px',
            position: 'absolute',
            top: '0px',
            left: '0px',
            background: state.slide.slides[state.slide.currents.next],
            ...state.slide[state.slide.direction].next.style,
          }}
          // key={state.slide.slides[state.slide.currents.next]}
          className={state.slide[state.slide.direction].next.className}
        />
      </p>
    </main>

export default app({
  init: () => state,
  actions,
  view,
})
