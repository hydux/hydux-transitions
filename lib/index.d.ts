/// <reference types="node" />
import { Sub } from 'hydux';
export { Sub };
export declare type ValueOf2d<T> = T | [T, T];
export declare type ValueOf3d<T> = ValueOf2d<T> | [T, T, T];
export declare type CssAngle = string & {
    _tag: 'Angle';
};
export declare type CssPx = string & {
    _tag: 'CssPx';
};
export declare type CssRem = string & {
    _tag: 'CssRem';
};
export declare type CssEm = string & {
    _tag: 'CssEm';
};
export declare type CssPt = string & {
    _tag: 'CssPt';
};
export declare type CssMs = number & {
    _tag: 'DurtionMs';
};
export declare type CssLenWithUnit = CssPx | CssRem | CssEm | CssPt;
export declare type CssPercent = string & {
    _tag: 'CssPercent';
};
export declare type CssLength = number | CssLenWithUnit | CssPercent;
export declare type CssCubicBezier = string & {
    _tag: 'CssCubicBezier';
};
export declare type StartTime = ({
    start: number;
} | {
    offset: number;
}) & {
    _tag: 'HyduxTransitionOffset';
};
export declare type CssMatrix = string & {
    _tag: 'CssMatrix';
};
export declare type CssMatrix3d = string & {
    _tag: 'CssMatrix3d';
};
export declare const Units: {
    deg: (n: number) => CssAngle;
    grad: (n: number) => CssAngle;
    rad: (n: number) => CssAngle;
    turn: (n: number) => CssAngle;
    px: (n: number) => CssPx;
    percent: (n: number) => CssPercent;
    rem: (n: number) => CssRem;
    pt: (n: number) => CssPt;
    em: (n: number) => CssEm;
    ms: (n: number) => CssMs;
    cubicBezier: (ax: number, ay: number, bx: number, by: number) => CssCubicBezier;
    start: (n: number) => StartTime;
    offset: (n: number) => StartTime;
    matrix: (a: number, b: number, c: number, d: number, tx: number, ty: number) => CssMatrix;
    matrix3d: (a: number, b: number, c: number, d: number, e: number, f: number, x: number, y: number, z: number) => CssMatrix3d;
};
export interface Transform {
    transform?: string;
    translateX?: CssLength;
    translateY?: CssLength;
    translateZ?: CssLength;
    translate?: ValueOf2d<CssLength>;
    translate3d?: ValueOf3d<CssLength>;
    scaleX?: number;
    scaleY?: number;
    scaleZ?: number;
    scale?: ValueOf2d<number>;
    scale3d?: ValueOf3d<number>;
    rotateX?: CssAngle;
    rotateY?: CssAngle;
    rotateZ?: CssAngle;
    rotate?: ValueOf2d<CssAngle>;
    rotate3d?: ValueOf3d<CssAngle>;
    skewX?: CssAngle;
    skewY?: CssAngle;
    skew?: ValueOf2d<CssAngle>;
    perspective?: CssLength;
    matrix?: CssMatrix;
    matrix3d?: CssMatrix3d;
}
export interface Frame extends Transform {
    transformOrigin?: string;
    transformStyle?: string;
    style?: object;
    delay?: CssMs;
    duration?: CssMs;
    property?: 'all' | 'transition' | 'opacity';
    easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'step-start' | 'step-end' | CssCubicBezier;
    className?: string;
    attrs?: {
        [key: string]: string;
    };
    opacity?: number;
    onStart?: (frame: Frame) => any;
    onEnd?: (frame: Frame) => any;
}
export declare const actions: {
    _startFrame: (frame: Frame) => (state: State) => (actions: any) => (Sub<any>[] | State)[];
    _endFrame: (frame: Frame) => (state: State) => (actions: any) => (State | Sub<{}>[])[];
    _end: () => (state: State) => {
        animState: AnimState;
        style: object;
        className: string;
        timers: (number | NodeJS.Timer)[];
        frames: Frame[];
        _initArgs: any[];
    };
    start: (onEnd?: Function | undefined) => (state: State) => (actions: any) => any[];
    run: (frames: Frame[]) => (state: State) => (actions: any) => (State | Sub<any>[])[];
    reset: () => (state: State) => any[];
    end: () => (state: State) => (actions: any) => (Sub<{}>[] | {
        animState: AnimState;
        style: {};
        timers: never[];
        className: string;
        frames: Frame[];
        _initArgs: any[];
    })[] | undefined;
};
export declare type People = {
    name: string;
    age: number;
};
export declare type Actions = typeof actions;
export declare enum AnimState {
    running = 1,
    end = 2,
    ready = 3,
}
export declare type State = {
    animState: AnimState;
    style: object;
    className: string;
    timers: (number | NodeJS.Timer)[];
    frames: Frame[];
    _initArgs: any[];
};
export declare type InitOptions = {
    initFrame?: Frame;
};
export declare const init: (frames?: Frame[], options?: InitOptions) => State;
declare const _default: {
    init: (frames?: Frame[], options?: InitOptions) => State;
    actions: {
        _startFrame: (frame: Frame) => (state: State) => (actions: any) => (Sub<any>[] | State)[];
        _endFrame: (frame: Frame) => (state: State) => (actions: any) => (State | Sub<{}>[])[];
        _end: () => (state: State) => {
            animState: AnimState;
            style: object;
            className: string;
            timers: (number | NodeJS.Timer)[];
            frames: Frame[];
            _initArgs: any[];
        };
        start: (onEnd?: Function | undefined) => (state: State) => (actions: any) => any[];
        run: (frames: Frame[]) => (state: State) => (actions: any) => (State | Sub<any>[])[];
        reset: () => (state: State) => any[];
        end: () => (state: State) => (actions: any) => (Sub<{}>[] | {
            animState: AnimState;
            style: {};
            timers: never[];
            className: string;
            frames: Frame[];
            _initArgs: any[];
        })[] | undefined;
    };
    Units: {
        deg: (n: number) => CssAngle;
        grad: (n: number) => CssAngle;
        rad: (n: number) => CssAngle;
        turn: (n: number) => CssAngle;
        px: (n: number) => CssPx;
        percent: (n: number) => CssPercent;
        rem: (n: number) => CssRem;
        pt: (n: number) => CssPt;
        em: (n: number) => CssEm;
        ms: (n: number) => CssMs;
        cubicBezier: (ax: number, ay: number, bx: number, by: number) => CssCubicBezier;
        start: (n: number) => StartTime;
        offset: (n: number) => StartTime;
        matrix: (a: number, b: number, c: number, d: number, tx: number, ty: number) => CssMatrix;
        matrix3d: (a: number, b: number, c: number, d: number, e: number, f: number, x: number, y: number, z: number) => CssMatrix3d;
    };
};
export default _default;
