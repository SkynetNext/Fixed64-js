#include "Vector3.h"

using namespace Skynet;

void Vector3::set()
{
  _x = Fixed64(getInteropParamArray()[0]);
  _y = Fixed64(getInteropParamArray()[1]);
  _z = Fixed64(getInteropParamArray()[2]);
}

void Vector3::lengthSqrWrapper()
{
  Vector3 vec = getInteropVector3Param(0);
  Fixed64 result = vec.x() * vec.x() + vec.y() * vec.y() + vec.z() * vec.z();
  getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
}

void Vector3::len()
{
  Vector3 vec = getInteropVector3Param(0);
  Fixed64 result = FixedMath::Sqrt(vec.x() * vec.x() + vec.y() * vec.y() +
                                   vec.z() * vec.z());
  getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
}

void Vector3::cross()
{
  Vector3 vec1 = getInteropVector3Param(0);
  Vector3 vec2 = getInteropVector3Param(3);
  Vector3 result = Vector3(vec1.y() * vec2.z() - vec1.z() * vec2.y(),
                           vec1.z() * vec2.x() - vec1.x() * vec2.z(),
                           vec1.x() * vec2.y() - vec1.y() * vec2.x());
  setInteropReturnArray(0, result);
}

void Vector3::dotWrapper()
{
  Vector3 vec1 = getInteropVector3Param(0);
  Vector3 vec2 = getInteropVector3Param(3);
  Fixed64 result =
      vec1.x() * vec2.x() + vec1.y() * vec2.y() + vec1.z() * vec2.z();
  getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
}

// 向量加法
void Vector3::add()
{
  Vector3 vec1 = getInteropVector3Param(0);
  Vector3 vec2 = getInteropVector3Param(3);
  Vector3 result =
      Vector3(vec1.x() + vec2.x(), vec1.y() + vec2.y(), vec1.z() + vec2.z());
  setInteropReturnArray(0, result);
}

// 向量减法
void Vector3::sub()
{
  Vector3 vec1 = getInteropVector3Param(0);
  Vector3 vec2 = getInteropVector3Param(3);
  Vector3 result(vec1.x() - vec2.x(), vec1.y() - vec2.y(), vec1.z() - vec2.z());
  setInteropReturnArray(0, result);
}

// 向量乘法（元素乘法，非向量点乘或叉乘）
void Vector3::mul()
{
  Vector3 vec1 = getInteropVector3Param(0);
  Vector3 vec2 = getInteropVector3Param(3);
  Vector3 result(vec1.x() * vec2.x(), vec1.y() * vec2.y(), vec1.z() * vec2.z());
  setInteropReturnArray(0, result);
}

// 向量除法
void Vector3::div()
{
  Vector3 vec1 = getInteropVector3Param(0);
  Vector3 vec2 = getInteropVector3Param(3);
  Vector3 result(vec1.x() / vec2.x(), vec1.y() / vec2.y(), vec1.z() / vec2.z());
  setInteropReturnArray(0, result);
}

// 向量与标量乘法
void Vector3::scalar()
{
  Vector3 vec = getInteropVector3Param(0);
  Fixed64 scalar(getInteropParamArray()[3]);
  Vector3 result(vec.x() * scalar, vec.y() * scalar, vec.z() * scalar);
  setInteropReturnArray(0, result);
}

// 向量归一化
void Vector3::normalizeWrapper()
{
  Vector3 vec = getInteropVector3Param(0);
  Fixed64 length = FixedMath::Sqrt(vec.x() * vec.x() + vec.y() * vec.y() +
                                   vec.z() * vec.z());
  if (length != 0)
  {
    vec._x = vec._x / length;
    vec._y = vec._y / length;
    vec._z = vec._z / length;
  }
  setInteropReturnArray(0, vec);
}

void Vector3::normalizedDirection()
{
  Vector3 vec1 = getInteropVector3Param(0);
  Vector3 vec2 = getInteropVector3Param(3);
  Vector3 result = vec2 - vec1;
  result.normalize();
  setInteropReturnArray(0, result);
}

