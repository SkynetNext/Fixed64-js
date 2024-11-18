#pragma once

#include <array>
#include <cstddef>  // for size_t
#include <iostream>

#include "ArraySize.h"
#include "Fixed64.h"

namespace Skynet {

template <typename T, size_t kMaxSize>
class InteropArray {
 public:
  // Note: Actual storage size is kMaxSize + 1
  std::array<T, kMaxSize + 1> data;

  T &operator[](size_t index) {
    // If index is out of range, return the last element
    return data[index > kMaxSize ? kMaxSize : index];
  }

  const T &operator[](size_t index) const {
    // If index is out of range, return the last element
    return data[index > kMaxSize ? kMaxSize : index];
  }

  // Get the raw array
  T *getRawArray() { return data.data(); }

  const T *getRawArray() const { return data.data(); }
};

// Specific type aliases
using InteropParamArray = InteropArray<Skynet::Fixed64Param, 255>;
using InteropUint32ParamArray = InteropArray<uint32_t, 255>;

class InteropReturnArray {
 public:
  static const size_t kMaxSize = 255;
  static const size_t kMaxFixed64ParamSize = kMaxSize * 2;
  std::array<Skynet::Fixed64Param, kMaxFixed64ParamSize + 1> array;
  std::array<uint32_t, kMaxSize + 1> uarray;

  Skynet::Fixed64Param &operator[](size_t index) {
    if (index > kMaxFixed64ParamSize) return array[kMaxFixed64ParamSize];
    return array[index];
  }

  void clear() { uarray[0] = 0; }

  void push_back(uint32_t value) {
    if (uarray[0] < kMaxSize) {
      uarray[uarray[0] + 1] = value;
      ++uarray[0];
    }
  }

  uint32_t uint32ArrayLen() const { return uarray[0]; }

  bool full() const { return uarray[0] == kMaxSize; }
};

extern InteropParamArray interopParamArray;
extern InteropReturnArray interopReturnArray;
extern InteropUint32ParamArray interopUint32ParamArray;

inline InteropParamArray &getInteropParamArray() { return interopParamArray; }
inline InteropUint32ParamArray &getInteropUint32ParamArray() {
  return interopUint32ParamArray;
}

inline InteropReturnArray &getInteropReturnArray() {
  return interopReturnArray;
}

// Get the internal array address of InteropParamArray
inline uintptr_t getInteropParamArrayAddress() {
  return reinterpret_cast<uintptr_t>(interopParamArray.data.data());
}

// Get the internal array address of InteropReturnArray
inline uintptr_t getInteropReturnArrayAddress() {
  return reinterpret_cast<uintptr_t>(interopReturnArray.array.data());
}

// Get the address of uarray in InteropReturnArray
inline uintptr_t getInteropReturnUint32ArrayAddress() {
  return reinterpret_cast<uintptr_t>(interopReturnArray.uarray.data());
}

inline uintptr_t getInteropUint32ParamArrayAddress() {
  return reinterpret_cast<uintptr_t>(interopUint32ParamArray.data.data());
}
}  // namespace Skynet