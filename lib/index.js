"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cssPrefix = document.body.style.webkitTransform ? '-webkit-' : '';
exports.Units = {
    deg: function (n) { return n + 'deg'; },
    grad: function (n) { return n + 'grad'; },
    rad: function (n) { return n + 'rag'; },
    turn: function (n) { return n + 'turn'; },
    px: function (n) { return n + 'px'; },
    rem: function (n) { return n + 'rem'; },
    pt: function (n) { return n + 'pt'; },
    em: function (n) { return n + 'em'; },
    sec: function (n) { return n + 's'; },
    cubicBezier: function (ax, ay, bx, by) { return "cubic-bezier(" + ax + ", " + ay + ", " + bx + ", " + by + ")"; },
    start: function (n) { return ({ start: n }); },
    offset: function (n) { return ({ offset: n }); },
};
var isSet = function (v) { return typeof v !== 'undefined'; };
var isNum = function (v) { return typeof v === 'number'; };
var isArray = function (v) { return v instanceof Array; };
function parseTransform(t) {
    if (t.value) {
        return t.value;
    }
    var keys = Object.keys(t);
    var i = keys.length;
    var transform = '';
    while (i--) {
        var key = keys[i];
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
    if (t.value) {
        return t.value;
    }
    return (t.property || 'all') + " " + (t.duration || 500) + " " + (t.easing || 'ease-in-out');
}
function runFrame() {
}
exports.actions = {
    update: function (i) { return function (state) { return function (actions) {
        return;
    }; }; },
    start: function () { return function (state) { return function (actions) {
    }; }; },
    end: function () { return function (state) { return function (actions) {
    }; }; },
    reset: function () { return function (state) {
    }; }
};
exports.init = function (frames) { return ({
    isRunning: false,
    currentFrame: [],
    styles: {},
    queue: frames,
    originalQueue: frames
}); };
exports.default = {
    init: exports.init,
    actions: exports.actions
};
//# sourceMappingURL=index.js.map