uniform vec3 uInsideColor;
uniform vec3 uOutsideColor;
uniform float uTime;
uniform float uRadius;

varying vec3 vPosition;
varying float vRandom;

void main(){


  float distanceFromCenter = distance(vPosition.xz, vec2(0.0));

  vec3 mixedColor = mix(uInsideColor,uOutsideColor,distanceFromCenter / uRadius);

  float strength = distance(gl_PointCoord, vec2(0.5));
  strength = 1.0 - strength;
  strength = pow(strength, 10.0);


  mixedColor *= strength;
  gl_FragColor = vec4(mixedColor, sin(uTime + (vRandom * 13.0)));

  #include <colorspace_fragment>
}