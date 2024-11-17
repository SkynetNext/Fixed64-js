#pragma once

#include <cmath>
#include <iomanip>

#include "Fixed64.h"
#include "FixedMath.h"
#include "Interop.h"

namespace Skynet
{
  class Fixed64Wrapper
  {
  public:
    static void parseFloat(double value)
    {
      Fixed64 result = Fixed64(value);
      getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
    }

    static void div()
    {
      Fixed64 fx(getInteropParamArray()[0]);
      Fixed64 fy(getInteropParamArray()[1]);
      auto result = fx / fy;
      getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
    }

    static double toNumber()
    {
      Fixed64 fn(getInteropParamArray()[0]);
      return static_cast<double>(fn);
    }

    static std::string toString()
    {
      Fixed64 fn(getInteropParamArray()[0]);
      return fn.toString();
    }

    static void abs()
    {
      Fixed64 fn(getInteropParamArray()[0]);
      auto result = FixedMath::Abs(fn);
      getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
    }

    static void acos()
    {
      Fixed64 fn(getInteropParamArray()[0]);
      auto result = FixedMath::Acos(fn);
      getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
    }

    static void add()
    {
      Fixed64 fx(getInteropParamArray()[0]);
      Fixed64 fy(getInteropParamArray()[1]);
      auto result = fx + fy;
      getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
    }

    static void asin()
    {
      Fixed64 fn(getInteropParamArray()[0]);
      auto result = FixedMath::Asin(fn);
      getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
    }

    static void atan()
    {
      Fixed64 fn(getInteropParamArray()[0]);
      auto result = FixedMath::Atan(fn);
      getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
    }

    static void atan2()
    {
      Fixed64 fy(getInteropParamArray()[0]);
      Fixed64 fx(getInteropParamArray()[1]);
      auto result = FixedMath::Atan2(fy, fx);
      getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
    }

    static void ceil()
    {
      Fixed64 fn(getInteropParamArray()[0]);
      auto result = FixedMath::Ceil(fn);
      getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
    }

    static void clamp()
    {
      Fixed64 fn(getInteropParamArray()[0]);
      Fixed64 fmin(getInteropParamArray()[1]);
      Fixed64 fmax(getInteropParamArray()[2]);
      auto result = FixedMath::Clamp(fn, fmin, fmax);
      getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
    }

    static void cos()
    {
      Fixed64 fn(getInteropParamArray()[0]);
      auto result = FixedMath::Cos(fn);
      getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
    }

    static void exp()
    {
      Fixed64 fn(getInteropParamArray()[0]);
      auto result = FixedMath::Exp(fn);
      getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
    }

    static void floor()
    {
      Fixed64 fn(getInteropParamArray()[0]);
      auto result = FixedMath::Floor(fn);
      getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
    }

    static void mod()
    {
      Fixed64 fx(getInteropParamArray()[0]);
      Fixed64 fy(getInteropParamArray()[1]);
      auto result = fx % fy;
      getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
    }

    static void mul()
    {
      Fixed64 fx(getInteropParamArray()[0]);
      Fixed64 fy(getInteropParamArray()[1]);
      auto result = fx * fy;
      getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
    }

    static void square()
    {
      Fixed64 fbase(getInteropParamArray()[0]);
      auto result = fbase * fbase;
      getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
    }

    static void pow2()
    {
      Fixed64 exponent(getInteropParamArray()[0]);
      auto result = FixedMath::Pow2(exponent);
      getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
    }

    static void round()
    {
      Fixed64 fn(getInteropParamArray()[0]);
      auto result = FixedMath::Round(fn);
      getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
    }

    static void sign()
    {
      Fixed64 fn(getInteropParamArray()[0]);
      auto result = FixedMath::Sign(fn);
      getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
    }

    static void sin()
    {
      Fixed64 fn(getInteropParamArray()[0]);
      auto result = FixedMath::Sin(fn);
      getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
    }

