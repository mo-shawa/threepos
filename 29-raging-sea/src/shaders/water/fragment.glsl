uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;


void main(){
  vec3 mixedColor = mix(uDepthColor,uSurfaceColor, (vElevation * uColorMultiplier) + uColorOffset);


  gl_FragColor = vec4(mixedColor, 1.0);

  #include <colorspace_fragment>
}