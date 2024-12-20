#pragma once

#include <sstream>

#include "Fixed64.h"
#include "Fixed64Native.h"
#include "Interop.h"

namespace Skynet {
class Vector3 {
 public:
  Fixed64 _x;
  Fixed64 _y;
  Fixed64 _z;

 public:
  Vector3()
      : _x(Fixed64Const::Zero),
        _y(Fixed64Const::Zero),
        _z(Fixed64Const::Zero) {}
  Vector3(const Fixed64Param &x, const Fixed64Param &y, const Fixed64Param &z)
      : _x(x), _y(y), _z(z) {}

  Vector3(const Fixed64 &x, const Fixed64 &y, const Fixed64 &z)
      : _x(x), _y(y), _z(z) {}

  Fixed64 x() const { return _x; }
  Fixed64 y() const { return _y; }
  Fixed64 z() const { return _z; }

  Vector3(const Vector3 &other) : _x(other._x), _y(other._y), _z(other._z) {}

  bool isZero() const {
    return _x == Fixed64Const::Zero && _y == Fixed64Const::Zero &&
           _z == Fixed64Const::Zero;
  }

  void set();

  // Assignment operator
  Vector3 &operator=(const Vector3 &other) {
    if (this != &other) {  // Prevent self-assignment
      _x = other._x;
      _y = other._y;
      _z = other._z;
    }
    return *this;
  }

  Vector3 &copy(const Vector3 &other) {
    _x = other._x;
    _y = other._y;
    _z = other._z;
    return *this;
  }

  // Addition
  Vector3 operator+(const Vector3 &other) const {
    return Vector3(_x + other._x, _y + other._y, _z + other._z);
  }

  Vector3 &operator+=(const Vector3 &other) { return *this = *this + other; }

  // Subtraction
  Vector3 operator-(const Vector3 &other) const {
    return Vector3(_x - other._x, _y - other._y, _z - other._z);
  }

  Vector3 &operator-=(const Vector3 &other) { return *this = *this - other; }

  // Scalar multiplication
  Vector3 operator*(Fixed64 scalar) const {
    return Vector3(_x * scalar, _y * scalar, _z * scalar);
  }

  Vector3 &operator*=(Fixed64 scalar) { return *this = *this * scalar; }

  // Scalar division
  Vector3 operator/(Fixed64 scalar) const {
    return Vector3(_x / scalar, _y / scalar, _z / scalar);
  }

  Vector3 &operator/=(Fixed64 scalar) { return *this = *this / scalar; }

  bool operator==(const Vector3 &other) const {
    return _x == other._x && _y == other._y && _z == other._z;
  }

  // Dot product
  static Fixed64 dot(const Vector3 &a, const Vector3 &b) {
    return a._x * b._x + a._y * b._y + a._z * b._z;
  }

  // Calculate and return the squared length of the vector
  Fixed64 lengthSqr() const { return _x * _x + _y * _y + _z * _z; }
  Fixed64 length() const { return FixedMath::Sqrt(lengthSqr()); }

  void normalize() {
    Fixed64 length = FixedMath::Sqrt(lengthSqr());
    if (length != 0) {
      _x = _x / length;
      _y = _y / length;
      _z = _z / length;
    }
  }

  static Fixed64 lerpScalar(Fixed64 a, Fixed64 b, Fixed64 t) {
    return a * (Fixed64Const::One - t) + b * t;
  }

  // Function to calculate the squared distance from a point to a line segment
  static Fixed64 pointToLineSegmentDistanceSqr(const Vector3 &startPoint,
                                               const Vector3 &endPoint,
                                               const Vector3 &otherPoint) {
    // Vector from startPoint to otherPoint
    Vector3 tempVector1 = otherPoint - startPoint;
    // Vector from startPoint to endPoint
    Vector3 tempVector2 = endPoint - startPoint;
    // Projection factor of tempVector1 onto tempVector2, normalized by the
    // squared length of tempVector2
    Fixed64 r = dot(tempVector1, tempVector2) / tempVector2.lengthSqr();

    if (r < Fixed64Const::Zero) {
      // If r < 0, the closest point on the line segment to otherPoint is
      // startPoint
      return tempVector1.lengthSqr();
    } else if (r > Fixed64Const::One) {
      // If r > 1, the closest point on the line segment to otherPoint is
      // endPoint
      return (otherPoint - endPoint).lengthSqr();
    } else {
      // Otherwise, the closest point lies within the line segment
      Vector3 projection = startPoint + (tempVector2 * r);
      return (otherPoint - projection).lengthSqr();
    }
  }

  static bool checkCircleOverlap(const Vector3 &center1, const Vector3 &center2,
                                 const Fixed64 &radius1, const Fixed64 &radius2,
                                 bool is2D, Fixed64 *ptrDistSquared = nullptr) {
    Fixed64 diffX = center1.x() - center2.x();
    Fixed64 diffY;
    if (is2D) {
      diffY = center1.y() - center2.y();
    } else {
      diffY = center1.z() - center2.z();
    }

    Fixed64 distSquared = diffX * diffX + diffY * diffY;
    Fixed64 radiusSum = radius1 + radius2;
    if (ptrDistSquared) {
      *ptrDistSquared = distSquared;
    }
    return distSquared <= radiusSum * radiusSum;
  }

