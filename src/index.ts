import { Cmd, Sub } from 'hydux'
export { Sub }
export type ValueOf2d<T> = T | [T, T]
export type ValueOf3d<T> = ValueOf2d<T> | [T, T, T]

export type CssAngle = string & { _tag: 'Angle' }
export type CssPx = string & { _tag: 'CssPx' }
export type CssRem = string & { _tag: 'CssRem' }
export type CssEm = string & { _tag: 'CssEm' }
export type CssPt = string & { _tag: 'CssPt' }
export type CssMs = number & { _tag: 'DurtionMs' }
export type CssLenWithUnit = CssPx | CssRem | CssEm | CssPt
export type CssPercent = string & { _tag: 'CssPercent' }
export type CssLength = number | CssLenWithUnit | CssPercent
export type CssCubicBezier = string & { _tag: 'CssCubicBezier' }
export type StartTime = ({ start: number } | { offset: number }) & {
  _tag: 'HyduxTransitionOffset'
}
export type CssMatrix = string & { _tag: 'CssMatrix' }
export type CssMatrix3d = string & { _tag: 'CssMatrix3d' }

export const Units = {
  deg: (n: number) => (n + 'deg') as CssAngle,
  grad: (n: number) => (n + 'grad') as CssAngle,
  rad: (n: number) => (n + 'rag') as CssAngle,
  turn: (n: number) => (n + 'turn') as CssAngle,
  px: (n: number) => (n + 'px') as CssPx,
  percent: (n: number) => {
    if (n < -100 || n > 100) throw TypeError('n should >= -100 and <= 100, but get:' + n)
    return (n + '%') as CssPercent
  },
  rem: (n: number) => (n + 'rem') as CssRem,
  pt: (n: number) => (n + 'pt') as CssPt,
  em: (n: number) => (n + 'em') as CssEm,
  ms: (n: number) => n as CssMs,
  cubicBezier: (ax: number, ay: number, bx: number, by: number) =>
    `cubic-bezier(${ax}, ${ay}, ${bx}, ${by})` as CssCubicBezier,
  start: (n: number) => ({ start: n } as StartTime),
  offset: (n: number) => ({ offset: n } as StartTime),
  matrix: (a: number, b: number, c: number, d: number, tx: number, ty: number) =>
    `matrix(${a}, ${b}, ${c}, ${d}, ${tx}, ${ty})` as CssMatrix,
  matrix3d: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
    x: number,
    y: number,
    z: number,
  ) => `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f} ${x}, ${y}, ${z})` as CssMatrix3d,
}

export interface Transform {
  transform?: string
  translateX?: CssLength
  translateY?: CssLength
  translateZ?: CssLength
  translate?: ValueOf2d<CssLength>
  translate3d?: ValueOf3d<CssLength>
  scaleX?: number
  scaleY?: number
  scaleZ?: number
  scale?: ValueOf2d<number>
  scale3d?: ValueOf3d<number>
  rotateX?: CssAngle
  rotateY?: CssAngle
  rotateZ?: CssAngle
  rotate?: ValueOf2d<CssAngle>
  rotate3d?: ValueOf3d<CssAngle>
  skewX?: CssAngle
  skewY?: CssAngle
  skew?: ValueOf2d<CssAngle>
  perspective?: CssLength
  matrix?: CssMatrix
  matrix3d?: CssMatrix3d
}

export interface Frame extends Transform {
  transformOrigin?: string
  transformStyle?: string
  style?: object
  delay?: CssMs
  duration?: CssMs
  property?: 'all' | 'transition' | 'opacity'
  easing?:
    | 'ease'
    | 'ease-in'
    | 'ease-out'
    | 'ease-in-out'
    | 'step-start'
    | 'step-end'
    | CssCubicBezier
  className?: string
  attrs?: { [key: string]: string }
  opacity?: number
  onStart?: (frame: Frame) => any
  onEnd?: (frame: Frame) => any
}
const isSet = v => typeof v !== 'undefined'
const isNum = v => typeof v === 'number'
const isArray = v => v instanceof Array

function parseTransform(t: Transform) {
  if (t.transform) {
    return t.transform
  }
  const keys = Object.keys(t)
  let i = keys.length
  let transform = ''
  while (i--) {
    const key = keys[i]
    if (!/^translate|scale|rotate|skew|perspective|matrix/.test(key)) {
      continue
    }
    let val = t[key]
    if (!/^scale/.test(key)) {
      if (isNum(val)) {
        val = val + 'px'
      } else if (isArray(val) && isNum(val[0])) {
        val = val.map(Units.px)
      }
    }
    val = val instanceof Array ? val.join(', ') : val
    transform += `${key}(${val}) `
  }
  return transform
}

