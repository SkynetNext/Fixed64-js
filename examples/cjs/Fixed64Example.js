"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Fixed64Example.ts
const Fixed64WasmLoader_cjs_js_1 = require("../../dist/cjs/Fixed64WasmLoader.cjs.js");
const Fixed64_js_1 = require("../../dist/cjs/Fixed64.js");
async function main() {
    // Load the Fixed64 module
    await (0, Fixed64WasmLoader_cjs_js_1.loadFixed64Wasm)().then(() => {
        console.log("=== loadFixed64Wasm:success =========== ");
    }).catch(error => {
        console.error("Error loadFixed64Wasm module:", error);
    });
    // Assuming fixed64 provides methods to directly operate on numbers
    // Note: The actual implementation might need adjustments according to your WASM module's API
    // Initialize two Fixed64 numbers
    const a = new Fixed64_js_1.Fixed64(1.234567);
    const b = new Fixed64_js_1.Fixed64(23.45678);
    // Perform addition
    const sum = a.add(b);
    console.log(`1.234567 + 23.45678 = ${sum.toNumber()}`); // Convert back to a regular JavaScript number for display
    // Perform subtraction
    const difference = a.sub(b);
    console.log(`1.234567 - 23.45678 = ${difference.toNumber()}`);
    // Perform multiplication
    const product = a.mul(b);
    console.log(`1.234567 * 23.45678 = ${product.toNumber()}`);
    // Perform division
    const quotient = a.div(b);
    console.log(`1.234567 / 23.45678 = ${quotient.toNumber()}`);
}
main().catch(console.error);
