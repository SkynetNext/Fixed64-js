/* eslint-disable */
// Fixed64.ts
import { Fixed64Module, interopReturnArrayAddress, interopReturnUint32ArrayAddress, fixed64ParamOffsets, interopParamArrayAddress, sizeOfFixed64Param, interopParamUint32ArrayAddress } from './Fixed64WasmLoader.cjs.js';
import { Fixed64Param } from '../../dist/cjs/Fixed64Native.js';

export namespace Fixed64 {
    export type Constructor = typeof Fixed64;
    export type Instance = Fixed64;
    export type Value = string | number | Fixed64 | { x?: string };
}

const tempHighLow: { high: number, low: number } = { high: 0, low: 0 };
const tempFixed64Array: Fixed64Param[] = Array.from({ length: 16 }, (): Fixed64Param => ({ isRaw: false, raw: 0, high: 0, low: 0 }));
let tempFixed64ArrayOffset = 0;

export class Fixed64 {
    private isRaw: boolean = true;
    private raw: number = 0;
    private high: number = 0;
    private low: number = 0;

    public static readonly MAX_SAFE_INTEGER: number = 2147483647;
    public static readonly MIN_SAFE_INTEGER = -2147483648;
    public static readonly EPSILON = Fixed64.createFromHighLow(0, 1);
    public static readonly NaN = Fixed64.createFromHighLow(-2147483648, 0);
    public static readonly Infinity = Fixed64.createFromHighLow(0x7FFFFFFF, 0xFFFFFFFF);
    public static readonly NegInfinity = Fixed64.createFromHighLow(-2147483648, 1);

    private static readonly ONE: number = 65536;

    /**
     * Creates a new Decimal instance.
     * 
     *  value - The value to create the Decimal instance from, can be a `string`, `number`, `Fixed64`, or an object with an optional `x` property.
     *      * - `new Fixed64(1.1)` creates a Decimal instance from a number.
     * - `new Fixed64('-0.5')` creates a Decimal instance from a string.
     * Note: When creating a Decimal instance from a `Number` type's special values (`NaN`, `Infinity`, `-Infinity`), the result will be `new Fixed64(0)`.
     */
    public constructor(value: Fixed64.Value) {
        this.set(value);
    }

    /**
     * Sets the value of the Decimal instance.
     * 
     *  value - Can be a `string`, `number`, `Fixed64`, or an object containing an `x` attribute.
     * 
     * Warning: Avoid using this method to modify values, to prevent affecting other references, use only for local caching.
     */
    public set(value: Fixed64.Value): Fixed64 {
        if (value === this) {
            return this;
        }

        this.isRaw = true;
        if (typeof value === 'number') {
            this.raw = value;
        } else if (value instanceof Fixed64) {
            this.isRaw = value.isRaw;
            this.raw = value.raw;
            this.high = value.high;
            this.low = value.low;
        } else if (typeof value === 'string') {
            this.raw = value === '' ? 0 : parseFloat(value);
        } else if (typeof value === 'object' && value !== null) {
            const xValue = value.x;
            if (xValue === undefined || xValue === '') {
                this.raw = 0;
            } else if (typeof xValue === 'string') {
                this.raw = parseFloat(xValue);
            } else {
                throw new Error('Invalid input type for Fixed64 constructor: object.x must be a string');
            }
        } else if ((value as any) === false || value === null || value === undefined) {
            this.raw = 0;
        } else if ((value as any) === true) {
            this.raw = 1;
        } else {
            const getTypeName = (val: unknown) => {
                if (typeof val === 'object' || typeof val === 'function') {
                    return Object.prototype.toString.call(val).slice(8, -1);
                }
                return typeof val;
            };

            throw new Error(`Invalid input type for Fixed64 constructor: ${getTypeName(value)}`);
        }

        return this;
    }

    public clone(): Fixed64 {
        return new Fixed64(this);
    }

    private static createFromHighLow(high: number, low: number): Fixed64 {
        const d = new Fixed64(0);
        d.isRaw = false;
        d.raw = 0;
        d.high = high;
        d.low = low;
        return d;
    }

