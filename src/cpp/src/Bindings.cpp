// Bindings.cpp
#include <emscripten/bind.h>

#include "Rect.h"
#include "Sector.h"
#include "Vector3.h"

using namespace emscripten;
using namespace Skynet;

EMSCRIPTEN_BINDINGS(vector2_bindings) {
  emscripten::class_<Skynet::Vector2>("Vector2")
      .constructor<>()
      .constructor<float, float>()
      .function("set", &Skynet::Vector2::setWrapper)
      // Bind static functions
      .class_function("add", &Skynet::Vector2::addWrapper)
      .class_function("sub", &Skynet::Vector2::subWrapper)
      .class_function("scalar", &Skynet::Vector2::scalar)
      .class_function("normalize", &Skynet::Vector2::normalizeWrapper)
      .class_function("len", &Skynet::Vector2::lenWrapper)
      .class_function("dot", &Skynet::Vector2::dotWrapper)
      // Bind non-static member functions
      .function("toString", &Skynet::Vector2::toString)  // Corrected line
      // Other bindings as necessary
      ;

  emscripten::register_vector<Skynet::Vector2>("Vector2List");

  // Bind standalone functions
  emscripten::function("abs", &Skynet::absWrapper);
  emscripten::function("absSq", &Skynet::absSqWrapper);
  emscripten::function("det", &Skynet::detWrapper);
  emscripten::function("normalize", &Skynet::normalizeWrapper);
}

EMSCRIPTEN_BINDINGS(vector3_module) {
  register_vector<double>("doubleVector");

  class_<Vector3>("Vector3")
      .constructor<>()
      .function("set", &Vector3::set)
      .function("copy", &Vector3::copy)
      .class_function("cross", &Vector3::cross)
      .class_function("dot", &Vector3::dotWrapper)
      .class_function("add", &Vector3::add)
      .class_function("sub", &Vector3::sub)
      .class_function("mul", &Vector3::mul)
      .class_function("div", &Vector3::div)
      .class_function("scalar", &Vector3::scalar)
      .class_function("normalize", &Vector3::normalizeWrapper)
      .class_function("normalizedDirection", &Vector3::normalizedDirection)
      .class_function("negative", &Vector3::negative)
      .class_function("distance", &Vector3::distance)
      .class_function("squaredDistance", &Vector3::squaredDistanceWrapper)
      .class_function("rotateX", &Vector3::rotateXWrapper)
      .class_function("rotateY", &Vector3::rotateYWrapper)
      .class_function("rotateZ", &Vector3::rotateZWrapper)
      .class_function("lerp", &Vector3::lerp)
      .class_function("lengthSqr", &Vector3::lengthSqrWrapper)
      .class_function("len", &Vector3::len)
      .class_function("isCircleOverlaps", &Vector3::isCircleOverlaps)
      .class_function("isLineCircleIntersect", &Vector3::isLineCircleIntersect)
      .class_function("decayKnockbackVector",
                      &Vector3::decayKnockbackVectorWrapper)
      .class_function("velocityToForward", &Vector3::velocityToForward)
      .class_function("moveForward", &Vector3::moveForwardWrapper)
      .class_function("emptyCall", &Vector3::emptyCall);
}

EMSCRIPTEN_BINDINGS(Rect_module) {
  class_<Rect>("Rect")
      .constructor<>()
      .class_function("overlapsWithCircle", &Rect::overlapsWithCircle)
      .class_function("overlapsWithRect", &Rect::overlapsWithRect)
      .class_function("containsPoint", &Rect::containsPoint);
}

EMSCRIPTEN_BINDINGS(Sector_module) {
  class_<Sector>("Sector").constructor<>().class_function(
      "overlapsWithCircle", &Sector::overlapsWithCircle);
}
