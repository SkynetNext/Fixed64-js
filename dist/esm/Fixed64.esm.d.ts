import { Fixed64Param } from '../../dist/esm/Fixed64Native.mjs';
export declare namespace Fixed64 {
    type Constructor = typeof Fixed64;
    type Instance = Fixed64;
    type Value = string | number | Fixed64 | {
        x?: string;
    };
}
export declare class Fixed64 {
    private isRaw;
    private raw;
    private high;
    private low;
    static readonly MAX_SAFE_INTEGER: number;
    static readonly MIN_SAFE_INTEGER = -2147483648;
    static readonly EPSILON: Fixed64;
    static readonly NaN: Fixed64;
    static readonly Infinity: Fixed64;
    static readonly NegInfinity: Fixed64;
    private static readonly ONE;
    /**
     * Creates a new Decimal instance.
     *
     *  value - The value to create the Decimal instance from, can be a `string`, `number`, `Fixed64`, or an object with an optional `x` property.
     *      * - `new Fixed64(1.1)` creates a Decimal instance from a number.
     * - `new Fixed64('-0.5')` creates a Decimal instance from a string.
     * Note: When creating a Decimal instance from a `Number` type's special values (`NaN`, `Infinity`, `-Infinity`), the result will be `new Fixed64(0)`.
     */
    constructor(value: Fixed64.Value);
    /**
     * Sets the value of the Decimal instance.
     *
     *  value - Can be a `string`, `number`, `Fixed64`, or an object containing an `x` attribute.
     *
     * Warning: Avoid using this method to modify values, to prevent affecting other references, use only for local caching.
     */
    set(value: Fixed64.Value): Fixed64;
    clone(): Fixed64;
    private static createFromHighLow;
    private values;
    private static toFixed64Param;
    static prepareInteropParamArray(...decimals: (Fixed64 | Fixed64Param)[]): void;
    static prepareInteropParamUint32Array(params: number[]): void;
    static getInteropReturn(index: number, out?: Fixed64): Fixed64;
    static getInteropReturnUint32ArrayLength(): number;
    static getInteropReturnUint32ArrayValue(index: number): number;
    toNumberSafe(): number;
    get highLow(): [number, number];
    toJSON(): number | number[];
    static fromJSON(json: number | [number, number]): Fixed64;
    /**
       * When using the toNumber() method to convert Fixed64.Infinity, Decimal.NegInfinity, and Fixed64.NaN into numbers,
       * the results are respectively 140737488355328, -140737488355328, and -140737488355328.
       * These conversion results should be considered invalid or meaningless.
       * Thus, only when the result of the toNumber() method is within the range of [-140737488355328, 140737488355328],
       * it can be considered meaningful.
       **/
    toNumber(): number;
    parseRaw(): Fixed64;
    private static parseNumber;
    toString(): string;
    /**
     * Adds the current Decimal instance with another value.
     *
     *  {Fixed64.Value} b - The value to add. Can be a `string`, `number`, `Fixed64`, or an object with an optional `x` property.
     * Notes:
     * - Performing an addition operation on Decimal.Infinity with a positive value or subtracting a negative value from Decimal.NegInfinity/Fixed64.NaN is unpredictable. This is because the underlying implementation uses int64_t (64-bit integer in C++), and if overflow occurs in these operations, the result is unpredictable.
     *   Mathematically, attempting to push values beyond infinity is undefined.
     * - Conversely, subtracting a positive value from Decimal.Infinity or adding a positive value to Decimal.NegInfinity/Fixed64.NaN is generally safer,
     *   as these operations attempt to pull values back from the edge of infinity into a finite range.
     * - Operations on Infinity or NaN differ from JavaScript's Number type. For example:
     *   - Fixed64.Infinity.add(Fixed64.EPSILON) results in Fixed64.NaN.
     *   - Fixed64.Infinity.NaN.add(Fixed64.EPSILON) results in Fixed64.NegInfinity.
     *   - Fixed64.NegInfinity.sub(Fixed64.EPSILON) results in Fixed64.NaN.
     *   - Fixed64.NaN.sub(Fixed64.EPSILON) results in Fixed64.Infinity.
     *   These behaviors do not align with mathematical expectations but reflect the overflow behavior of the underlying int64_t type.
     *
     *  {Fixed64} Returns a new Decimal instance representing the result of the addition operation.
     */
    add(b: Fixed64.Value, out?: Fixed64): Fixed64;
    sub(b: Fixed64.Value, out?: Fixed64): Fixed64;
    mul(b: Fixed64.Value, out?: Fixed64): Fixed64;
    dividedBy(n: Fixed64.Value, out?: Fixed64): Fixed64;
    /**
     * Note: The value of this.toNumber() should be between Fixed64.MIN_SAFE_INTEGER and Fixed64.MAX_SAFE_INTEGER.
     * If it exceeds this range, the underlying dividend overflows, resulting in unpredictable outcomes.
     *
     * Dividing any number by 0 (n.div(0)) yields Infinity (if n is positive) or NegInfinity (if n is negative),
     * reflecting the mathematical concept of infinity, where any non-zero quantity divided by zero tends towards infinite or infinitely small.
     */
    div(n: Fixed64.Value, out?: Fixed64): Fixed64;
    mod(b: Fixed64.Value, out?: Fixed64): Fixed64;
    negated(): Fixed64;
    neg(): Fixed64;
    square(out?: Fixed64): Fixed64;
    /**
     * Calculates 2 raised to the power of n.
     * This method is equivalent to Math.pow(2, n).
     */
    pow2(out?: Fixed64): Fixed64;
    static sqrt(a: Fixed64.Value, out?: Fixed64): Fixed64;
    sqrt(out?: Fixed64): Fixed64;
    cmp(b: Fixed64.Value): number;
    equals(n: Fixed64.Value): boolean;
    greaterThan(n: Fixed64.Value): boolean;
    greaterThanOrEqualTo(n: Fixed64.Value): boolean;
    lessThan(n: Fixed64.Value): boolean;
    lessThanOrEqualTo(n: Fixed64.Value): boolean;
    absoluteValue(): Fixed64;
    abs(): Fixed64;
    static ceil(a: Fixed64.Value, out?: Fixed64): Fixed64;
    ceil(out?: Fixed64): Fixed64;
    static floor(a: Fixed64.Value, out?: Fixed64): Fixed64;
    floor(out?: Fixed64): Fixed64;
    static round(a: Fixed64.Value, out?: Fixed64): Fixed64;
    round(out?: Fixed64): Fixed64;
    static cos(a: Fixed64.Value, out?: Fixed64): Fixed64;
    static sin(a: Fixed64.Value, out?: Fixed64): Fixed64;
    static tan(a: Fixed64.Value, out?: Fixed64): Fixed64;
    static acos(a: Fixed64.Value, out?: Fixed64): Fixed64;
    static asin(a: Fixed64.Value, out?: Fixed64): Fixed64;
    static atan(a: Fixed64.Value, out?: Fixed64): Fixed64;
    static atan2(y: Fixed64.Value, x: Fixed64.Value, out?: Fixed64): Fixed64;
    static clamp(a: Fixed64.Value, min: Fixed64.Value, max: Fixed64.Value, out?: Fixed64): Fixed64;
    static max(...args: Fixed64.Value[]): Fixed64;
    static min(...args: Fixed64.Value[]): Fixed64;
    static sum(...args: Fixed64.Value[]): Fixed64;
    isInteger(): boolean;
    /**
    * - Fixed64.NaN's characteristics are: isNaN() returns true, isInfinity() returns false, isFinite() returns false.
    * - Fixed64.Infinity and Decimal.NegInfinity's characteristics are: isNaN() returns false, isInfinity() returns true, isFinite() returns false.
    */
    isFinite(): boolean;
    /**
    * - Fixed64.NaN's characteristics are: isNaN() returns true, isInfinity() returns false, isFinite() returns false.
    * - Fixed64.Infinity and Decimal.NegInfinity's characteristics are: isNaN() returns false, isInfinity() returns true, isFinite() returns false.
    */
    isNaN(): boolean;
    /**
    * - Fixed64.NaN's characteristics are: isNaN() returns true, isInfinity() returns false, isFinite() returns false.
    * - Fixed64.Infinity and Decimal.NegInfinity's characteristics are: isNaN() returns false, isInfinity() returns true, isFinite() returns false.
    */
    isInfinity(): boolean;
    static isZero(values: Fixed64Param): boolean;
    isZero(): boolean;
    private static isOne;
    isOne(): boolean;
    eq(n: Fixed64.Value): boolean;
    gt(n: Fixed64.Value): boolean;
    gte(n: Fixed64.Value): boolean;
    lt(n: Fixed64.Value): boolean;
    lte(n: Fixed64.Value): boolean;
    sign(): number;
    static sign(n: Fixed64.Value): number;
    static parseFloat(n: number, out?: Fixed64): Fixed64;
    /**
     * Note: This method performs calculations by converting internal values to native JavaScript numbers, which may lead to inconsistencies in calculation results across different platforms' CPUs.
     * Therefore, it is strictly forbidden to use this method in combat systems where cross-platform result consistency is required.
     * This method is only suitable for scenarios where strict consistency of calculation results is not required, such as peripheral development systems.
     */
    addAsNumber(n: Fixed64.Value, out?: Fixed64): Fixed64;
    /**
     * Note: This method performs calculations by converting internal values to native JavaScript numbers, which may lead to inconsistencies in calculation results across different platforms' CPUs.
     * Therefore, it is strictly forbidden to use this method in combat systems where cross-platform result consistency is required.
     * This method is only suitable for scenarios where strict consistency of calculation results is not required, such as peripheral development systems.
     */
    subAsNumber(n: Fixed64.Value, out?: Fixed64): Fixed64;
    /**
     * Note: This method performs calculations by converting internal values to native JavaScript numbers, which may lead to inconsistencies in calculation results across different platforms' CPUs.
     * Therefore, it is strictly forbidden to use this method in combat systems where cross-platform result consistency is required.
     * This method is only suitable for scenarios where strict consistency of calculation results is not required, such as peripheral development systems.
     */
    mulAsNumber(n: Fixed64.Value, out?: Fixed64): Fixed64;
    /**
     * Note: This method performs calculations by converting internal values to native JavaScript numbers, which may lead to inconsistencies in calculation results across different platforms' CPUs.
     * Therefore, it is strictly forbidden to use this method in combat systems where cross-platform result consistency is required.
     * This method is only suitable for scenarios where strict consistency of calculation results is not required, such as peripheral development systems.
     */
    divAsNumber(n: Fixed64.Value, out?: Fixed64): Fixed64;
}