    // Bridging C++ interface
    private values(): Fixed64Param {
        const result = tempFixed64Array[tempFixed64ArrayOffset];
        tempFixed64ArrayOffset = (tempFixed64ArrayOffset + 1) % tempFixed64Array.length;

        result.isRaw = this.isRaw;
        result.raw = this.raw;
        result.high = this.high;
        result.low = this.low;

        return result;
    }

    private static toFixed64Param(a: Fixed64.Value): Fixed64Param {
        if (a instanceof Fixed64) {
            return a.values();
        } else if (typeof a === 'number') {
            const result = tempFixed64Array[tempFixed64ArrayOffset];
            tempFixed64ArrayOffset = (tempFixed64ArrayOffset + 1) % tempFixed64Array.length;

            result.isRaw = true;
            result.raw = a;
            result.high = 0;
            result.low = 0;

            return result;
        } else {
            return new Fixed64(a).values();
        }
    }

    public static prepareInteropParamArray(...decimals: (Fixed64 | Fixed64Param)[]): void {
        function setInteropParam(index: number, value: Fixed64Param): void {
            const offset = index * sizeOfFixed64Param;
            const address = interopParamArrayAddress + offset;

            // Update boolean value
            Fixed64Module.HEAP32[(address + fixed64ParamOffsets.isRaw) >> 2] = value.isRaw ? 1 : 0;
            if (value.isRaw) {
                // Update double-precision floating-point number
                Fixed64Module.HEAPF64[(address + fixed64ParamOffsets.raw) >> 3] = value.raw;
            }
            else {
                // Update integer
                Fixed64Module.HEAP32[(address + fixed64ParamOffsets.high) >> 2] = value.high;
                Fixed64Module.HEAPU32[(address + fixed64ParamOffsets.low) >> 2] = value.low;
            }
        }

        for (let index = 0; index < decimals.length; index++) {
            const decimal = decimals[index];
            if (decimal instanceof Fixed64) {
                setInteropParam(index, decimal.values());
            } else {
                setInteropParam(index, decimal);
            }
        }
    }

    public static prepareInteropParamUint32Array(params: number[]): void {
        for (let index = 0; index < params.length; index++) {
            const valueAddress = interopParamUint32ArrayAddress + index * 4;
            Fixed64Module.HEAPU32[valueAddress >> 2] = params[index];
        }
    }

    public static getInteropReturn(index: number, out?: Fixed64): Fixed64 {
        const offset = index * sizeOfFixed64Param;
        const address = interopReturnArrayAddress + offset;

        // Read integer
        const high = Fixed64Module.HEAP32[(address + fixed64ParamOffsets.high) >> 2];
        const low = Fixed64Module.HEAPU32[(address + fixed64ParamOffsets.low) >> 2];

        if (out) {
            out.isRaw = false;
            out.raw = 0;
            out.high = high;
            out.low = low;

            return out;
        }
        else {
            return Fixed64.createFromHighLow(high, low);
        }
    }

    public static getInteropReturnUint32ArrayLength(): number {
        const length = Fixed64Module.HEAPU32[interopReturnUint32ArrayAddress >> 2];
        return length;
    }

    public static getInteropReturnUint32ArrayValue(index: number): number {
        const offset = (1 + index) * 4;
        const valueAddress = interopReturnUint32ArrayAddress + offset;

        const value = Fixed64Module.HEAPU32[valueAddress >> 2];
        return value;
    }

    // Utility Functions
    // ToNumber
    public toNumberSafe(): number {
        if (this.isRaw) {
            return this.raw;
        }
        Fixed64.prepareInteropParamArray(this);
        return Fixed64Module.Fixed64Native.toNumber();
    }

    public get highLow(): [number, number] {
        return [this.high, this.low];
    }

    public toJSON() {
        if (this.isRaw) {
            return this.raw;
        } else {
            return [this.high, this.low];
        }
    }

