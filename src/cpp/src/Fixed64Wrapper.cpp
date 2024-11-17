#include "Fixed64Wrapper.h"

#include <emscripten/bind.h>
#include <emscripten/val.h>

#include <algorithm>
#include <cmath>
#include <iomanip>
#include <memory>
#include <random>

#include "Fixed64.h"
#include "FixedMath.h"

using namespace emscripten;
using namespace Skynet;

int getSizeOfFixed64Param() { return sizeof(Fixed64Param); }

emscripten::val getFixed64ParamOffsets()
{
  emscripten::val offsets = emscripten::val::object();
  offsets.set("isRaw", offsetof(Fixed64Param, isRaw));
  offsets.set("raw", offsetof(Fixed64Param, raw));
  offsets.set("high", offsetof(Fixed64Param, high));
  offsets.set("low", offsetof(Fixed64Param, low));
  return offsets;
}

std::string Fixed64Wrapper::testPerformance(const uint32_t testTimes)
{
  auto operands = std::make_unique<std::vector<double>>(testTimes);
  auto fixedOperands = std::make_unique<std::vector<Fixed64>>(testTimes);
  auto fixedOperands2 = std::make_unique<std::vector<Fixed64>>(testTimes);

  std::mt19937_64 rng(std::random_device{}());
  std::uniform_real_distribution<double> dist(-200.0, 200.0);
  for (size_t i = 0; i < testTimes; ++i)
  {
    double op = dist(rng);
    (*operands)[i] = op;
    (*fixedOperands)[i] = Fixed64(op);
  }

  for (size_t i = 0; i < testTimes; ++i)
  {
    double op = dist(rng);
    (*fixedOperands2)[i] = Fixed64(op);
    if ((*fixedOperands2)[i] == 0)
    {
      i--;
    }
  }

  auto intOperands = std::make_unique<std::vector<int64_t>>(testTimes);

  std::uniform_int_distribution<int64_t> intDist(-200, 200);
  for (size_t i = 0; i < testTimes; ++i)
  {
    int64_t opInt = intDist(rng); // 生成一个随机整数
    if (opInt == 0)
    {
      i--;
      continue;
    }
    (*intOperands)[i] = opInt;
  }

  std::stringstream resultStream;

  // Fixed64 add
  Fixed64 result(200.0);
  auto start = std::chrono::high_resolution_clock::now();
  for (const auto &fixedOp : *fixedOperands)
  {
    result = result + fixedOp;
    result = FixedMath::Clamp(result, -200, 200);
  }
  auto end = std::chrono::high_resolution_clock::now();
  std::chrono::duration<double, std::milli> addDuration = end - start;
  resultStream << "Fixed64 add result:" << static_cast<double>(result)
               << ", Time: " << addDuration.count() << " ms\n";

  // Fixed64 sub
  result = Fixed64(200.0);
  start = std::chrono::high_resolution_clock::now();
  for (const auto &fixedOp : *fixedOperands)
  {
    result = result - fixedOp;
    result = FixedMath::Clamp(result, -200, 200);
  }
  end = std::chrono::high_resolution_clock::now();
  std::chrono::duration<double, std::milli> subDuration = end - start;
  resultStream << "Fixed64 sub result:" << static_cast<double>(result)
               << ", Time: " << subDuration.count() << " ms\n";

  // Fixed64 mul
  result = Fixed64(200.0);
  start = std::chrono::high_resolution_clock::now();

  for (const auto &fixedOp : *fixedOperands)
  {
    result = result * fixedOp;
    result = FixedMath::Clamp(result, 2, 200);
  }
  end = std::chrono::high_resolution_clock::now();
  std::chrono::duration<double, std::milli> mulDuration = end - start;
  resultStream << "Fixed64 mul result:" << static_cast<double>(result)
               << ", Time: " << mulDuration.count() << " ms\n";

  // Fixed64 div
  result = Fixed64(200.0);
  start = std::chrono::high_resolution_clock::now();
  for (const auto &fixedOp : *fixedOperands2)
  {
    result = result / fixedOp;
    result = FixedMath::Clamp(result, 2, 200);
  }
  end = std::chrono::high_resolution_clock::now();
  std::chrono::duration<double, std::milli> divDuration = end - start;
  resultStream << "Fixed64 div result:" << static_cast<double>(result)
               << ", Time: " << divDuration.count() << " ms\n";

  // Fixed64 atan2
  start = std::chrono::high_resolution_clock::now();
  result = Fixed64(200.0);
  for (size_t i = 0; i < testTimes; ++i)
  {
    // 使用第二个操作数作为x，保证除数不为0
    result = FixedMath::Atan2(result, fixedOperands2->at(i));
    result = FixedMath::Clamp(result, -200, 200);
  }
  end = std::chrono::high_resolution_clock::now();
  std::chrono::duration<double, std::milli> atan2Duration = end - start;
  resultStream << "Fixed64 atan2 result:" << static_cast<double>(result)
               << ", Time: " << atan2Duration.count() << " ms\n";

  // int64_t tests
  // int64_t add
  int64_t resultInt = 200;
  start = std::chrono::high_resolution_clock::now();
  for (size_t i = 0; i < testTimes; ++i)
  {
    resultInt = resultInt + (*intOperands)[i];
    resultInt = std::clamp(resultInt, (int64_t)-200, (int64_t)200);
  }
  end = std::chrono::high_resolution_clock::now();
  std::chrono::duration<double, std::milli> addIntDuration = end - start;
  resultStream << "int64_t add result:" << resultInt
               << ", Time: " << addIntDuration.count() << " ms\n";

  // int64_t sub
  resultInt = 200;
  start = std::chrono::high_resolution_clock::now();
  for (size_t i = 0; i < testTimes; ++i)
  {
    resultInt = resultInt - (*intOperands)[i];
    resultInt = std::clamp(resultInt, (int64_t)-200, (int64_t)200);
  }
  end = std::chrono::high_resolution_clock::now();
  std::chrono::duration<double, std::milli> subIntDuration = end - start;
  resultStream << "int64_t sub result:" << resultInt
               << ", Time: " << subIntDuration.count() << " ms\n";

  // int64_t mul
  resultInt = 3;
  start = std::chrono::high_resolution_clock::now();
  for (size_t i = 0; i < testTimes; ++i)
  {
    resultInt = resultInt * (*intOperands)[i];
    resultInt = std::clamp(resultInt, (int64_t)2, (int64_t)200);
  }
  end = std::chrono::high_resolution_clock::now();
  std::chrono::duration<double, std::milli> mulIntDuration = end - start;
  resultStream << "int64_t mul result:" << resultInt
               << ", Time: " << mulIntDuration.count() << " ms\n";

  // int64_t div
  resultInt = INT64_MAX;
  start = std::chrono::high_resolution_clock::now();
  for (size_t i = 0; i < testTimes; ++i)
  {
    resultInt = resultInt / (*intOperands)[i];
    resultInt = std::clamp(resultInt, (int64_t)2, (int64_t)200);
  }
  end = std::chrono::high_resolution_clock::now();
  std::chrono::duration<double, std::milli> divIntDuration = end - start;
  resultStream << "int64_t div result:" << resultInt
               << ", Time: " << divIntDuration.count() << " ms\n";

  return resultStream.str();
}

