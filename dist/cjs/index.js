const Fixed64 = require('./Fixed64.cjs');
const { loadFixed64Wasm } = require('./Fixed64WasmLoader.cjs');

module.exports = {
    ...Fixed64,
    loadFixed64Wasm,
};