    public static fromJSON(json: number | [number, number]): Fixed64 {
        if (Array.isArray(json)) {
            return Fixed64.createFromHighLow(json[0], json[1]);
        } else {
            return new Fixed64(json);
        }
    }

    /**
       * When using the toNumber() method to convert Fixed64.Infinity, Decimal.NegInfinity, and Fixed64.NaN into numbers,
       * the results are respectively 140737488355328, -140737488355328, and -140737488355328.
       * These conversion results should be considered invalid or meaningless.
       * Thus, only when the result of the toNumber() method is within the range of [-140737488355328, 140737488355328],
       * it can be considered meaningful.
       **/
    public toNumber(): number {
        if (this.isRaw) {
            return this.raw;
        }

        let num = this.low / Fixed64.ONE;
        if (this.high !== 0) {
            num += this.high * Fixed64.ONE;
        }

        return num;
    }

    public parseRaw(): Fixed64 {
        if (this.isRaw) {
            const parsed = Fixed64.parseNumber(this.raw);
            this.high = parsed.high;
            this.low = parsed.low;
            this.isRaw = false;
        }

        return this;
    }

    private static parseNumber(value: number): { high: number, low: number } {
        if (value === 0) {
            tempHighLow.high = 0;
            tempHighLow.low = 0;
            return tempHighLow;
        }

        let integerPart = Math.floor(value);
        let fractionalPart = value - integerPart;

        tempHighLow.high = integerPart >> 16;
        tempHighLow.low = ((integerPart & 0xffff) << 16) + (fractionalPart * Fixed64.ONE) >>> 0;

        return tempHighLow;
    }

    public toString(): string {
        return this.toNumber().toString();
    }

    // Basic Arithmetic Operations

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
    public add(b: Fixed64.Value, out?: Fixed64): Fixed64 {
        const bFixed64 = Fixed64.toFixed64Param(b);
        if (this.isRaw) {
            this.parseRaw();
        }

        if (bFixed64.isRaw) {
            const parsed = Fixed64.parseNumber(bFixed64.raw);
            bFixed64.high = parsed.high;
            bFixed64.low = parsed.low;
        }

        // Use the passed out parameter, if not provided, create a new Decimal instance.
        if (!out) {
            out = new Fixed64(this);
        } else if (out !== this) {
            // If the passed out is not the current instance, copy the current instance's values to out.
            out.high = this.high;
            out.low = this.low;
            out.isRaw = this.isRaw;
            out.raw = this.raw;
        }

        // First handle the low part
        out.low += bFixed64.low;
        if (out.low >= 0x100000000) {
            // If it exceeds the maximum value of the low part after addition, carry over to the high part
            out.high += 1;
            out.low -= 0x100000000; // Subtract 2^32
        }

        // Handle the high part.
        out.high += bFixed64.high;

        out.high = out.high | 0;// Ensure the high part is a 32-bit signed integer

        return out;
    }

    public sub(b: Fixed64.Value, out?: Fixed64): Fixed64 {
        const bFixed64 = Fixed64.toFixed64Param(b);

        if (this.isRaw) {
            this.parseRaw();
        }

        if (bFixed64.isRaw) {
            const parsed = Fixed64.parseNumber(bFixed64.raw);
            bFixed64.high = parsed.high;
            bFixed64.low = parsed.low;
        }

        // Use the passed out parameter, if not provided, create a new Decimal instance.
        if (!out) {
            out = new Fixed64(this);
        } else if (out !== this) {
            // If the passed out is not the current instance, copy the current instance's values to out.
            out.high = this.high;
            out.low = this.low;
            out.isRaw = this.isRaw;
            out.raw = this.raw;
        }

        // First handle the low part
        if (out.low < bFixed64.low) {
            // If the low part is not enough to subtract, borrow from the high part
            out.high -= 1;
            out.low += 0x100000000; // Add 2^32
        }
        out.low -= bFixed64.low;

        // Handle the high part.
        out.high -= bFixed64.high;

        out.high = out.high | 0; // Ensure the high part is a 32-bit signed integer

        return out;
    }