void Vector3::negative()
{
  Vector3 vec = getInteropVector3Param(0);
  vec._x = -vec.x();
  vec._y = -vec.y();
  vec._z = -vec.z();
  setInteropReturnArray(0, vec);
}

void Vector3::distance()
{
  Vector3 vec1 = getInteropVector3Param(0);
  Vector3 vec2 = getInteropVector3Param(3);
  Fixed64 dx = vec1.x() - vec2.x();
  Fixed64 dy = vec1.y() - vec2.y();
  Fixed64 dz = vec1.z() - vec2.z();
  Fixed64 result = FixedMath::Sqrt(dx * dx + dy * dy + dz * dz);
  getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
}

Fixed64 Vector3::squaredDistance(const Vector3 &vec1, const Vector3 &vec2)
{
  Fixed64 dx = vec1.x() - vec2.x();
  Fixed64 dy = vec1.y() - vec2.y();
  Fixed64 dz = vec1.z() - vec2.z();
  Fixed64 result = dx * dx + dy * dy + dz * dz;
  return result;
}

void Vector3::squaredDistanceWrapper()
{
  Vector3 vec1 = getInteropVector3Param(0);
  Vector3 vec2 = getInteropVector3Param(3);
  Fixed64 result = squaredDistance(vec1, vec2);
  getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
}

Vector3 Vector3::rotateX(const Vector3 &vv, const Vector3 &vo, Fixed64 angle)
{
  Fixed64 radians = angle * Fixed64Const::DegToRad;
  Fixed64 cosA = FixedMath::Cos(radians);
  Fixed64 sinA = FixedMath::Sin(radians);
  Fixed64 relativeY = vv.y() - vo.y();
  Fixed64 relativeZ = vv.z() - vo.z();
  Fixed64 rotatedY = relativeY * cosA - relativeZ * sinA;
  Fixed64 rotatedZ = relativeY * sinA + relativeZ * cosA;
  return Vector3(vv.x(), rotatedY + vo.y(), rotatedZ + vo.z());
}

void Vector3::rotateXWrapper()
{
  Vector3 vv = getInteropVector3Param(0);
  Vector3 vo = getInteropVector3Param(3);
  Fixed64 angle(getInteropParamArray()[6]);
  Vector3 out = rotateX(vv, vo, angle);

  setInteropReturnArray(0, out);
}

Vector3 Vector3::rotateY(const Vector3 &vv, const Vector3 &vo, Fixed64 angle)
{
  Fixed64 radians = angle * Fixed64Const::DegToRad;
  Fixed64 cosA = FixedMath::Cos(radians);
  Fixed64 sinA = FixedMath::Sin(radians);
  Fixed64 relativeX = vv.x() - vo.x();
  Fixed64 relativeZ = vv.z() - vo.z();
  Fixed64 rotatedX = relativeX * cosA + relativeZ * sinA;
  Fixed64 rotatedZ = relativeZ * cosA - relativeX * sinA;

  return Vector3(rotatedX + vo.x(), vv.y(), rotatedZ + vo.z());
}

void Vector3::rotateYWrapper()
{
  Vector3 vv = getInteropVector3Param(0);
  Vector3 vo = getInteropVector3Param(3);
  Fixed64 angle(getInteropParamArray()[6]);
  Vector3 out = rotateY(vv, vo, angle);
  setInteropReturnArray(0, out);
}

Vector3 Vector3::rotateZ(const Vector3 &vv, const Vector3 &vo, Fixed64 angle)
{
  Fixed64 radians = angle * Fixed64Const::DegToRad;
  Fixed64 cosA = FixedMath::Cos(radians);
  Fixed64 sinA = FixedMath::Sin(radians);
  Fixed64 relativeX = vv.x() - vo.x();
  Fixed64 relativeY = vv.y() - vo.y();
  Fixed64 rotatedX = relativeX * cosA - relativeY * sinA;
  Fixed64 rotatedY = relativeX * sinA + relativeY * cosA;

  return Vector3(rotatedX + vo.x(), rotatedY + vo.y(), vv.z());
}