    static void sqrt()
    {
      Fixed64 fn(getInteropParamArray()[0]);
      auto result = FixedMath::Sqrt(fn);
      getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
    }

    static void sub()
    {
      Fixed64 fx(getInteropParamArray()[0]);
      Fixed64 fy(getInteropParamArray()[1]);
      auto result = fx - fy;
      getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
    }

    static void tan()
    {
      Fixed64 fn(getInteropParamArray()[0]);
      auto result = FixedMath::Tan(fn);
      getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
    }

    static void neg()
    {
      Fixed64 fn(getInteropParamArray()[0]);
      auto result = -fn;
      getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
    }

    static bool isNaN()
    {
      Fixed64 fn(getInteropParamArray()[0]);
      return Fixed64::IsNaN(fn);
    }

    static bool isInfinity()
    {
      Fixed64 fn(getInteropParamArray()[0]);
      return Fixed64::IsInfinity(fn);
    }

    static bool isFinite()
    {
      Fixed64 fn(getInteropParamArray()[0]);
      return !Fixed64::IsNaN(fn) && !Fixed64::IsInfinity(fn);
    }

    static bool isInteger()
    {
      Fixed64 fn(getInteropParamArray()[0]);
      return fn.isInteger();
    }

    static bool isNegative()
    {
      Fixed64 fn(getInteropParamArray()[0]);
      return fn.value < 0;
    }

    static bool isPositive()
    {
      Fixed64 fn(getInteropParamArray()[0]);
      return fn.value > 0;
    }

    static bool isZero()
    {
      Fixed64 fn(getInteropParamArray()[0]);
      return fn.value == 0;
    }

    static bool gt()
    {
      Fixed64 fx(getInteropParamArray()[0]);
      Fixed64 fy(getInteropParamArray()[1]);
      return fx > fy;
    }

    static bool gte()
    {
      Fixed64 fx(getInteropParamArray()[0]);
      Fixed64 fy(getInteropParamArray()[1]);
      return fx >= fy;
    }

    static bool lt()
    {
      Fixed64 fx(getInteropParamArray()[0]);
      Fixed64 fy(getInteropParamArray()[1]);
      return fx < fy;
    }

    static bool lte()
    {
      Fixed64 fx(getInteropParamArray()[0]);
      Fixed64 fy(getInteropParamArray()[1]);
      return fx <= fy;
    }

    static bool eq()
    {
      Fixed64 fx(getInteropParamArray()[0]);
      Fixed64 fy(getInteropParamArray()[1]);
      return fx == fy;
    }

    static int cmp()
    {
      Fixed64 fx(getInteropParamArray()[0]);
      Fixed64 fy(getInteropParamArray()[1]);
      return fx.CompareTo(fy);
    }

    static void max(size_t length)
    {
      Fixed64 maxVal = Fixed64::MinValue;
      for (unsigned i = 0; i < length; i++)
      {
        Fixed64 fixedV(getInteropParamArray()[i]);
        maxVal = FixedMath::Max(maxVal, fixedV);
      }

      getInteropReturnArray()[0] = static_cast<Fixed64Param>(maxVal);
    }

    static void min(size_t length)
    {
      Fixed64 minVal = Fixed64::MaxValue;
      for (unsigned i = 0; i < length; i++)
      {
        Fixed64 fixedV(getInteropParamArray()[i]);
        minVal = FixedMath::Min(minVal, fixedV);
      }

      getInteropReturnArray()[0] = static_cast<Fixed64Param>(minVal);
    }

    static void sum(size_t length)
    {
      Fixed64 total = Fixed64::Zero;
      for (unsigned i = 0; i < length; i++)
      {
        Fixed64 fixedV(getInteropParamArray()[i]);
        total = total + fixedV;
      }

      getInteropReturnArray()[0] = static_cast<Fixed64Param>(total);
    }

    static std::string testPerformance(const uint32_t testTimes);
    static void emptyCall() {}
  };
} // namespace Fixed64Wrapper