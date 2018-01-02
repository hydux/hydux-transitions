export declare type ValueOf2d<T> = [T] | [T, T];
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
export declare type CssSec = string & {
    _tag: 'CssPt';
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
export declare const Units: {
    deg: (n: number) => CssAngle;
    grad: (n: number) => CssAngle;
    rad: (n: number) => CssAngle;
    turn: (n: number) => CssAngle;
    px: (n: number) => CssPx;
    rem: (n: number) => CssRem;
    pt: (n: number) => CssPt;
    em: (n: number) => CssEm;
    sec: (n: number) => CssSec;
    cubicBezier: (ax: number, ay: number, bx: number, by: number) => CssCubicBezier;
    start: (n: number) => StartTime;
    offset: (n: number) => StartTime;
};
export declare type Transform = {
    value?: string;
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
};
export declare type Transition = {
    value?: string;
    delay?: CssSec;
    duration?: CssSec;
    property?: 'all' | 'transition' | 'opacity';
    easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'step-start' | 'step-end' | CssCubicBezier;
};
export declare type Frame = {
    transform: Transform;
    transition: Transition;
    className?: string;
    attrs?: {
        [key: string]: string;
    };
    opacity?: number;
    time: StartTime;
};
export declare const actions: {
    update: (i: number) => (state: State) => (actions: any) => void;
    start: () => (state: State) => (actions: any) => void;
    end: () => (state: State) => (actions: any) => void;
    reset: () => (state: State) => void;
};
export declare type Actions = typeof actions;
export declare type State = {
    isRunning: boolean;
    currentFrame: Frame[];
    styles: object;
    queue: Frame[];
    originalQueue: Frame[];
};
export declare const init: (frames: Frame[]) => State;
declare const _default: {
    init: (frames: Frame[]) => State;
    actions: {
        update: (i: number) => (state: State) => (actions: any) => void;
        start: () => (state: State) => (actions: any) => void;
        end: () => (state: State) => (actions: any) => void;
        reset: () => (state: State) => void;
    };
};
export default _default;
