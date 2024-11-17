#pragma once
#include <array>

// 对于C风格数组
template <typename T, size_t N>
constexpr size_t ArraySize(T (&)[N]) {
  return N;
}

// 对于std::array
template <typename T, size_t N>
constexpr size_t ArraySize(const std::array<T, N>&) {
  return N;
}