void Vector3::rotateZWrapper()
{
  Vector3 vv = getInteropVector3Param(0);
  Vector3 vo = getInteropVector3Param(3);
  Fixed64 angle(getInteropParamArray()[6]);
  Vector3 out = rotateZ(vv, vo, angle);
  setInteropReturnArray(0, out);
}

void Vector3::lerp()
{
  Vector3 a = getInteropVector3Param(0);
  Vector3 b = getInteropVector3Param(3);
  Fixed64 t(getInteropParamArray()[6]);
  setInteropReturnArray(
      0, Vector3(lerpScalar(a.x(), b.x(), t), lerpScalar(a.y(), b.y(), t),
                 lerpScalar(a.z(), b.z(), t)));
}

bool Vector3::isCircleOverlaps(bool is2D, bool returnDistSquared)
{
  Vector3 center1 = getInteropVector3Param(0);
  Vector3 center2 = getInteropVector3Param(3);
  Fixed64 radius1(getInteropParamArray()[6]);
  Fixed64 radius2(getInteropParamArray()[7]);
  if (returnDistSquared)
  {
    Fixed64 distSquared;
    bool ret = checkCircleOverlap(center1, center2, radius1, radius2, is2D,
                                  &distSquared);
    getInteropReturnArray()[0] = static_cast<Fixed64Param>(distSquared);
    return ret;
  }

  return checkCircleOverlap(center1, center2, radius1, radius2, is2D);
}

bool Vector3::isLineCircleIntersect()
{
  Vector3 point1 = getInteropVector3Param(0);
  Vector3 point2 = getInteropVector3Param(3);
  Vector3 center = getInteropVector3Param(6);
  Fixed64 circle_radius(getInteropParamArray()[9]);

  return checkLineCircleIntersect(point1, point2, center, circle_radius);
}

Vector3 Vector3::decayKnockbackVector(const Vector3 &vec, Fixed64 deltaTime,
                                      Fixed64 decaySpeed)
{
  Fixed64 resultX = lerpScalar(vec.x(), Fixed64Const::Zero, decaySpeed);
  Fixed64 resultY = lerpScalar(vec.y(), Fixed64Const::Zero, decaySpeed);
  Fixed64 resultZ = lerpScalar(vec.z(), Fixed64Const::Zero, decaySpeed);

  return Vector3(resultX, resultY, resultZ);
}

void Vector3::decayKnockbackVectorWrapper()
{
  Vector3 vec = getInteropVector3Param(0);
  Fixed64 deltaTime(getInteropParamArray()[3]);
  Fixed64 decaySpeed(0.1);

  auto result = decayKnockbackVector(vec, deltaTime, decaySpeed);

  setInteropReturnArray(0, result);
}

bool Vector3::velocityToForward()
{
  Vector3 velocity = getInteropVector3Param(0);
  Vector3 forward = getInteropVector3Param(3);
  if (velocity.lengthSqr() > Fixed64Const::Epsilon)
  {
    Fixed64 direction = velocity._x >= 0 ? Fixed64Const::One : Fixed64Const::MinusOne;
    forward._x = direction;

    setInteropReturnArray(0, forward);

    return true;
  }

  return false;
}

void Vector3::moveForwardWrapper()
{
  Vector3 postion = getInteropVector3Param(0);
  Vector3 forward = getInteropVector3Param(3);
  Fixed64 moveSpeed = getInteropParamArray()[6];
  Fixed64 deltaTime = getInteropParamArray()[7];
  Vector3 offsetToCreator = getInteropVector3Param(8);

  Vector3 targetPostion = Vector3::moveForward(postion, forward, moveSpeed,
                                               deltaTime, offsetToCreator);
  setInteropReturnArray(0, targetPostion);
  setInteropReturnArray(3, offsetToCreator);
}
