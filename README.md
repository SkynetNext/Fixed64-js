# Fixed64.js

## Overview

**Fixed64** is a high-performance, cross-platform computation library built on top of a C++ WebAssembly (WASM) export using Emscripten (`emcc`). It offers consistent and reliable numerical operations essential for applications requiring precise floating-point arithmetic.

With a performance increase of up to 100 times over traditional libraries such as **bignumber.js** and **decimal.js**, Fixed64 is ideal for usage in compute-intensive applications like financial calculations, scientific computations, and game physics.

## Features

- **High Performance**: Leveraging WebAssembly, Fixed64 executes mathematical operations significantly faster than pure JavaScript libraries.
- **Cross-Platform Consistency**: Works uniformly across different browsers and environments, ensuring accurate and fast computations regardless of the platform.
- **Type Safety**: Typed inputs help prevent runtime errors commonly encountered in JavaScript.

## API Reference

### Basic Mathematical Operations
Fixed64 provides a set of basic mathematical operations accessible through its instance methods:

- **Addition**
  - `add(value: Fixed64 | string | number): Fixed64`
  - Example: `const result = a.add(b);`
  
- **Subtraction**
  - `sub(value: Fixed64 | string | number): Fixed64`
  - Example: `const difference = a.sub(b);`

- **Multiplication**
  - `mul(value: Fixed64 | string | number): Fixed64`
  - Example: `const product = a.mul(b);`

- **Division**
  - `div(value: Fixed64 | string | number): Fixed64`
  - Example: `const quotient = a.div(b);`

### Comparison Operations
The library also supports various comparison operations:

- **Equal**
  - `equals(value: Fixed64 | string | number): boolean`
  - Example: `if (a.equals(b)) { ... }`

- **Greater Than**
  - `greaterThan(value: Fixed64 | string | number): boolean`
  - Example: `const isGreater = a.greaterThan(b);`

- **Less Than**
  - `lessThan(value: Fixed64 | string | number): boolean`
  - Example: `const isLess = a.lessThan(b);`

- **Greater Than or Equal**
  - `greaterThanOrEqualTo(value: Fixed64 | string | number): boolean`
  - Example: `const isGreaterOrEqual = a.greaterThanOrEqualTo(b);`

- **Less Than or Equal**
  - `lessThanOrEqualTo(value: Fixed64 | string | number): boolean`
  - Example: `const isLessOrEqual = a.lessThanOrEqualTo(b);`

### Trigonometric Functions
The Fixed64 library includes trigonometric functions for advanced mathematics:

- **Cosine**
  - `static cos(value: Fixed64 | string | number): Fixed64`
  
- **Sine**
  - `static sin(value: Fixed64 | string | number): Fixed64`

- **Tangent**
  - `static tan(value: Fixed64 | string | number): Fixed64`

### Utility Functions
Additional useful utility functions are available:

- **Maximum**
  - `static max(...values: Array<Fixed64 | string | number>): Fixed64`
  
- **Minimum**
  - `static min(...values: Array<Fixed64 | string | number>): Fixed64`
  
- **Sum**
  - `static sum(...values: Array<Fixed64 | string | number>): Fixed64`

## Installation

To use Fixed64 in your project, follow these steps:

1. **Install the library** (assuming it's published to npm or similar):
   ```bash
   npm install fixed64.js