EMSCRIPTEN_BINDINGS(decimal_module)
{
  value_object<Fixed64Param>("Fixed64Param")
      .field("isRaw", &Fixed64Param::isRaw)
      .field("raw", &Fixed64Param::raw)
      .field("high", &Fixed64Param::high)
      .field("low", &Fixed64Param::low);

  function("getSizeOfFixed64Param", &getSizeOfFixed64Param);
  function("getFixed64ParamOffsets", &getFixed64ParamOffsets);
  function("getInteropParamArrayAddress", &getInteropParamArrayAddress,
           allow_raw_pointers());
  function("getInteropReturnArrayAddress", &getInteropReturnArrayAddress,
           allow_raw_pointers());
  function("getInteropReturnUint32ArrayAddress",
           &getInteropReturnUint32ArrayAddress, allow_raw_pointers());
  function("getInteropUint32ParamArrayAddress",
           &getInteropUint32ParamArrayAddress, allow_raw_pointers());

  class_<Fixed64Wrapper>("Fixed64Wrapper")
      .class_function("parseFloat", &Fixed64Wrapper::parseFloat)
      .class_function("div", &Fixed64Wrapper::div)
      .class_function("toNumber", &Fixed64Wrapper::toNumber)
      .class_function("toString", &Fixed64Wrapper::toString)
      .class_function("abs", &Fixed64Wrapper::abs)
      .class_function("acos", &Fixed64Wrapper::acos)
      .class_function("add", &Fixed64Wrapper::add)
      .class_function("asin", &Fixed64Wrapper::asin)
      .class_function("atan", &Fixed64Wrapper::atan)
      .class_function("atan2", &Fixed64Wrapper::atan2)
      .class_function("ceil", &Fixed64Wrapper::ceil)
      .class_function("clamp", &Fixed64Wrapper::clamp)
      .class_function("cos", &Fixed64Wrapper::cos)
      .class_function("exp", &Fixed64Wrapper::exp)
      .class_function("floor", &Fixed64Wrapper::floor)
      .class_function("mod", &Fixed64Wrapper::mod)
      .class_function("mul", &Fixed64Wrapper::mul)
      .class_function("square", &Fixed64Wrapper::square)
      .class_function("pow2", &Fixed64Wrapper::pow2)
      .class_function("round", &Fixed64Wrapper::round)
      .class_function("sign", &Fixed64Wrapper::sign)
      .class_function("sin", &Fixed64Wrapper::sin)
      .class_function("sqrt", &Fixed64Wrapper::sqrt)
      .class_function("sub", &Fixed64Wrapper::sub)
      .class_function("tan", &Fixed64Wrapper::tan)
      .class_function("neg", &Fixed64Wrapper::neg)
      .class_function("isNaN", &Fixed64Wrapper::isNaN)
      .class_function("isInfinity", &Fixed64Wrapper::isInfinity)
      .class_function("isFinite", &Fixed64Wrapper::isFinite)
      .class_function("isInteger", &Fixed64Wrapper::isInteger)
      .class_function("isNegative", &Fixed64Wrapper::isNegative)
      .class_function("isPositive", &Fixed64Wrapper::isPositive)
      .class_function("isZero", &Fixed64Wrapper::isZero)
      .class_function("gt", &Fixed64Wrapper::gt)
      .class_function("gte", &Fixed64Wrapper::gte)
      .class_function("lt", &Fixed64Wrapper::lt)
      .class_function("lte", &Fixed64Wrapper::lte)
      .class_function("eq", &Fixed64Wrapper::eq)
      .class_function("cmp", &Fixed64Wrapper::cmp)
      .class_function("min", &Fixed64Wrapper::min)
      .class_function("max", &Fixed64Wrapper::max)
      .class_function("sum", &Fixed64Wrapper::sum)
      .class_function("testPerformance", &Fixed64Wrapper::testPerformance)
      .class_function("emptyCall", &Fixed64Wrapper::emptyCall);
}