    public mul(b: Fixed64.Value, out?: Fixed64): Fixed64 {
        const bFixed64 = Fixed64.toFixed64Param(b);
        if (Fixed64.isOne(bFixed64)) {
            return out?.set(this) || this;
        }
        if (Fixed64.isZero(bFixed64)) {
            return out?.set(0) || new Fixed64(0);
        }

        Fixed64.prepareInteropParamArray(this, bFixed64);
        Fixed64Module.Fixed64Native.mul();
        return Fixed64.getInteropReturn(0, out);
    }

    public dividedBy(n: Fixed64.Value, out?: Fixed64): Fixed64 {
        const nFixed64 = Fixed64.toFixed64Param(n);
        if (Fixed64.isOne(nFixed64)) {
            return out?.set(this) || this;
        }
        Fixed64.prepareInteropParamArray(this, nFixed64);
        Fixed64Module.Fixed64Native.div();
        return Fixed64.getInteropReturn(0, out);
    }

    /**
     * Note: The value of this.toNumber() should be between Fixed64.MIN_SAFE_INTEGER and Fixed64.MAX_SAFE_INTEGER.
     * If it exceeds this range, the underlying dividend overflows, resulting in unpredictable outcomes.
     * 
     * Dividing any number by 0 (n.div(0)) yields Infinity (if n is positive) or NegInfinity (if n is negative),
     * reflecting the mathematical concept of infinity, where any non-zero quantity divided by zero tends towards infinite or infinitely small.
     */
    public div(n: Fixed64.Value, out?: Fixed64): Fixed64 {
        return this.dividedBy(n, out);
    }

    public mod(b: Fixed64.Value, out?: Fixed64): Fixed64 {
        const bFixed64 = Fixed64.toFixed64Param(b);
        Fixed64.prepareInteropParamArray(this, bFixed64);
        Fixed64Module.Fixed64Native.mod();
        return Fixed64.getInteropReturn(0, out);
    }

    public negated(): Fixed64 {
        return new Fixed64(0).sub(this);
    }

    public neg(): Fixed64 {
        return this.negated();
    }

    public square(out?: Fixed64): Fixed64 {
        Fixed64.prepareInteropParamArray(this);
        Fixed64Module.Fixed64Native.square();
        return Fixed64.getInteropReturn(0, out);
    }

    /**
     * Calculates 2 raised to the power of n.
     * This method is equivalent to Math.pow(2, n).
     */
    public pow2(out?: Fixed64): Fixed64 {
        Fixed64.prepareInteropParamArray(this);
        Fixed64Module.Fixed64Native.pow2();
        return Fixed64.getInteropReturn(0, out);
    }

    public static sqrt(a: Fixed64.Value, out?: Fixed64): Fixed64 {
        const aFixed64 = Fixed64.toFixed64Param(a);
        Fixed64.prepareInteropParamArray(aFixed64);
        Fixed64Module.Fixed64Native.sqrt();
        return Fixed64.getInteropReturn(0, out);
    }

    public sqrt(out?: Fixed64): Fixed64 {
        Fixed64.prepareInteropParamArray(this);
        Fixed64Module.Fixed64Native.sqrt();
        return Fixed64.getInteropReturn(0, out);
    }

    // Comparison Operations
    public cmp(b: Fixed64.Value): number {
        const bFixed64 = Fixed64.toFixed64Param(b);
        if (this.isRaw) {
            this.parseRaw();
        }

        if (bFixed64.isRaw) {
            const parsed = Fixed64.parseNumber(bFixed64.raw);
            bFixed64.high = parsed.high;
            bFixed64.low = parsed.low;
        }

        if (this.high < bFixed64.high || (this.high === bFixed64.high && this.low < bFixed64.low)) {
            return -1;
        } else if (this.high === bFixed64.high && this.low === bFixed64.low) {
            return 0;
        } else {
            return 1;
        }
    }

    public equals(n: Fixed64.Value): boolean {
        return this.cmp(n) === 0;
    }