  static bool checkRingCircleOverlap(const Vector3 &ringCenter,
                                     const Fixed64 &ringInnerRadius,
                                     const Fixed64 &ringOuterRadius,
                                     const Vector3 &circleCenter,
                                     const Fixed64 &circleRadius, bool is2D,
                                     Fixed64 *ptrDistSquared = nullptr) {
    Fixed64 diffX = ringCenter.x() - circleCenter.x();
    Fixed64 diffY;
    if (is2D) {
      diffY = ringCenter.y() - circleCenter.y();
    } else {
      diffY = ringCenter.z() - circleCenter.z();
    }

    Fixed64 distSquared = diffX * diffX + diffY * diffY;
    if (ptrDistSquared) {
      *ptrDistSquared = distSquared;
    }

    // Calculate the square of the distance from the ring center to the circle
    // center
    Fixed64 dist = distSquared;

    // Calculate the square of the sum of the ring's outer radius and the
    // circle's radius
    Fixed64 maxDistSquared =
        (ringOuterRadius + circleRadius) * (ringOuterRadius + circleRadius);

    // Calculate the square of the difference of the ring's inner radius and the
    // circle's radius (set to 0 if negative because we don't consider negative
    // distances)
    Fixed64 minDistSquared =
        (ringInnerRadius - circleRadius) * (ringInnerRadius - circleRadius);
    if (ringInnerRadius < circleRadius) {
      minDistSquared =
          Fixed64Const::Zero;  // Set the minimum distance squared to 0 if the
                               // inner radius is less than the circle radius
    }

    // Check if the distance is within the valid range
    bool isOverlap = dist <= maxDistSquared && dist >= minDistSquared;

    return isOverlap;
  }

  static bool checkLineCircleIntersect(const Vector3 &point1,
                                       const Vector3 &point2,
                                       const Vector3 &center,
                                       const Fixed64 &circle_radius) {
    Vector3 d = point2 - point1;  // Direction vector of the line segment
    Vector3 f =
        point1 -
        center;  // Vector from the circle center to the line segment start

    Fixed64 a = Vector3::dot(d, d);      // d · d
    Fixed64 b = Vector3::dot(f * 2, d);  // 2f · d
    Fixed64 c =
        Vector3::dot(f, f) - circle_radius * circle_radius;  // f · f - r^2

    Fixed64 discriminant = b * b - 4 * a * c;
    if (discriminant < 0) {
      // No intersection points
      return false;
    } else {
      // Calculate the parameter t along the line segment for the intersection
      // points
      discriminant = FixedMath::Sqrt(discriminant);
      Fixed64 t1 = (-b - discriminant) / (2 * a);
      Fixed64 t2 = (-b + discriminant) / (2 * a);

      // If at least one of t1 or t2 is between 0 and 1, the line segment
      // intersects the circle
      if ((t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1)) {
        return true;
      } else {
        return false;
      }
    }
  }

  static Fixed64 calculateAngle(const Vector3 &center, const Vector3 &point) {
    Vector3 direction = point - center;
    Fixed64 angle = FixedMath::Atan2(direction.y(), direction.x());
    if (angle < 0) angle += Fixed64Const::Pi2;  // Ensure the angle is positive
    return angle;
  }

  static Vector3 moveForward(const Vector3 &position, const Vector3 &direction,
                             Fixed64 moveSpeed, Fixed64 deltaTime,
                             Vector3 &offsetToCreator) {
    // Calculate the offset
    Vector3 offset = direction * (moveSpeed * deltaTime);

    // Add the offset to get the final destination position
    Vector3 result = position + offset;
    offsetToCreator = offsetToCreator + offset;

    return result;
  }

  static void lengthSqrWrapper();
  static void len();
  static void cross();
  static void dotWrapper();
  static void add();
  static void sub();
  static void mul();
  static void div();
  static void scalar();
  static void normalizeWrapper();
  static void normalizedDirection();
  static void negative();
  static void distance();
  static Fixed64 squaredDistance(const Vector3 &vec1, const Vector3 &vec2);
  static void squaredDistanceWrapper();
  static Vector3 rotateX(const Vector3 &vv, const Vector3 &vo, Fixed64 angle);
  static void rotateXWrapper();
  static Vector3 rotateY(const Vector3 &vv, const Vector3 &vo, Fixed64 angle);
  static void rotateYWrapper();
  static Vector3 rotateZ(const Vector3 &vv, const Vector3 &vo, Fixed64 angle);
  static void rotateZWrapper();
  static void lerp();
  static bool isCircleOverlaps(bool is2D, bool returnDistSquared);
  static Vector3 decayKnockbackVector(const Vector3 &vec, Fixed64 deltaTime,
                                      Fixed64 decaySpeed);
  static void decayKnockbackVectorWrapper();
  static bool velocityToForward();
  static void moveForwardWrapper();
  static bool isLineCircleIntersect();
  static void emptyCall() {};
};

inline Vector3 getInteropVector3Param(size_t offset) {
  auto &params = getInteropParamArray();
  return Vector3(params[offset], params[offset + 1], params[offset + 2]);
}

inline void setInteropReturnArray(size_t offset, const Vector3 &vector) {
  auto &returnArray = getInteropReturnArray();
  returnArray[offset] = static_cast<Fixed64Param>(vector._x);
  returnArray[offset + 1] = static_cast<Fixed64Param>(vector._y);
  returnArray[offset + 2] = static_cast<Fixed64Param>(vector._z);
}
}  // namespace Skynet