#include "Sector.h"

using namespace Skynet;

bool Sector::overlapsWithCircle()
{
  Vector3 center = getInteropVector3Param(0);
  Vector3 direction = getInteropVector3Param(3);
  Fixed64 angle(getInteropParamArray()[6]);
  Fixed64 radius(getInteropParamArray()[7]);

  Sector sector;
  sector.init(center, direction, angle, radius);

  Vector3 circleCenter = getInteropVector3Param(8);
  Fixed64 circleRadius(getInteropParamArray()[11]);

  return sector.overlapsWithCircle(circleCenter, circleRadius);
}