    public greaterThan(n: Fixed64.Value): boolean {
        return this.cmp(n) > 0;
    }

    public greaterThanOrEqualTo(n: Fixed64.Value): boolean {
        return this.cmp(n) >= 0;
    }

    public lessThan(n: Fixed64.Value): boolean {
        return this.cmp(n) < 0;
    }

    public lessThanOrEqualTo(n: Fixed64.Value): boolean {
        return this.cmp(n) <= 0;
    }

    // Unary Operations
    public absoluteValue(): Fixed64 {
        if (this.lt(0)) {
            return this.negated();
        }

        return this;
    }

    public abs(): Fixed64 {
        return this.absoluteValue();
    }

    public static ceil(a: Fixed64.Value, out?: Fixed64): Fixed64 {
        const aFixed64 = Fixed64.toFixed64Param(a);
        Fixed64.prepareInteropParamArray(aFixed64);
        Fixed64Module.Fixed64Native.ceil();
        return Fixed64.getInteropReturn(0, out);
    }

    public ceil(out?: Fixed64): Fixed64 {
        Fixed64.prepareInteropParamArray(this);
        Fixed64Module.Fixed64Native.ceil();
        return Fixed64.getInteropReturn(0, out);
    }

    public static floor(a: Fixed64.Value, out?: Fixed64): Fixed64 {
        const aFixed64 = Fixed64.toFixed64Param(a);
        Fixed64.prepareInteropParamArray(aFixed64);
        Fixed64Module.Fixed64Native.floor();
        return Fixed64.getInteropReturn(0, out);
    }

    public floor(out?: Fixed64): Fixed64 {
        Fixed64.prepareInteropParamArray(this);
        Fixed64Module.Fixed64Native.floor();
        return Fixed64.getInteropReturn(0, out);
    }

    public static round(a: Fixed64.Value, out?: Fixed64): Fixed64 {
        const aFixed64 = Fixed64.toFixed64Param(a);
        Fixed64.prepareInteropParamArray(aFixed64);
        Fixed64Module.Fixed64Native.round();
        return Fixed64.getInteropReturn(0, out);
    }

    public round(out?: Fixed64): Fixed64 {
        Fixed64.prepareInteropParamArray(this);
        Fixed64Module.Fixed64Native.round();
        return Fixed64.getInteropReturn(0, out);
    }

    // Static Math Functions
    // Cosine
    public static cos(a: Fixed64.Value, out?: Fixed64): Fixed64 {
        const aFixed64 = Fixed64.toFixed64Param(a);
        Fixed64.prepareInteropParamArray(aFixed64);
        Fixed64Module.Fixed64Native.cos();
        return Fixed64.getInteropReturn(0, out);
    }

    // Sine
    public static sin(a: Fixed64.Value, out?: Fixed64): Fixed64 {
        const aFixed64 = Fixed64.toFixed64Param(a);
        Fixed64.prepareInteropParamArray(aFixed64);
        Fixed64Module.Fixed64Native.sin();
        return Fixed64.getInteropReturn(0, out);
    }

    // Tangent
    public static tan(a: Fixed64.Value, out?: Fixed64): Fixed64 {
        const aFixed64 = Fixed64.toFixed64Param(a);
        Fixed64.prepareInteropParamArray(aFixed64);
        Fixed64Module.Fixed64Native.tan();
        return Fixed64.getInteropReturn(0, out);
    }

    // Inverse Cosine
    public static acos(a: Fixed64.Value, out?: Fixed64): Fixed64 {
        const aFixed64 = Fixed64.toFixed64Param(a);
        Fixed64.prepareInteropParamArray(aFixed64);
        Fixed64Module.Fixed64Native.acos();
        return Fixed64.getInteropReturn(0, out);
    }

    // Inverse Sine
    public static asin(a: Fixed64.Value, out?: Fixed64): Fixed64 {
        const aFixed64 = Fixed64.toFixed64Param(a);
        Fixed64.prepareInteropParamArray(aFixed64);
        Fixed64Module.Fixed64Native.asin();
        return Fixed64.getInteropReturn(0, out);
    }

