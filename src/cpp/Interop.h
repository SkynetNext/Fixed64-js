#pragma once

#include <array>
#include <cstddef> // for size_t
#include <iostream>

#include "ArraySize.h"
#include "Fixed64.h"

namespace Skynet
{

  template <typename T, size_t kMaxSize>
  class InteropArray
  {
  public:
    // 注意：实际存储大小为 kMaxSize + 1
    std::array<T, kMaxSize + 1> data;

    T &operator[](size_t index)
    {
      // 如果索引超出范围，返回最后一个元素
      return data[index > kMaxSize ? kMaxSize : index];
    }

    const T &operator[](size_t index) const
    {
      // 如果索引超出范围，返回最后一个元素
      return data[index > kMaxSize ? kMaxSize : index];
    }

    // 获取原始数组
    T *getRawArray() { return data.data(); }

    const T *getRawArray() const { return data.data(); }
  };

  // 特定类型别名
  using InteropParamArray = InteropArray<Skynet::Fixed64Param, 255>;
  using InteropUint32ParamArray = InteropArray<uint32_t, 255>;

  class InteropReturnArray
  {
  public:
    static const size_t kMaxSize = 255;
    static const size_t kMaxFixed64ParamSize = kMaxSize * 2;
    std::array<Skynet::Fixed64Param, kMaxFixed64ParamSize + 1> array;
    std::array<uint32_t, kMaxSize + 1> uarray;

    Skynet::Fixed64Param &operator[](size_t index)
    {
      if (index > kMaxFixed64ParamSize)
        return array[kMaxFixed64ParamSize];
      return array[index];
    }

    void clear() { uarray[0] = 0; }

    void push_back(uint32_t value)
    {
      if (uarray[0] < kMaxSize)
      {
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
  inline InteropUint32ParamArray &getInteropUint32ParamArray()
  {
    return interopUint32ParamArray;
  }

  inline InteropReturnArray &getInteropReturnArray()
  {
    return interopReturnArray;
  }

  // 获取InteropParamArray的内部数组地址
  inline uintptr_t getInteropParamArrayAddress()
  {
    return reinterpret_cast<uintptr_t>(interopParamArray.data.data());
  }

  // 获取InteropReturnArray的内部数组地址
  inline uintptr_t getInteropReturnArrayAddress()
  {
    return reinterpret_cast<uintptr_t>(interopReturnArray.array.data());
  }

  // 获取InteropReturnArray中uarray的地址
  inline uintptr_t getInteropReturnUint32ArrayAddress()
  {
    return reinterpret_cast<uintptr_t>(interopReturnArray.uarray.data());
  }

  inline uintptr_t getInteropUint32ParamArrayAddress()
  {
    return reinterpret_cast<uintptr_t>(interopUint32ParamArray.data.data());
  }
} // namespace Skynet