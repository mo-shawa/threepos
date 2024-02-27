/*
projectionMatrix
viewMatrix
modelMatrix

*/

uniform float uSize;
uniform float uTime;
uniform float uTimeMultiplier;

attribute float aScale;
attribute vec3 aRandomness;

varying vec3 vPosition;
varying float vRandom;


void main(){
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Spin
  float angle = atan(modelPosition.x, modelPosition.z);
  float distanceFromCenter = length(modelPosition.xz);

  float angleOffset = ((1.0 / distanceFromCenter)) * ((uTime * uTimeMultiplier) + 20.0) / 10.0;

  angle += angleOffset;

  modelPosition.x = cos(angle) * distanceFromCenter;
  modelPosition.z = sin(angle) * distanceFromCenter;

  modelPosition.xyz += aRandomness;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  gl_PointSize = uSize * (aScale);
  gl_PointSize *= (1.0 / -viewPosition.z);
  vPosition = position;
  vRandom = aScale;
}
