uniform vec3 uInsideColor;
uniform vec3 uOutsideColor;

varying vec3 vPosition;

void main(){
  float distanceFromCenter = distance(vPosition.xz, vec2(0.0));

  vec3 mixedColor = mix(uInsideColor,uOutsideColor,distanceFromCenter * 0.4);

  gl_FragColor = vec4(mixedColor, 1.0);
}