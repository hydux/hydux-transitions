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
const slideInitState = {
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
      duration: Units.ms(600),
    }]),
    next: Transitions.init([{
      translateX: Units.percent(0),
      duration: Units.ms(600),
    }], {
      initFrame: {
        translateX: Units.percent(-100),
      }
    })
  },
  left: {
    prev: Transitions.init([{
      translateX: Units.percent(-100),
      duration: Units.ms(600),
    }]),
    next: Transitions.init([{
      translateX: Units.percent(0),
      duration: Units.ms(600),
    }], {
      initFrame: {
        translateX: Units.percent(100),
      }
    })
  },
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
  init: () => slideInitState,
  view: (state: SlideState) => (actions: SlideActions) => (
    <div>
      <button onClick={actions.goLeft}>Go Left</button>
      <button onClick={actions.goRight}>Go Right</button>
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
            background: state.slides[state.currents.prev],
            ...state[state.direction].prev.style,
          }}
          onClick={e => console.log('clicked', state.slides[state.currents.prev])}
          className={state[state.direction].prev.className}
        />
        <div
          style={{
            width: '100px',
            height: '100px',
            position: 'absolute',
            top: '0px',
            left: '0px',
            background: state.slides[state.currents.next],
            ...state[state.direction].next.style,
          }}
          onClick={e => console.log('clicked', state.slides[state.currents.next])}
          className={state[state.direction].next.className}
        />
      </p>
    </div>
  )
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
type SlideState = typeof slideInitState
const pStyle = { margin: '20px' }
const view = (state: State) => (actions: Actions) =>
    <main>
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
      {Slide.view(state.slide)(actions.slide)}
    </main>

export default app({
  init: () => state,
  actions,
  view,
})