    // Inverse Tangent
    public static atan(a: Fixed64.Value, out?: Fixed64): Fixed64 {
        const aFixed64 = Fixed64.toFixed64Param(a);
        Fixed64.prepareInteropParamArray(aFixed64);
        Fixed64Module.Fixed64Native.atan();
        return Fixed64.getInteropReturn(0, out);
    }

    // Inverse Tangent of y/x
    public static atan2(y: Fixed64.Value, x: Fixed64.Value, out?: Fixed64): Fixed64 {
        const yFixed64 = Fixed64.toFixed64Param(y);
        const xFixed64 = Fixed64.toFixed64Param(x);
        Fixed64.prepareInteropParamArray(yFixed64, xFixed64);
        Fixed64Module.Fixed64Native.atan2();
        return Fixed64.getInteropReturn(0, out);
    }

    public static clamp(a: Fixed64.Value, min: Fixed64.Value, max: Fixed64.Value, out?: Fixed64): Fixed64 {
        if (!out) {
            out = new Fixed64(a);
        }
        else {
            out.set(a);
        }

        if (out.lt(min)) {
            out.set(min);
        } else if (out.gt(max)) {
            out.set(max);
        }

        return out;
    }

    // Aggregate Operations, args up to 16
    // Maximum
    public static max(...args: Fixed64.Value[]): Fixed64 {
        Fixed64.prepareInteropParamArray(...args.map(arg => Fixed64.toFixed64Param(arg)));
        Fixed64Module.Fixed64Native.max(args.length);
        return Fixed64.getInteropReturn(0);
    }

    // Minimum
    public static min(...args: Fixed64.Value[]): Fixed64 {
        Fixed64.prepareInteropParamArray(...args.map(arg => Fixed64.toFixed64Param(arg)));
        Fixed64Module.Fixed64Native.min(args.length);
        return Fixed64.getInteropReturn(0);
    }

    // Sum
    public static sum(...args: Fixed64.Value[]): Fixed64 {
        Fixed64.prepareInteropParamArray(...args.map(arg => Fixed64.toFixed64Param(arg)));
        Fixed64Module.Fixed64Native.sum(args.length);
        return Fixed64.getInteropReturn(0);
    }

    // Is Integer
    public isInteger(): boolean {
        if (this.isRaw) {
            return Number.isInteger(this.raw);
        }
        else {
            return this.low % Fixed64.ONE === 0;
        }
    }

    /** 
    * - Fixed64.NaN's characteristics are: isNaN() returns true, isInfinity() returns false, isFinite() returns false.
    * - Fixed64.Infinity and Decimal.NegInfinity's characteristics are: isNaN() returns false, isInfinity() returns true, isFinite() returns false.
    */
    public isFinite(): boolean {
        Fixed64.prepareInteropParamArray(this);
        return Fixed64Module.Fixed64Native.isFinite();
    }

    /** 
    * - Fixed64.NaN's characteristics are: isNaN() returns true, isInfinity() returns false, isFinite() returns false.
    * - Fixed64.Infinity and Decimal.NegInfinity's characteristics are: isNaN() returns false, isInfinity() returns true, isFinite() returns false.
    */
    public isNaN(): boolean {
        Fixed64.prepareInteropParamArray(this);
        return Fixed64Module.Fixed64Native.isNaN();
    }

    /** 
    * - Fixed64.NaN's characteristics are: isNaN() returns true, isInfinity() returns false, isFinite() returns false.
    * - Fixed64.Infinity and Decimal.NegInfinity's characteristics are: isNaN() returns false, isInfinity() returns true, isFinite() returns false.
    */
    public isInfinity(): boolean {
        Fixed64.prepareInteropParamArray(this);
        return Fixed64Module.Fixed64Native.isInfinity();
    }

    // Is Zero
    public static isZero(values: Fixed64Param): boolean {
        if (values.isRaw) {
            return values.raw === 0;
        }
        else {
            return values.high === 0 && values.low === 0;
        }
    }

