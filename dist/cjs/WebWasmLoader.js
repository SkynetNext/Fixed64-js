"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadWasmFileFromWeb = loadWasmFileFromWeb;
// WebWasmLoader.ts
async function loadWasmFileFromWeb(url) {
    console.log("Loading WASM from URL:", url);
    const response = await fetch(url);
    return new Uint8Array(await response.arrayBuffer());
}
