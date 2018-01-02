import Transitions, { Units } from '../../src/index'
import { ActionsType, Cmd } from 'hydux'
import { React } from 'hydux/lib/enhancers/picodom-render'

export const state = {
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

export const actions = {
  left: {
    prev: Transitions.actions,
    next: Transitions.actions,
  },
  right: {
    prev: Transitions.actions,
    next: Transitions.actions,
  },
  goLeft: () => (state: State) => (actions: Actions) => {
    let next = state.index + 1
    if (next === state.slides.length) {
      next = 0
    }
    return [{
      ...state,
      index: next,
      currents: { prev: state.index, next },
      direction: 'left',
    }, Cmd.ofSub<Actions>(actions => {
      actions.left.prev.start()
      actions.left.next.start()
    })]
  },
  goRight: () => (state: State) => (actions: Actions) => {
    let next = state.index - 1
    if (next === -1) {
      next = state.slides.length - 1
    }
    return [{
      ...state,
      index: next,
      currents: { prev: state.index, next },
      direction: 'right',
    }, Cmd.ofSub<Actions>(actions => {
      actions.right.prev.start()
      actions.right.next.start()
    })]
  },
}
export const init = () => state

export const view = (state: State) => (actions: Actions) => {
  return (
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

export type State = typeof state
export type Actions = typeof actions
