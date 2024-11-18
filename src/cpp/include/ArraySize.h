#pragma once
#include <array>

// For C-style arrays
template <typename T, size_t N>
constexpr size_t ArraySize(T (&)[N]) {
  return N;
}

// For std::array
template <typename T, size_t N>
constexpr size_t ArraySize(const std::array<T, N>&) {
  return N;
}