function parseTransition(t: Frame) {
  const duration = (t.duration || 0) / 1000
  const delay = (t.delay || 0) / 1000
  return [`${duration}s ${t.easing || 'ease-in-out'} ${delay}s`, t.property || 'transform,opacity']
}

function removeTransition(style: object) {
  const nextStyle = { ...style }
  delete nextStyle['WebkitTransition']
  delete nextStyle['transition']
  return nextStyle
}

const needPrefix = isSet(document.body.style.webkitTransform)

function frameToStyle(frame: Frame) {
  const style = frame.style || {}
  const [transition, transitionProperty] = parseTransition(frame)
  const transform = parseTransform(frame)
  if (needPrefix) {
    style['WebkitTransition'] = transition
    style['WebkitTransitionProperty'] = transitionProperty
    style['WebkitTransform'] = transform
    style['WebkitTransformOrigin'] = frame.transformOrigin
    style['WebkitTransformStyle'] = frame.transformStyle
  } else {
    style['transitionProperty'] = transitionProperty
    style['transition'] = transition
    style['transform'] = transform
    style['transform-origin'] = frame.transformOrigin
    style['transform-style'] = frame.transformStyle
  }
  return style
}
function isFn(fn: any): fn is Function {
  return typeof fn === 'function'
}

function runFrames(
  frames: Frame[],
  state: State,
  actions: Actions,
  onEnd?: Function,
  i: number = 0,
) {
  if (i >= frames.length) {
    actions.end()
    return isFn(onEnd) && onEnd(frames)
  }
  const frame = frames[i]
  requestAnimationFrame(() => {
    actions.$startFrame(frame)
    const endTimer = setTimeout(() => {
      requestAnimationFrame(() => {
        actions.$endFrame(frame)
      })
      runFrames(frames, state, actions, onEnd, ++i)
    }, frame.duration || 1)
    // is it worth to use anti-pattern to reduce vdom render ?
    state.timers.push(endTimer)
  })
  // state.timers.push(startTimer as any)
}
export class Actions {
  /** @internal */
  $startFrame = (frame: Frame) => (state: State) => {
    const nextState: State = {
      ...state,
      style: frameToStyle(frame),
      className: frame.className || '',
    }
    return [nextState, frame.onStart ? Cmd.ofFn(frame.onStart, frame) : Cmd.none]
  }
  // @internal
  $endFrame = (frame: Frame) => (state: State) => {
    return [state as State, frame.onEnd ? Cmd.ofFn(frame.onEnd, frame) : []]
  }
  // @internal
  $end = () => (state: State) => ({
    ...state,
    animState: AnimState.end,
  })
  start = (onEnd?: Function) => (state: State) => {
    return [
      init.apply(null, state._initArgs),
      Cmd.ofSub<Actions>(actions => {
        requestAnimationFrame(() => runFrames(state.frames, state, actions, onEnd))
      }),
    ]
  }
  run = (frames: Frame[]) => (state: State) => {
    const nextState: State = {
      ...state,
      frames,
    }
    return [
      nextState,
      Cmd.ofSub<Actions>(actions => {
        actions.start()
      }),
    ]
  }
  reset = () => (state: State) => {
    return [
      init.apply(null, state._initArgs),
      Cmd.ofFn(() => state.timers.forEach(timer => clearTimeout(timer as any)), void 0),
    ]
  }
  end = () => (state: State) => {
    if (state.frames.length === 0) return
    const lastFrame = state.frames[state.frames.length - 1]
    return [
      {
        ...state,
        animState: AnimState.end,
        style: removeTransition(frameToStyle(lastFrame)),
        timers: [],
        className: lastFrame.className || '',
      },
      Cmd.ofFn(() => state.timers.forEach(timer => clearTimeout(timer as any)), void 0),
    ]
  }
}

export const actions = new Actions()

export enum AnimState {
  running = 1,
  end = 2,
  ready = 3,
}
export type State = {
  animState: AnimState
  style: object
  className: string
  timers: (number | NodeJS.Timer)[]
  frames: Frame[]
  _initArgs: any[]
}
export type InitOptions = {
  initFrame?: Frame
}
export const init = (frames: Frame[] = [] as any, options: InitOptions = {}) =>
  ({
    animState: AnimState.ready,
    style: options.initFrame ? frameToStyle(options.initFrame) : {},
    className: '',
    timers: [],
    frames,
    _initArgs: [frames, options],
  } as State)

export default {
  init,
  actions,
  Units,
}
