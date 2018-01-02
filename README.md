# hydux-transitions

[![Build Status](https://travis-ci.org/hydux/hydux-transitions.svg?branch=master)](https://travis-ci.org/hydux/hydux-transitions) [![npm](https://img.shields.io/npm/v/hydux-transitions.svg)](https://www.npmjs.com/package/hydux-transitions) [![npm](https://img.shields.io/npm/dm/hydux-transitions.svg)](https://www.npmjs.com/package/hydux-transitions)

A transition library followed The Elm Architecture, for Hydux.

## Install
```sh
yarn add hydux-transitions # npm i hydux-transitions
```

## Usage
```js

const actions = {
  timeline: Transitions.actions,
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

const view = (state) => (actions) => {
  return (
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
    </main>
  )
}

app({
  init: () => state,
  actions,
  view
})

```

## License

MIT
