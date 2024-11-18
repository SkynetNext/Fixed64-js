"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fixed64 = void 0;
/* eslint-disable */
// Fixed64.ts
var Fixed64WasmLoader_1 = require("./Fixed64WasmLoader");
var tempHighLow = { high: 0, low: 0 };
var tempFixed64Array = Array.from({ length: 16 }, function () { return ({ isRaw: false, raw: 0, high: 0, low: 0 }); });
var tempFixed64ArrayOffset = 0;
var Fixed64 = /** @class */ (function () {
    /**
     * Creates a new Decimal instance.
     *
     *  value - The value to create the Decimal instance from, can be a `string`, `number`, `Fixed64`, or an object with an optional `x` property.
     *      * - `new Fixed64(1.1)` creates a Decimal instance from a number.
     * - `new Fixed64('-0.5')` creates a Decimal instance from a string.
     * Note: When creating a Decimal instance from a `Number` type's special values (`NaN`, `Infinity`, `-Infinity`), the result will be `new Fixed64(0)`.
     */
    function Fixed64(value) {
        this.isRaw = true;
        this.raw = 0;
        this.high = 0;
        this.low = 0;
        this.set(value);
    }
    /**
     * Sets the value of the Decimal instance.
     *
     *  value - Can be a `string`, `number`, `Fixed64`, or an object containing an `x` attribute.
     *
     * Warning: Avoid using this method to modify values, to prevent affecting other references, use only for local caching.
     */
    Fixed64.prototype.set = function (value) {
        if (value === this) {
            return this;
        }
        this.isRaw = true;
        if (typeof value === 'number') {
            this.raw = value;
        }
        else if (value instanceof Fixed64) {
            this.isRaw = value.isRaw;
            this.raw = value.raw;
            this.high = value.high;
            this.low = value.low;
        }
        else if (typeof value === 'string') {
            this.raw = value === '' ? 0 : parseFloat(value);
        }
        else if (typeof value === 'object' && value !== null) {
            var xValue = value.x;
            if (xValue === undefined || xValue === '') {
                this.raw = 0;
            }
            else if (typeof xValue === 'string') {
                this.raw = parseFloat(xValue);
            }
            else {
                throw new Error('Invalid input type for Fixed64 constructor: object.x must be a string');
            }
        }
        else if (value === false || value === null || value === undefined) {
            this.raw = 0;
        }
        else if (value === true) {
            this.raw = 1;
        }
        else {
            var getTypeName = function (val) {
                if (typeof val === 'object' || typeof val === 'function') {
                    return Object.prototype.toString.call(val).slice(8, -1);
                }
                return typeof val;
            };
            throw new Error("Invalid input type for Fixed64 constructor: ".concat(getTypeName(value)));
        }
        return this;
    };
    Fixed64.prototype.clone = function () {
        return new Fixed64(this);
    };
    Fixed64.createFromHighLow = function (high, low) {
        var d = new Fixed64(0);
        d.isRaw = false;
        d.raw = 0;
        d.high = high;
        d.low = low;
        return d;
    };
    // Bridging C++ interface
    Fixed64.prototype.values = function () {
        var result = tempFixed64Array[tempFixed64ArrayOffset];
        tempFixed64ArrayOffset = (tempFixed64ArrayOffset + 1) % tempFixed64Array.length;
        result.isRaw = this.isRaw;
        result.raw = this.raw;
        result.high = this.high;
        result.low = this.low;
        return result;
    };
    Fixed64.toFixed64Param = function (a) {
        if (a instanceof Fixed64) {
            return a.values();
        }
        else if (typeof a === 'number') {
            var result = tempFixed64Array[tempFixed64ArrayOffset];
            tempFixed64ArrayOffset = (tempFixed64ArrayOffset + 1) % tempFixed64Array.length;
            result.isRaw = true;
            result.raw = a;
            result.high = 0;
            result.low = 0;
            return result;
        }
        else {
            return new Fixed64(a).values();
        }
    };
    Fixed64.prepareInteropParamArray = function () {
        var decimals = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            decimals[_i] = arguments[_i];
        }
        function setInteropParam(index, value) {
            var offset = index * Fixed64WasmLoader_1.sizeOfFixed64Param;
            var address = Fixed64WasmLoader_1.interopParamArrayAddress + offset;
            // Update boolean value
            Fixed64WasmLoader_1.Fixed64Module.HEAP32[(address + Fixed64WasmLoader_1.fixed64ParamOffsets.isRaw) >> 2] = value.isRaw ? 1 : 0;
            if (value.isRaw) {
                // Update double-precision floating-point number
                Fixed64WasmLoader_1.Fixed64Module.HEAPF64[(address + Fixed64WasmLoader_1.fixed64ParamOffsets.raw) >> 3] = value.raw;
            }
            else {
                // Update integer
                Fixed64WasmLoader_1.Fixed64Module.HEAP32[(address + Fixed64WasmLoader_1.fixed64ParamOffsets.high) >> 2] = value.high;
                Fixed64WasmLoader_1.Fixed64Module.HEAPU32[(address + Fixed64WasmLoader_1.fixed64ParamOffsets.low) >> 2] = value.low;
            }
        }
        for (var index = 0; index < decimals.length; index++) {
            var decimal = decimals[index];
            if (decimal instanceof Fixed64) {
                setInteropParam(index, decimal.values());
            }
            else {
                setInteropParam(index, decimal);
            }
        }
    };
    Fixed64.prepareInteropParamUint32Array = function (params) {
        for (var index = 0; index < params.length; index++) {
            var valueAddress = Fixed64WasmLoader_1.interopParamUint32ArrayAddress + index * 4;
            Fixed64WasmLoader_1.Fixed64Module.HEAPU32[valueAddress >> 2] = params[index];
        }
    };
    Fixed64.getInteropReturn = function (index, out) {
        var offset = index * Fixed64WasmLoader_1.sizeOfFixed64Param;
        var address = Fixed64WasmLoader_1.interopReturnArrayAddress + offset;
        // Read integer
        var high = Fixed64WasmLoader_1.Fixed64Module.HEAP32[(address + Fixed64WasmLoader_1.fixed64ParamOffsets.high) >> 2];
        var low = Fixed64WasmLoader_1.Fixed64Module.HEAPU32[(address + Fixed64WasmLoader_1.fixed64ParamOffsets.low) >> 2];
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
    };
    Fixed64.getInteropReturnUint32ArrayLength = function () {
        var length = Fixed64WasmLoader_1.Fixed64Module.HEAPU32[Fixed64WasmLoader_1.interopReturnUint32ArrayAddress >> 2];
        return length;
    };
    Fixed64.getInteropReturnUint32ArrayValue = function (index) {
        var offset = (1 + index) * 4;
        var valueAddress = Fixed64WasmLoader_1.interopReturnUint32ArrayAddress + offset;
        var value = Fixed64WasmLoader_1.Fixed64Module.HEAPU32[valueAddress >> 2];
        return value;
    };
    // Utility Functions
    // ToNumber
    Fixed64.prototype.toNumberSafe = function () {
        if (this.isRaw) {
            return this.raw;
        }
        Fixed64.prepareInteropParamArray(this);
        return Fixed64WasmLoader_1.Fixed64Module.Fixed64Native.toNumber();
    };
    Object.defineProperty(Fixed64.prototype, "highLow", {
        get: function () {
            return [this.high, this.low];
        },
        enumerable: false,
        configurable: true
    });
    Fixed64.prototype.toJSON = function () {
        if (this.isRaw) {
            return this.raw;
        }
        else {
            return [this.high, this.low];
        }
    };
    Fixed64.fromJSON = function (json) {
        if (Array.isArray(json)) {
            return Fixed64.createFromHighLow(json[0], json[1]);
        }
        else {
            return new Fixed64(json);
        }
    };
    /**
       * When using the toNumber() method to convert Fixed64.Infinity, Decimal.NegInfinity, and Fixed64.NaN into numbers,
       * the results are respectively 140737488355328, -140737488355328, and -140737488355328.
       * These conversion results should be considered invalid or meaningless.
       * Thus, only when the result of the toNumber() method is within the range of [-140737488355328, 140737488355328],
       * it can be considered meaningful.
       **/
    Fixed64.prototype.toNumber = function () {
        if (this.isRaw) {
            return this.raw;
        }
        var num = this.low / Fixed64.ONE;
        if (this.high !== 0) {
            num += this.high * Fixed64.ONE;
        }
        return num;
    };
    Fixed64.prototype.parseRaw = function () {
        if (this.isRaw) {
            var parsed = Fixed64.parseNumber(this.raw);
            this.high = parsed.high;
            this.low = parsed.low;
            this.isRaw = false;
        }
        return this;
    };
    Fixed64.parseNumber = function (value) {
        if (value === 0) {
            tempHighLow.high = 0;
            tempHighLow.low = 0;
            return tempHighLow;
        }
        var integerPart = Math.floor(value);
        var fractionalPart = value - integerPart;
        tempHighLow.high = integerPart >> 16;
        tempHighLow.low = ((integerPart & 0xffff) << 16) + (fractionalPart * Fixed64.ONE) >>> 0;
        return tempHighLow;
    };
    Fixed64.prototype.toString = function () {
        return this.toNumber().toString();
    };
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
    Fixed64.prototype.add = function (b, out) {
        var bFixed64 = Fixed64.toFixed64Param(b);
        if (this.isRaw) {
            this.parseRaw();
        }
        if (bFixed64.isRaw) {
            var parsed = Fixed64.parseNumber(bFixed64.raw);
            bFixed64.high = parsed.high;
            bFixed64.low = parsed.low;
        }
        // Use the passed out parameter, if not provided, create a new Decimal instance.
        if (!out) {
            out = new Fixed64(this);
        }
        else if (out !== this) {
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
        out.high = out.high | 0; // Ensure the high part is a 32-bit signed integer
        return out;
    };
    Fixed64.prototype.sub = function (b, out) {
        var bFixed64 = Fixed64.toFixed64Param(b);
        if (this.isRaw) {
            this.parseRaw();
        }
        if (bFixed64.isRaw) {
            var parsed = Fixed64.parseNumber(bFixed64.raw);
            bFixed64.high = parsed.high;
            bFixed64.low = parsed.low;
        }
        // Use the passed out parameter, if not provided, create a new Decimal instance.
        if (!out) {
            out = new Fixed64(this);
        }
        else if (out !== this) {
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
    };
    Fixed64.prototype.mul = function (b, out) {
        var bFixed64 = Fixed64.toFixed64Param(b);
        if (Fixed64.isOne(bFixed64)) {
            return (out === null || out === void 0 ? void 0 : out.set(this)) || this;
        }
        if (Fixed64.isZero(bFixed64)) {
            return (out === null || out === void 0 ? void 0 : out.set(0)) || new Fixed64(0);
        }
        Fixed64.prepareInteropParamArray(this, bFixed64);
        Fixed64WasmLoader_1.Fixed64Module.Fixed64Native.mul();
        return Fixed64.getInteropReturn(0, out);
    };
    Fixed64.prototype.dividedBy = function (n, out) {
        var nFixed64 = Fixed64.toFixed64Param(n);
        if (Fixed64.isOne(nFixed64)) {
            return (out === null || out === void 0 ? void 0 : out.set(this)) || this;
        }
        Fixed64.prepareInteropParamArray(this, nFixed64);
        Fixed64WasmLoader_1.Fixed64Module.Fixed64Native.div();
        return Fixed64.getInteropReturn(0, out);
    };
    /**
     * Note: The value of this.toNumber() should be between Fixed64.MIN_SAFE_INTEGER and Fixed64.MAX_SAFE_INTEGER.
     * If it exceeds this range, the underlying dividend overflows, resulting in unpredictable outcomes.
     *
     * Dividing any number by 0 (n.div(0)) yields Infinity (if n is positive) or NegInfinity (if n is negative),
     * reflecting the mathematical concept of infinity, where any non-zero quantity divided by zero tends towards infinite or infinitely small.
     */
    Fixed64.prototype.div = function (n, out) {
        return this.dividedBy(n, out);
    };
    Fixed64.prototype.mod = function (b, out) {
        var bFixed64 = Fixed64.toFixed64Param(b);
        Fixed64.prepareInteropParamArray(this, bFixed64);
        Fixed64WasmLoader_1.Fixed64Module.Fixed64Native.mod();
        return Fixed64.getInteropReturn(0, out);
    };
    Fixed64.prototype.negated = function () {
        return new Fixed64(0).sub(this);
    };
    Fixed64.prototype.neg = function () {
        return this.negated();
    };
    Fixed64.prototype.square = function (out) {
        Fixed64.prepareInteropParamArray(this);
        Fixed64WasmLoader_1.Fixed64Module.Fixed64Native.square();
        return Fixed64.getInteropReturn(0, out);
    };
    /**
     * Calculates 2 raised to the power of n.
     * This method is equivalent to Math.pow(2, n).
     */
    Fixed64.prototype.pow2 = function (out) {
        Fixed64.prepareInteropParamArray(this);
        Fixed64WasmLoader_1.Fixed64Module.Fixed64Native.pow2();
        return Fixed64.getInteropReturn(0, out);
    };
    Fixed64.sqrt = function (a, out) {
        var aFixed64 = Fixed64.toFixed64Param(a);
        Fixed64.prepareInteropParamArray(aFixed64);
        Fixed64WasmLoader_1.Fixed64Module.Fixed64Native.sqrt();
        return Fixed64.getInteropReturn(0, out);
    };
    Fixed64.prototype.sqrt = function (out) {
        Fixed64.prepareInteropParamArray(this);
        Fixed64WasmLoader_1.Fixed64Module.Fixed64Native.sqrt();
        return Fixed64.getInteropReturn(0, out);
    };
    // Comparison Operations
    Fixed64.prototype.cmp = function (b) {
        var bFixed64 = Fixed64.toFixed64Param(b);
        if (this.isRaw) {
            this.parseRaw();
        }
        if (bFixed64.isRaw) {
            var parsed = Fixed64.parseNumber(bFixed64.raw);
            bFixed64.high = parsed.high;
            bFixed64.low = parsed.low;
        }
        if (this.high < bFixed64.high || (this.high === bFixed64.high && this.low < bFixed64.low)) {
            return -1;
        }
        else if (this.high === bFixed64.high && this.low === bFixed64.low) {
            return 0;
        }
        else {
            return 1;
        }
    };
    Fixed64.prototype.equals = function (n) {
        return this.cmp(n) === 0;
    };
    Fixed64.prototype.greaterThan = function (n) {
        return this.cmp(n) > 0;
    };
    Fixed64.prototype.greaterThanOrEqualTo = function (n) {
        return this.cmp(n) >= 0;
    };
    Fixed64.prototype.lessThan = function (n) {
        return this.cmp(n) < 0;
    };
    Fixed64.prototype.lessThanOrEqualTo = function (n) {
        return this.cmp(n) <= 0;
    };
    // Unary Operations
    Fixed64.prototype.absoluteValue = function () {
        if (this.lt(0)) {
            return this.negated();
        }
        return this;
    };
    Fixed64.prototype.abs = function () {
        return this.absoluteValue();
    };
    Fixed64.ceil = function (a, out) {
        var aFixed64 = Fixed64.toFixed64Param(a);
        Fixed64.prepareInteropParamArray(aFixed64);
        Fixed64WasmLoader_1.Fixed64Module.Fixed64Native.ceil();
        return Fixed64.getInteropReturn(0, out);
    };
    Fixed64.prototype.ceil = function (out) {
        Fixed64.prepareInteropParamArray(this);
        Fixed64WasmLoader_1.Fixed64Module.Fixed64Native.ceil();
        return Fixed64.getInteropReturn(0, out);
    };
    Fixed64.floor = function (a, out) {
        var aFixed64 = Fixed64.toFixed64Param(a);
        Fixed64.prepareInteropParamArray(aFixed64);
        Fixed64WasmLoader_1.Fixed64Module.Fixed64Native.floor();
        return Fixed64.getInteropReturn(0, out);
    };
    Fixed64.prototype.floor = function (out) {
        Fixed64.prepareInteropParamArray(this);
        Fixed64WasmLoader_1.Fixed64Module.Fixed64Native.floor();
        return Fixed64.getInteropReturn(0, out);
    };
    Fixed64.round = function (a, out) {
        var aFixed64 = Fixed64.toFixed64Param(a);
        Fixed64.prepareInteropParamArray(aFixed64);
        Fixed64WasmLoader_1.Fixed64Module.Fixed64Native.round();
        return Fixed64.getInteropReturn(0, out);
    };
    Fixed64.prototype.round = function (out) {
        Fixed64.prepareInteropParamArray(this);
        Fixed64WasmLoader_1.Fixed64Module.Fixed64Native.round();
        return Fixed64.getInteropReturn(0, out);
    };
    // Static Math Functions
    // Cosine
    Fixed64.cos = function (a, out) {
        var aFixed64 = Fixed64.toFixed64Param(a);
        Fixed64.prepareInteropParamArray(aFixed64);
        Fixed64WasmLoader_1.Fixed64Module.Fixed64Native.cos();
        return Fixed64.getInteropReturn(0, out);
    };
    // Sine
    Fixed64.sin = function (a, out) {
        var aFixed64 = Fixed64.toFixed64Param(a);
        Fixed64.prepareInteropParamArray(aFixed64);
        Fixed64WasmLoader_1.Fixed64Module.Fixed64Native.sin();
        return Fixed64.getInteropReturn(0, out);
    };
    // Tangent
    Fixed64.tan = function (a, out) {
        var aFixed64 = Fixed64.toFixed64Param(a);
        Fixed64.prepareInteropParamArray(aFixed64);
        Fixed64WasmLoader_1.Fixed64Module.Fixed64Native.tan();
        return Fixed64.getInteropReturn(0, out);
    };
    // Inverse Cosine
    Fixed64.acos = function (a, out) {
        var aFixed64 = Fixed64.toFixed64Param(a);
        Fixed64.prepareInteropParamArray(aFixed64);
        Fixed64WasmLoader_1.Fixed64Module.Fixed64Native.acos();
        return Fixed64.getInteropReturn(0, out);
    };
    // Inverse Sine
    Fixed64.asin = function (a, out) {
        var aFixed64 = Fixed64.toFixed64Param(a);
        Fixed64.prepareInteropParamArray(aFixed64);
        Fixed64WasmLoader_1.Fixed64Module.Fixed64Native.asin();
        return Fixed64.getInteropReturn(0, out);
    };
    // Inverse Tangent
    Fixed64.atan = function (a, out) {
        var aFixed64 = Fixed64.toFixed64Param(a);
        Fixed64.prepareInteropParamArray(aFixed64);
        Fixed64WasmLoader_1.Fixed64Module.Fixed64Native.atan();
        return Fixed64.getInteropReturn(0, out);
    };
    // Inverse Tangent of y/x
    Fixed64.atan2 = function (y, x, out) {
        var yFixed64 = Fixed64.toFixed64Param(y);
        var xFixed64 = Fixed64.toFixed64Param(x);
        Fixed64.prepareInteropParamArray(yFixed64, xFixed64);
        Fixed64WasmLoader_1.Fixed64Module.Fixed64Native.atan2();
        return Fixed64.getInteropReturn(0, out);
    };
    Fixed64.clamp = function (a, min, max, out) {
        if (!out) {
            out = new Fixed64(a);
        }
        else {
            out.set(a);
        }
        if (out.lt(min)) {
            out.set(min);
        }
        else if (out.gt(max)) {
            out.set(max);
        }
        return out;
    };
    // Aggregate Operations, args up to 16
    // Maximum
    Fixed64.max = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        Fixed64.prepareInteropParamArray.apply(Fixed64, args.map(function (arg) { return Fixed64.toFixed64Param(arg); }));
        Fixed64WasmLoader_1.Fixed64Module.Fixed64Native.max(args.length);
        return Fixed64.getInteropReturn(0);
    };
    // Minimum
    Fixed64.min = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        Fixed64.prepareInteropParamArray.apply(Fixed64, args.map(function (arg) { return Fixed64.toFixed64Param(arg); }));
        Fixed64WasmLoader_1.Fixed64Module.Fixed64Native.min(args.length);
        return Fixed64.getInteropReturn(0);
    };
    // Sum
    Fixed64.sum = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        Fixed64.prepareInteropParamArray.apply(Fixed64, args.map(function (arg) { return Fixed64.toFixed64Param(arg); }));
        Fixed64WasmLoader_1.Fixed64Module.Fixed64Native.sum(args.length);
        return Fixed64.getInteropReturn(0);
    };
    // Is Integer
    Fixed64.prototype.isInteger = function () {
        if (this.isRaw) {
            return Number.isInteger(this.raw);
        }
        else {
            return this.low % Fixed64.ONE === 0;
        }
    };
    /**
    * - Fixed64.NaN's characteristics are: isNaN() returns true, isInfinity() returns false, isFinite() returns false.
    * - Fixed64.Infinity and Decimal.NegInfinity's characteristics are: isNaN() returns false, isInfinity() returns true, isFinite() returns false.
    */
    Fixed64.prototype.isFinite = function () {
        Fixed64.prepareInteropParamArray(this);
        return Fixed64WasmLoader_1.Fixed64Module.Fixed64Native.isFinite();
    };
    /**
    * - Fixed64.NaN's characteristics are: isNaN() returns true, isInfinity() returns false, isFinite() returns false.
    * - Fixed64.Infinity and Decimal.NegInfinity's characteristics are: isNaN() returns false, isInfinity() returns true, isFinite() returns false.
    */
    Fixed64.prototype.isNaN = function () {
        Fixed64.prepareInteropParamArray(this);
        return Fixed64WasmLoader_1.Fixed64Module.Fixed64Native.isNaN();
    };
    /**
    * - Fixed64.NaN's characteristics are: isNaN() returns true, isInfinity() returns false, isFinite() returns false.
    * - Fixed64.Infinity and Decimal.NegInfinity's characteristics are: isNaN() returns false, isInfinity() returns true, isFinite() returns false.
    */
    Fixed64.prototype.isInfinity = function () {
        Fixed64.prepareInteropParamArray(this);
        return Fixed64WasmLoader_1.Fixed64Module.Fixed64Native.isInfinity();
    };
    // Is Zero
    Fixed64.isZero = function (values) {
        if (values.isRaw) {
            return values.raw === 0;
        }
        else {
            return values.high === 0 && values.low === 0;
        }
    };
    Fixed64.prototype.isZero = function () {
        return Fixed64.isZero(this.values());
    };
    Fixed64.isOne = function (values) {
        if (values.isRaw) {
            return values.raw === 1;
        }
        else {
            return values.high === 0 && values.low === Fixed64.ONE;
        }
    };
    Fixed64.prototype.isOne = function () {
        return Fixed64.isOne(this.values());
    };
    // Additional Comparison Operations
    Fixed64.prototype.eq = function (n) {
        return this.equals(n);
    };
    // Greater Than
    Fixed64.prototype.gt = function (n) {
        return this.greaterThan(n);
    };
    // Greater Than Or Equal To
    Fixed64.prototype.gte = function (n) {
        return this.greaterThanOrEqualTo(n);
    };
    // Less Than
    Fixed64.prototype.lt = function (n) {
        return this.lessThan(n);
    };
    // Less Than Or Equal To
    Fixed64.prototype.lte = function (n) {
        return this.lessThanOrEqualTo(n);
    };
    Fixed64.prototype.sign = function () {
        return this.cmp(0);
    };
    Fixed64.sign = function (n) {
        return new Fixed64(n).cmp(0);
    };
    Fixed64.parseFloat = function (n, out) {
        Fixed64WasmLoader_1.Fixed64Module.Fixed64Native.parseFloat(n);
        return Fixed64.getInteropReturn(0, out);
    };
    /**
     * Note: This method performs calculations by converting internal values to native JavaScript numbers, which may lead to inconsistencies in calculation results across different platforms' CPUs.
     * Therefore, it is strictly forbidden to use this method in combat systems where cross-platform result consistency is required.
     * This method is only suitable for scenarios where strict consistency of calculation results is not required, such as peripheral development systems.
     */
    Fixed64.prototype.addAsNumber = function (n, out) {
        if (!out) {
            out = new Fixed64(0);
        }
        var nDecimal = new Fixed64(n);
        out.set(this.toNumber() + nDecimal.toNumber());
        return out;
    };
    /**
     * Note: This method performs calculations by converting internal values to native JavaScript numbers, which may lead to inconsistencies in calculation results across different platforms' CPUs.
     * Therefore, it is strictly forbidden to use this method in combat systems where cross-platform result consistency is required.
     * This method is only suitable for scenarios where strict consistency of calculation results is not required, such as peripheral development systems.
     */
    Fixed64.prototype.subAsNumber = function (n, out) {
        if (!out) {
            out = new Fixed64(0);
        }
        var nDecimal = new Fixed64(n);
        out.set(this.toNumber() - nDecimal.toNumber());
        return out;
    };
    /**
     * Note: This method performs calculations by converting internal values to native JavaScript numbers, which may lead to inconsistencies in calculation results across different platforms' CPUs.
     * Therefore, it is strictly forbidden to use this method in combat systems where cross-platform result consistency is required.
     * This method is only suitable for scenarios where strict consistency of calculation results is not required, such as peripheral development systems.
     */
    Fixed64.prototype.mulAsNumber = function (n, out) {
        if (!out) {
            out = new Fixed64(0);
        }
        var nDecimal = new Fixed64(n);
        out.set(this.toNumber() * nDecimal.toNumber());
        return out;
    };
    /**
     * Note: This method performs calculations by converting internal values to native JavaScript numbers, which may lead to inconsistencies in calculation results across different platforms' CPUs.
     * Therefore, it is strictly forbidden to use this method in combat systems where cross-platform result consistency is required.
     * This method is only suitable for scenarios where strict consistency of calculation results is not required, such as peripheral development systems.
     */
    Fixed64.prototype.divAsNumber = function (n, out) {
        if (!out) {
            out = new Fixed64(0);
        }
        var nDecimal = new Fixed64(n);
        out.set(this.toNumber() / nDecimal.toNumber());
        return out;
    };
    Fixed64.MAX_SAFE_INTEGER = 2147483647;
    Fixed64.MIN_SAFE_INTEGER = -2147483648;
    Fixed64.EPSILON = Fixed64.createFromHighLow(0, 1);
    Fixed64.NaN = Fixed64.createFromHighLow(-2147483648, 0);
    Fixed64.Infinity = Fixed64.createFromHighLow(0x7FFFFFFF, 0xFFFFFFFF);
    Fixed64.NegInfinity = Fixed64.createFromHighLow(-2147483648, 1);
    Fixed64.ONE = 65536;
    return Fixed64;
}());
exports.Fixed64 = Fixed64;
