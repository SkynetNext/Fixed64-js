#include "Rect.h"

EBattleWorldType WorldType = EBattleWorldType::TwoDimensional;

bool Rect::overlapsWithCircle(bool returnDistSquared) {
  Vector3 rectCenter = getInteropVector3Param(0);
  Fixed64 rectHalfWidth(getInteropParamArray()[3]);
  Fixed64 rectHeight(getInteropParamArray()[4]);
  Vector3 rectForward = getInteropVector3Param(5);
  Vector3 circleCenter = getInteropVector3Param(8);
  Fixed64 circleRadius(getInteropParamArray()[11]);

  Rect rect(rectCenter, rectHalfWidth * 2, rectHeight, rectForward);
  bool ret = rect.overlapsWithCircle(circleCenter, circleRadius);
  if (returnDistSquared) {
    getInteropReturnArray()[0] = static_cast<Skynet::Fixed64Param>(
        (circleCenter - rectCenter).lengthSqr());
  }

  return ret;
}

bool Rect::overlapsWithRect() {
  Vector3 rectCenter = getInteropVector3Param(0);
  Fixed64 rectHalfWidth(getInteropParamArray()[3]);
  Fixed64 rectHeight(getInteropParamArray()[4]);
  Vector3 rectForward = getInteropVector3Param(5);
  Vector3 otherRectCenter = getInteropVector3Param(8);
  Fixed64 otherRectHalfWidth(getInteropParamArray()[11]);
  Fixed64 otherRectHeight(getInteropParamArray()[12]);
  Vector3 otherRectForward = getInteropVector3Param(13);
  Rect rect(rectCenter, rectHalfWidth * 2, rectHeight, rectForward);
  Rect otherRect(otherRectCenter, otherRectHalfWidth * 2, otherRectHeight,
                 otherRectForward);

  return rect.overlapsWithRect(otherRect);
}

bool Rect::containsPoint() {
  Vector3 rectCenter = getInteropVector3Param(0);
  Fixed64 rectHalfWidth(getInteropParamArray()[3]);
  Fixed64 rectHeight(getInteropParamArray()[4]);
  Vector3 rectForward = getInteropVector3Param(5);
  Vector3 point = getInteropVector3Param(8);

  Rect rect(rectCenter, rectHalfWidth * 2, rectHeight, rectForward);

  return rect.containsPoint(point);
}