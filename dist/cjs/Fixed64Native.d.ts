// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
declare namespace RuntimeExports {
    let HEAPF32: any;
    let HEAPF64: any;
    let HEAP_DATA_VIEW: any;
    let HEAP8: any;
    let HEAPU8: any;
    let HEAP16: any;
    let HEAPU16: any;
    let HEAP32: any;
    let HEAPU32: any;
    let HEAP64: any;
    let HEAPU64: any;
}
interface WasmModule {
}

export interface Vector2 {
  set(): void;
  toString(): string;
  delete(): void;
}

export interface Vector2List {
  push_back(_0: Vector2): void;
  resize(_0: number, _1: Vector2): void;
  size(): number;
  get(_0: number): Vector2 | undefined;
  set(_0: number, _1: Vector2): boolean;
  delete(): void;
}

export interface doubleVector {
  size(): number;
  get(_0: number): number | undefined;
  push_back(_0: number): void;
  resize(_0: number, _1: number): void;
  set(_0: number, _1: number): boolean;
  delete(): void;
}

export interface Vector3 {
  copy(_0: Vector3): Vector3;
  set(): void;
  delete(): void;
}

export interface Rect {
  delete(): void;
}

export interface Sector {
  delete(): void;
}

export type Fixed64Param = {
  isRaw: boolean,
  raw: number,
  high: number,
  low: number
};

export interface Fixed64Native {
  delete(): void;
}

interface EmbindModule {
  Vector2: {new(): Vector2; new(_0: number, _1: number): Vector2; add(): void; sub(): void; scalar(): void; normalize(): void; len(): void; dot(): void};
  Vector2List: {new(): Vector2List};
  doubleVector: {new(): doubleVector};
  Vector3: {new(): Vector3; cross(): void; dot(): void; add(): void; sub(): void; mul(): void; div(): void; scalar(): void; normalize(): void; normalizedDirection(): void; negative(): void; distance(): void; squaredDistance(): void; rotateX(): void; rotateY(): void; rotateZ(): void; lerp(): void; lengthSqr(): void; len(): void; decayKnockbackVector(): void; moveForward(): void; emptyCall(): void; isCircleOverlaps(_0: boolean, _1: boolean): boolean; isLineCircleIntersect(): boolean; velocityToForward(): boolean};
  Rect: {new(): Rect; overlapsWithCircle(_0: boolean): boolean; overlapsWithRect(): boolean; containsPoint(): boolean};
  Sector: {new(): Sector; overlapsWithCircle(): boolean};
  abs(): void;
  absSq(): void;
  det(): void;
  normalize(): void;
  getSizeOfFixed64Param(): number;
  getFixed64ParamOffsets(): any;
  getInteropParamArrayAddress(): number;
  getInteropReturnArrayAddress(): number;
  getInteropReturnUint32ArrayAddress(): number;
  getInteropUint32ParamArrayAddress(): number;
  Fixed64Native: {parseFloat(_0: number): void; div(): void; toNumber(): number; toString(): string; abs(): void; acos(): void; add(): void; asin(): void; atan(): void; atan2(): void; ceil(): void; clamp(): void; cos(): void; exp(): void; floor(): void; mod(): void; mul(): void; square(): void; pow2(): void; round(): void; sign(): void; sin(): void; sqrt(): void; sub(): void; tan(): void; neg(): void; isNaN(): boolean; isInfinity(): boolean; isFinite(): boolean; isInteger(): boolean; isNegative(): boolean; isPositive(): boolean; isZero(): boolean; gt(): boolean; gte(): boolean; lt(): boolean; lte(): boolean; eq(): boolean; cmp(): number; min(_0: number): void; max(_0: number): void; sum(_0: number): void; testPerformance(_0: number): string; emptyCall(): void};
}

export type MainModule = WasmModule & typeof RuntimeExports & EmbindModule;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;
