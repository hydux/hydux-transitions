"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var hydux_1 = require("hydux");
exports.Units = {
    deg: function (n) { return n + 'deg'; },
    grad: function (n) { return n + 'grad'; },
    rad: function (n) { return n + 'rag'; },
    turn: function (n) { return n + 'turn'; },
    px: function (n) { return n + 'px'; },
    percent: function (n) {
        if (n < -100 || n > 100)
            throw TypeError('n should >= -100 and <= 100, but get:' + n);
        return n + '%';
    },
    rem: function (n) { return n + 'rem'; },
    pt: function (n) { return n + 'pt'; },
    em: function (n) { return n + 'em'; },
    ms: function (n) { return n; },
    cubicBezier: function (ax, ay, bx, by) { return "cubic-bezier(" + ax + ", " + ay + ", " + bx + ", " + by + ")"; },
    start: function (n) { return ({ start: n }); },
    offset: function (n) { return ({ offset: n }); },
    matrix: function (a, b, c, d, tx, ty) { return "matrix(" + a + ", " + b + ", " + c + ", " + d + ", " + tx + ", " + ty + ")"; },
    matrix3d: function (a, b, c, d, e, f, x, y, z) { return "matrix(" + a + ", " + b + ", " + c + ", " + d + ", " + e + ", " + f + " " + x + ", " + y + ", " + z + ")"; },
};
var isSet = function (v) { return typeof v !== 'undefined'; };
var isNum = function (v) { return typeof v === 'number'; };
var isArray = function (v) { return v instanceof Array; };
function parseTransform(t) {
    if (t.transform) {
        return t.transform;
    }
    var keys = Object.keys(t);
    var i = keys.length;
    var transform = '';
    while (i--) {
        var key = keys[i];
        if (!/^translate|scale|rotate|skew|perspective|matrix/.test(key)) {
            continue;
        }
        var val = t[key];
        if (!/^scale/.test(key)) {
            if (isNum(val)) {
                val = val + 'px';
            }
            else if (isArray(val) && isNum(val[0])) {
                val = val.map(exports.Units.px);
            }
        }
        val = val instanceof Array ? val.join(', ') : val;
        transform += key + "(" + val + ") ";
    }
    return transform;
}
function parseTransition(t) {
    var duration = (t.duration || 0) / 1000;
    var delay = (t.delay || 0) / 1000;
    return [duration + "s " + (t.easing || 'ease-in-out') + " " + delay + "s", t.property || 'transform,opacity'];
}
function removeTransition(style) {
    var nextStyle = tslib_1.__assign({}, style);
    delete nextStyle['WebkitTransition'];
    delete nextStyle['transition'];
    return nextStyle;
}
var needPrefix = isSet(document.body.style.webkitTransform);
function frameToStyle(frame) {
    var style = frame.style || {};
    var _a = parseTransition(frame), transition = _a[0], transitionProperty = _a[1];
    var transform = parseTransform(frame);
    if (needPrefix) {
        style['WebkitTransition'] = transition;
        style['WebkitTransitionProperty'] = transitionProperty;
        style['WebkitTransform'] = transform;
        style['WebkitTransformOrigin'] = frame.transformOrigin;
        style['WebkitTransformStyle'] = frame.transformStyle;
    }
    else {
        style['transitionProperty'] = transitionProperty;
        style['transition'] = transition;
        style['transform'] = transform;
        style['transform-origin'] = frame.transformOrigin;
        style['transform-style'] = frame.transformStyle;
    }
    return style;
}
function isFn(fn) {
    return typeof fn === 'function';
}
function runFrames(frames, state, actions, onEnd, i) {
    if (i === void 0) { i = 0; }
    if (i >= frames.length) {
        actions._end();
        return isFn(onEnd) && onEnd(frames);
    }
    var frame = frames[i];
    requestAnimationFrame(function () {
        actions._startFrame(frame);
        var endTimer = setTimeout(function () {
            requestAnimationFrame(function () {
                actions._endFrame(frame);
            });
            runFrames(frames, state, actions, onEnd, ++i);
        }, frame.duration || 1);
        // is it worth to use anti-pattern to reduce vdom render ?
        state.timers.push(endTimer);
    });
    // state.timers.push(startTimer as any)
}
exports.actions = {
    _startFrame: function (frame) { return function (state) {
        var nextState = tslib_1.__assign({}, state, { style: frameToStyle(frame), className: frame.className || '' });
        return [
            nextState,
            frame.onStart
                ? hydux_1.Cmd.ofFn(frame.onStart, frame)
                : hydux_1.Cmd.none
        ];
    }; },
    _endFrame: function (frame) { return function (state) {
        return [
            state,
            frame.onEnd
                ? hydux_1.Cmd.ofFn(frame.onEnd, frame)
                : []
        ];
    }; },
    _end: function () { return function (state) { return (tslib_1.__assign({}, state, { animState: AnimState.end })); }; },
    start: function (onEnd) { return function (state) {
        return [
            exports.init.apply(null, state._initArgs),
            hydux_1.Cmd.ofSub(function (actions) {
                requestAnimationFrame(function () {
                    return runFrames(state.frames, state, actions, onEnd);
                });
            }),
        ];
    }; },
    run: function (frames) { return function (state) {
        var nextState = tslib_1.__assign({}, state, { frames: frames });
        return [state, hydux_1.Cmd.ofSub(function (actions) {
                actions.start();
            })];
    }; },
    reset: function () { return function (state) {
        return [
            exports.init.apply(null, state._initArgs),
            hydux_1.Cmd.ofFn(function () { return state.timers.forEach(function (timer) { return clearTimeout(timer); }); }, void 0),
        ];
    }; },
    end: function () { return function (state) {
        if (state.frames.length === 0)
            return;
        var lastFrame = state.frames[state.frames.length - 1];
        return [
            tslib_1.__assign({}, state, { animState: AnimState.end, style: removeTransition(frameToStyle(lastFrame)), timers: [], className: lastFrame.className || '' }),
            hydux_1.Cmd.ofFn(function () { return state.timers.forEach(function (timer) { return (clearTimeout(timer)); }); }, void 0),
        ];
    }; }
};
function isPeople(obj) {
    var obj2 = obj;
    if (typeof obj2.name === 'function' && typeof obj2.age === 'number') {
        return true;
    }
    return false;
}
var AnimState;
(function (AnimState) {
    AnimState[AnimState["running"] = 1] = "running";
    AnimState[AnimState["end"] = 2] = "end";
    AnimState[AnimState["ready"] = 3] = "ready";
})(AnimState = exports.AnimState || (exports.AnimState = {}));
exports.init = function (frames, options) {
    if (frames === void 0) { frames = []; }
    if (options === void 0) { options = {}; }
    return ({
        animState: AnimState.ready,
        style: options.initFrame ? frameToStyle(options.initFrame) : {},
        className: '',
        timers: [],
        frames: frames,
        _initArgs: [frames, options]
    });
};
exports.default = {
    init: exports.init,
    actions: exports.actions,
    Units: exports.Units,
};
//# sourceMappingURL=index.js.map