    public isZero(): boolean {
        return Fixed64.isZero(this.values());
    }

    private static isOne(values: Fixed64Param): boolean {
        if (values.isRaw) {
            return values.raw === 1;
        }
        else {
            return values.high === 0 && values.low === Fixed64.ONE;
        }
    }

    public isOne(): boolean {
        return Fixed64.isOne(this.values());
    }

    // Additional Comparison Operations
    public eq(n: Fixed64.Value): boolean {
        return this.equals(n);
    }

    // Greater Than
    public gt(n: Fixed64.Value): boolean {
        return this.greaterThan(n);
    }

    // Greater Than Or Equal To
    public gte(n: Fixed64.Value): boolean {
        return this.greaterThanOrEqualTo(n);
    }

    // Less Than
    public lt(n: Fixed64.Value): boolean {
        return this.lessThan(n);
    }

    // Less Than Or Equal To
    public lte(n: Fixed64.Value): boolean {
        return this.lessThanOrEqualTo(n);
    }

    public sign(): number {
        return this.cmp(0);
    }

    public static sign(n: Fixed64.Value): number {
        return new Fixed64(n).cmp(0);
    }

    public static parseFloat(n: number, out?: Fixed64): Fixed64 {
        Fixed64Module.Fixed64Native.parseFloat(n);
        return Fixed64.getInteropReturn(0, out);
    }

    /**
     * Note: This method performs calculations by converting internal values to native JavaScript numbers, which may lead to inconsistencies in calculation results across different platforms' CPUs.
     * Therefore, it is strictly forbidden to use this method in combat systems where cross-platform result consistency is required.
     * This method is only suitable for scenarios where strict consistency of calculation results is not required, such as peripheral development systems.
     */
    public addAsNumber(n: Fixed64.Value, out?: Fixed64): Fixed64 {
        if (!out) {
            out = new Fixed64(0);
        }
        const nDecimal = new Fixed64(n);
        out.set(this.toNumber() + nDecimal.toNumber());

        return out;
    }

    /**
     * Note: This method performs calculations by converting internal values to native JavaScript numbers, which may lead to inconsistencies in calculation results across different platforms' CPUs.
     * Therefore, it is strictly forbidden to use this method in combat systems where cross-platform result consistency is required.
     * This method is only suitable for scenarios where strict consistency of calculation results is not required, such as peripheral development systems.
     */
    public subAsNumber(n: Fixed64.Value, out?: Fixed64): Fixed64 {
        if (!out) {
            out = new Fixed64(0);
        }
        const nDecimal = new Fixed64(n);
        out.set(this.toNumber() - nDecimal.toNumber());

        return out;
    }

    /**
     * Note: This method performs calculations by converting internal values to native JavaScript numbers, which may lead to inconsistencies in calculation results across different platforms' CPUs.
     * Therefore, it is strictly forbidden to use this method in combat systems where cross-platform result consistency is required.
     * This method is only suitable for scenarios where strict consistency of calculation results is not required, such as peripheral development systems.
     */
    public mulAsNumber(n: Fixed64.Value, out?: Fixed64): Fixed64 {
        if (!out) {
            out = new Fixed64(0);
        }
        const nDecimal = new Fixed64(n);
        out.set(this.toNumber() * nDecimal.toNumber());

        return out;
    }

    /**
     * Note: This method performs calculations by converting internal values to native JavaScript numbers, which may lead to inconsistencies in calculation results across different platforms' CPUs.
     * Therefore, it is strictly forbidden to use this method in combat systems where cross-platform result consistency is required.
     * This method is only suitable for scenarios where strict consistency of calculation results is not required, such as peripheral development systems.
     */
    public divAsNumber(n: Fixed64.Value, out?: Fixed64): Fixed64 {
        if (!out) {
            out = new Fixed64(0);
        }
        const nDecimal = new Fixed64(n);
        out.set(this.toNumber() / nDecimal.toNumber());

        return out;
    }
}
