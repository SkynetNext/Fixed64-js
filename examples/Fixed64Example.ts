// Fixed64Example.ts
import { loadFixed64Wasm } from '../src/ts/Fixed64WasmLoader';
import { Fixed64 } from '../src/ts/Fixed64';

async function main() {
    // Load the Fixed64 module
    await loadFixed64Wasm();

    // Assuming fixed64 provides methods to directly operate on numbers
    // Note: The actual implementation might need adjustments according to your WASM module's API

    // Initialize two Fixed64 numbers
    const a = new Fixed64(1.234567);
    const b = new Fixed64(23.45678);

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