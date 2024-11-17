#pragma once

#include <sstream> // For toString conversion

#include "Fixed64.h"
#include "Fixed64Wrapper.h"
#include "FixedMath.h"
#include "Interop.h"

namespace Skynet
{
  class Vector2
  {
  public:
    Fixed64 _x;
    Fixed64 _y;

  public:
    Vector2() : _x(0), _y(0) {}
    Vector2(const Fixed64Param &x, const Fixed64Param &y) : _x(x), _y(y) {}
    Vector2(const float x, const float y) : _x(x), _y(y) {}
    Vector2(const Fixed64 &x, const Fixed64 &y) : _x(x), _y(y) {}

    Fixed64 x() const { return _x; }
    Fixed64 y() const { return _y; }

    Vector2 &copy(const Vector2 &other)
    {
      _x = other._x;
      _y = other._y;
      return *this;
    }

    Vector2 &set(const float x, const float y)
    {
      _x = x;
      _y = y;
      return *this;
    }

    void setWrapper();

    Vector2 &normalize()
    {
      Fixed64 len = this->len();
      if (len != Fixed64Const::Zero)
      {
        _x = _x / len;
        _y = _y / len;
      }
      return *this;
    }

    bool equals(const Vector2 &other) const
    {
      return _x == other._x && _y == other._y;
    }

    Vector2 add(const Vector2 &other) const
    {
      return Vector2(_x + other._x, _y + other._y);
    }

    Vector2 sub(const Vector2 &other) const
    {
      return Vector2(_x - other._x, _y - other._y);
    }

    std::string toString() const
    {
      std::stringstream ss;
      ss << "{x: " << _x.toString() << ", y: " << _y.toString() << "}";
      return ss.str();
    }

    static Fixed64 dot(const Vector2 &vec1, const Vector2 &vec2)
    {
      return vec1._x * vec2._x + vec1._y * vec2._y;
    }

    Fixed64 len() const { return FixedMath::Sqrt(_x * _x + _y * _y); }

    // Additional methods adapted from Skynet::Vector2
    Vector2 operator-() const { return Vector2(-_x, -_y); }

    Vector2 operator*(const Fixed64 &s) const { return Vector2(_x * s, _y * s); }

    Vector2 operator/(const Fixed64 &s) const
    {
      return Vector2(_x / s, _y / s); // Assuming Fixed64 supports division
    }

    Vector2 operator+(const Vector2 &vector) const
    {
      return Vector2(_x + vector._x, _y + vector._y);
    }

    Vector2 operator-(const Vector2 &vector) const
    {
      return Vector2(_x - vector._x, _y - vector._y);
    }

    Vector2 &operator*=(const Fixed64 &s)
    {
      _x *= s;
      _y *= s;
      return *this;
    }

    inline Fixed64 operator*(const Vector2 &vector) const
    {
      return _x * vector.x() + _y * vector.y();
    }

    Vector2 &operator/=(Fixed64 s)
    {
      _x = _x / s;
      _y = _y / s;
      return *this;
    }

    Vector2 &operator+=(const Vector2 &vector)
    {
      _x = _x + vector._x;
      _y = _y + vector._y;
      return *this;
    }

    Vector2 &operator-=(const Vector2 &vector)
    {
      _x = _x - vector._x;
      _y = _y - vector._y;
      return *this;
    }

    // Assuming Fixed64 supports comparison operators
    bool operator==(const Vector2 &vector) const
    {
      return _x == vector._x && _y == vector._y;
    }

    bool operator!=(const Vector2 &vector) const
    {
      return _x != vector._x || _y != vector._y;
    }

