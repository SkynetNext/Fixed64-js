#pragma once
#include "Fixed64.h"
#include "Vector2.h"
#include "Vector3.h"

enum EBattleWorldType
{
  TwoDimensional,
  ThreeDimensional
};

extern EBattleWorldType WorldType;

using namespace Skynet;

class Rect
{
public:
  Vector2 _center;
  Vector2 _direction;
  Fixed64 _width;
  Fixed64 _height;
  Vector2 _corn1;
  Vector2 _corn2;
  Vector2 _corn3;
  Vector2 _corn4;
  Vector2 _axis1;
  Vector2 _axis2;

  void computeAxis()
  {
    _axis1 = _corn2 - _corn1;
    _axis1.normalize();
    _axis2 = _corn4 - _corn1;
    _axis2.normalize();
  }

  void computeProjection(const Rect &other, const Vector2 &axis,
                         Vector2 &out) const
  {
    Fixed64 value = Vector2::dot(other._corn1, axis);

    out._x = value;
    out._y = value;

    value = Vector2::dot(other._corn2, axis);
    if (value < out._x)
      out._x = value;
    else if (value > out._y)
      out._y = value;

    value = Vector2::dot(other._corn3, axis);
    if (value < out._x)
      out._x = value;
    else if (value > out._y)
      out._y = value;

    value = Vector2::dot(other._corn4, axis);
    if (value < out._x)
      out._x = value;
    else if (value > out._y)
      out._y = value;
  }

  bool internalOverlapsWithRect(const Rect &other) const
  {
    Fixed64 axis1Min = Vector2::dot(_corn1, _axis1);
    Fixed64 axis1Max = Vector2::dot(_corn3, _axis1);
    Vector2 tempProjection;

    computeProjection(other, _axis1, tempProjection);
    if (tempProjection._x > axis1Max || tempProjection._y < axis1Min)
    {
      return false;
    }

    Fixed64 axis2Min = Vector2::dot(_corn1, _axis2);
    Fixed64 axis2Max = Vector2::dot(_corn3, _axis2);

    computeProjection(other, _axis2, tempProjection);
    if (tempProjection._x > axis2Max || tempProjection._y < axis2Min)
    {
      return false;
    }

    return true;
  }

public:
  /**
   *    corn4            corn3
   *      +-----------------+
   *      |                 |
   *      |      height     |
   *      |                 |
   *      +-----------------+
   *    corn1     width       corn2
   *
   *      <------- direction ------->
   *    说明:
   *    - center: 矩形的中心点。
   *    - direction: 矩形的朝向，定义了矩形的“width”方向。
   *    - width: 矩形沿着direction方向的尺寸。
   *    - height: 矩形沿着与direction垂直的方向的尺寸。
   *    - corn1, corn2, corn3, corn4: 矩形的四个角点。
   */
  Rect(const Vector3 &center = Vector3(), const Fixed64 &width = Fixed64::Zero,
       const Fixed64 &height = Fixed64::Zero,
       const Vector3 &direction = Vector3())
  {
    init(center, width, height, direction);
  }

  void init(const Vector3 &center, const Fixed64 &width, const Fixed64 &height,
            const Vector3 &direction)
  {
    if (WorldType == TwoDimensional)
    {
      _center = Vector2(center._x, center._y);
      _direction = Vector2(direction._x, direction._y);
    }
    else
    {
      _center = Vector2(center._x, center._z);
      _direction = Vector2(direction._x, direction._z);
    }

    _width = width;
    _height = height;

    Vector2 xAxis(_direction._x, _direction._y);
    Vector2 yAxis(-_direction._y, _direction._x);

    xAxis = xAxis * width / 2;
    yAxis = yAxis * height / 2;

    _corn1 = _center - xAxis - yAxis;
    _corn2 = _center + xAxis - yAxis;
    _corn3 = _center + xAxis + yAxis;
    _corn4 = _center - xAxis + yAxis;

    computeAxis();
  }

  bool overlapsWithCircle(const Vector3 &center, const Fixed64 &radius) const
  {
    Vector2 center2D;

    // 转换3D中心点到2D
    if (WorldType == TwoDimensional)
    {
      center2D._x = center._x;
      center2D._y = center._y;
    }
    else
    {
      center2D._x = center._x;
      center2D._y = center._z;
    }

    return overlapsWithCircle(center2D, radius);
  }

  bool overlapsWithCircle(const Vector2 &center, const Fixed64 &radius) const
  {
    Vector2 tempVec = center;

    tempVec = tempVec - _corn1;
    Fixed64 proj1 = Vector2::dot(tempVec, _axis1);
    Fixed64 proj2 = Vector2::dot(tempVec, _axis2);

    Fixed64 axis1Min = -radius;
    Fixed64 axis1Max = _width + radius;
    Fixed64 axis2Min = -radius;
    Fixed64 axis2Max = _height + radius;

    return (proj1 > axis1Min) && (proj1 < axis1Max) && (proj2 > axis2Min) &&
           (proj2 < axis2Max);
  }

  bool overlapsWithRect(const Rect &other) const
  {
    return this->internalOverlapsWithRect(other) &&
           other.internalOverlapsWithRect(*this);
  }

  bool containsPoint(const Vector3 &point) const
  {
    Vector2 tempVec;

    if (WorldType == TwoDimensional)
    {
      tempVec._x = point._x;
      tempVec._y = point._y;
    }
    else
    {
      tempVec._x = point._x;
      tempVec._y = point._z;
    }

    tempVec = tempVec - _corn1;
    Fixed64 proj1 = Vector2::dot(tempVec, _axis1);
    Fixed64 proj2 = Vector2::dot(tempVec, _axis2);

    Fixed64 axis1Min(0);
    Fixed64 axis1Max = _width;
    Fixed64 axis2Min(0);
    Fixed64 axis2Max = _height;

    return (proj1 > axis1Min) && (proj1 < axis1Max) && (proj2 > axis2Min) &&
           (proj2 < axis2Max);
  }

  // 从两点和半宽构建Rect
  Rect(const Vector2 &point1, const Vector2 &point2, const Fixed64 &halfWidth)
  {
    // 计算中心点
    Vector3 center((point1._x + point2._x) / 2, (point1._y + point2._y) / 2, 0);

    // 计算方向向量
    Vector2 direction = point2 - point1;
    Fixed64 length = direction.len(); // 在单位化方向向量之前计算长度
    if (length == 0)
    {
      direction = Vector2(1, 0);
    }
    else
    {
      direction.normalize(); // 单位化方向向量
    }

    // 计算宽度和高度
    Fixed64 height = halfWidth * 2; // 给定的半宽值乘以2得到完整高度

    // 使用计算出的值初始化Rect
    this->init(Vector3(center._x, center._y, 0), length, height,
               Vector3(direction._x, direction._y, 0));
  }

  static bool overlapsWithCircle(bool returnDistSquared);
  static bool overlapsWithRect();
  static bool containsPoint();
};