#include "Vector2.h"

using namespace Skynet;

void Vector2::setWrapper() {
  _x = Fixed64(getInteropParamArray()[0]);
  _y = Fixed64(getInteropParamArray()[1]);
}

void Vector2::normalizeWrapper() {
  Vector2 vector = getInteropVector2Param(0);
  vector.normalize();
  setInteropReturnArray(0, vector);
}

void Vector2::addWrapper() {
  Vector2 vector1 = getInteropVector2Param(0);
  Vector2 vector2 = getInteropVector2Param(2);
  Vector2 result = vector1.add(vector2);
  setInteropReturnArray(0, result);
}

void Vector2::subWrapper() {
  Vector2 vector1 = getInteropVector2Param(0);
  Vector2 vector2 = getInteropVector2Param(2);
  Vector2 result = vector1.sub(vector2);
  setInteropReturnArray(0, result);
}

void Vector2::scalar() {
  Vector2 vector = getInteropVector2Param(0);
  Fixed64 scalar = getInteropParamArray()[2];
  Vector2 result = vector * scalar;
  setInteropReturnArray(0, result);
}

void Vector2::dotWrapper() {
  Vector2 vector1 = getInteropVector2Param(0);
  Vector2 vector2 = getInteropVector2Param(2);
  Fixed64 result = dot(vector1, vector2);
  getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
}

void Vector2::lenWrapper() {
  Vector2 vector = getInteropVector2Param(0);
  Fixed64 result = vector.len();
  getInteropReturnArray()[0] = static_cast<Fixed64Param>(result);
}