    static bool checkCircleOverlap(const Vector2 &center1, const Vector2 &center2,
                                   const Fixed64 &radius1, const Fixed64 &radius2,
                                   Fixed64 *ptrDistSquared = nullptr)
    {
      Fixed64 diffX = center1.x() - center2.x();
      Fixed64 diffY = center1.y() - center2.y();

      Fixed64 distSquared = diffX * diffX + diffY * diffY;
      Fixed64 radiusSum = radius1 + radius2;
      if (ptrDistSquared)
      {
        *ptrDistSquared = distSquared;
      }
      return distSquared <= radiusSum * radiusSum;
    }

    static bool checkLineSegmentIntersectsCircle(const Vector2 &circleCenter,
                                                 Fixed64 radius,
                                                 const Vector2 &lineStart,
                                                 const Vector2 &lineEnd)
    {
      // 计算圆心到线段端点的向量
      Vector2 toStart = circleCenter - lineStart;
      Vector2 toEnd = circleCenter - lineEnd;

      // 计算线段向量
      Vector2 lineVec = lineEnd - lineStart;
      Fixed64 lineLength = lineVec.len();
      lineVec.normalize();

      // 计算圆心到线段最近点的向量在线段向量上的投影长度
      Fixed64 projectionLength = Vector2::dot(toStart, lineVec);

      Vector2 nearestPoint;
      if (projectionLength <= 0)
      {
        // 最近点是线段的起点
        nearestPoint = lineStart;
      }
      else if (projectionLength >= lineLength)
      {
        // 最近点是线段的终点
        nearestPoint = lineEnd;
      }
      else
      {
        // 最近点在线段上
        nearestPoint = lineStart + lineVec * projectionLength;
      }

      // 计算最近点到圆心的距离
      Vector2 nearestVec = circleCenter - nearestPoint;
      Fixed64 distance = nearestVec.len();

      // 判断距离是否小于等于半径
      return distance <= radius;
    }

    static void normalizeWrapper();
    static void addWrapper();
    static void subWrapper();
    static void scalar();
    static void dotWrapper();
    static void lenWrapper();
  };

  inline Vector2 operator*(Fixed64 s, const Vector2 &vector)
  {
    return Vector2(s * vector.x(), s * vector.y());
  }

  inline std::ostream &operator<<(std::ostream &os, const Vector2 &vector)
  {
    os << "(" << vector.x().toString() << "," << vector.y().toString() << ")";

    return os;
  }

  inline Fixed64 abs(const Vector2 &vector) { return vector.len(); }

  inline Fixed64 absSq(const Vector2 &vector) { return vector * vector; }

  inline Fixed64 det(const Vector2 &vector1, const Vector2 &vector2)
  {
    return vector1.x() * vector2.y() - vector1.y() * vector2.x();
  }

  inline Vector2 normalize(const Vector2 &vector)
  {
    auto len = abs(vector);
    if (len != Fixed64Const::Zero)
    {
      return vector / len;
    }
    return vector;
  }

  inline Vector2 getInteropVector2Param(size_t offset)
  {
    auto &params = getInteropParamArray();
    return Vector2(params[offset], params[offset + 1]);
  }

  inline void setInteropReturnArray(size_t offset, const Vector2 &value)
  {
    auto &returnArray = getInteropReturnArray();
    returnArray[offset] = static_cast<Fixed64Param>(value._x);
    returnArray[offset + 1] = static_cast<Fixed64Param>(value._y);
  }

  inline void absWrapper()
  {
    Vector2 vector = getInteropVector2Param(0);
    Fixed64 result = abs(vector);
    getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
  }

  inline void absSqWrapper()
  {
    Vector2 vector = getInteropVector2Param(0);
    Fixed64 result = absSq(vector);
    getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
  }

  inline void detWrapper()
  {
    Vector2 vector1 = getInteropVector2Param(0);
    Vector2 vector2 = getInteropVector2Param(2);
    Fixed64 result = det(vector1, vector2);
    getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
  }

  inline void normalizeWrapper()
  {
    Vector2 vector = getInteropVector2Param(0);
    Vector2 result = normalize(vector);
    setInteropReturnArray(0, result);
  }
} // namespace Skynet