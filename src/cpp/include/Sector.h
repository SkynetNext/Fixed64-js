#pragma once

#include "Vector3.h"

namespace Skynet
{
  class Sector
  {
  private:
    Vector3 _center;
    Vector3 _direction;
    Fixed64 _radius = 0;
    Fixed64 _angle = 0;
    Fixed64 _angleSinValue = -1; // Use -1 as uninitialized flag
    Fixed64 _angleCosValue = -1; // Use -1 as uninitialized flag

  public:
    void init(const Vector3 &center, const Vector3 &direction, Fixed64 angle,
              Fixed64 radius)
    {
      _center.copy(center);
      _direction.copy(direction);
      _radius = radius;
      if (!(_angle == angle))
      {
        _angleSinValue = -1; // Mark as uninitialized
        _angleCosValue = -1; // Mark as uninitialized
      }

      _angle = angle;
    }

    bool overlapsWithCircle(const Vector3 &center, Fixed64 radius)
    {
      Vector3 tempCenterVector = center - _center;

      Fixed64 radiusSum = _radius + radius;

      if (tempCenterVector.lengthSqr() > (radiusSum * radiusSum))
      {
        return false;
      }

      Fixed64 relativeCircleCenterX = Vector3::dot(tempCenterVector, _direction);
      Fixed64 relativeCircleCenterY =
          FixedMath::Abs(tempCenterVector.x() * (-_direction.y()) +
                         tempCenterVector.y() * _direction.x());

      if (_angleCosValue == -1)
      { // Check if uninitialized
        _angleCosValue = FixedMath::Cos(Fixed64Const::DegToRad * _angle);
      }

      if (relativeCircleCenterX >
          FixedMath::Sqrt(tempCenterVector.lengthSqr() * _angleCosValue))
      {
        return true;
      }

      if (_angleSinValue == -1)
      { // Check if uninitialized
        _angleSinValue = FixedMath::Sin(Fixed64Const::DegToRad * _angle);
      }

      Vector3 tempPosition(relativeCircleCenterX, relativeCircleCenterY, 0);
      Vector3 lineVector(_angleCosValue, _angleSinValue, 0);

      return Vector3::pointToLineSegmentDistanceSqr(
                 Vector3(0, 0, 0), lineVector, tempPosition) <= (radius * radius);
    }

    bool static overlapsWithCircle();
  };
} // namespace Skynet