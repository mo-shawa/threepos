#define PI 3.1415926535897932384
varying vec2 vUv;
uniform float uTime;


float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main()
{
    // // Pattern 1
    // gl_FragColor = vec4( vUv, 1, 1 );

    // // Pattern 2
    // gl_FragColor = vec4( vUv, 0, 1 );

    // // Bonus pattern (just looks cool)
    // gl_FragColor = vec4( vUv, 0.5, 0.7 );

    // // Pattern 3
    // gl_FragColor = vec4( vUv.xxx, 1 ); // can also pass in vec3(vUv.x)

    // // Pattern 4
    // float strength = vUv.y;
    // gl_FragColor = vec4( vec3(strength), 1 );

    // // Pattern 5
    // float strength = 1.0 - vUv.y;
    // gl_FragColor = vec4( vec3(strength), 1 );

    // // Pattern 6
    // float strength = vUv.y * 10.0;
    // gl_FragColor = vec4( vec3(strength), 1 );

    // // Pattern 7
    // float strength = mod(vUv.y * 10.0, 1.0); // mod is `%` in JS: remainder function 
    // gl_FragColor = vec4( vec3(strength), 1 );

    // // Pattern 8
    // float strength = mod(vUv.y * 10.0, 1.0);
    
    // // A few ways to do this one:

    // // // ternary operator (yes it exists in GLSL. lit)
    // // strength = strength > 0.5 ? 1.0 : 0.0;

    // // // if statement - can also skip the curly braces
    // // // generally bad for performance
    // // if (strength > 0.5) strength = 1.0;
    // // else strength = 0.0;
    
    // // step function
    // strength = step(0.5, strength);

    // gl_FragColor = vec4( vec3(strength), 1 );
    
    // // Pattern 9
    // float strength = mod(vUv.y * 10.0, 1.0);
    
    // strength = step(0.8, strength);

    // gl_FragColor = vec4( vec3(strength), 1 );
    
    // // Pattern 10
    // float strength = mod(vUv.x * 10.0, 1.0);
    
    // strength = step(0.8, strength);

    // gl_FragColor = vec4( vec3(strength), 1 );
    
    // // Pattern 11
    // float strength = step(0.8, mod((vUv.x) * 10.0, 1.0));
    // strength += step(0.8, mod((vUv.y) * 10.0, 1.0));

    // gl_FragColor = vec4( vec3(strength), 1 );

    // // Pattern 12
    // float strength = step(0.8, mod((vUv.x) * 10.0, 1.0));
    // strength *= step(0.8, mod((vUv.y) * 10.0, 1.0));

    // gl_FragColor = vec4( vec3(strength), 1 );

    // // Pattern 13
    // float strength = step(0.4, mod((vUv.x) * 10.0, 1.0));
    // strength *= step(0.8, mod((vUv.y) * 10.0, 1.0));

    // gl_FragColor = vec4( vec3(strength), 1 );

    // // Pattern 14
    // float barX = step(0.4, mod((vUv.x) * 10.0, 1.0));
    // barX *= step(0.8, mod((vUv.y) * 10.0, 1.0));

    // float barY = step(0.4, mod(vUv.y * 10.0, 1.0));
    // barY *= step(0.8, mod(vUv.x * 10.0, 1.0));

    // float strength = barX + barY;
    // gl_FragColor += vec4( vec3(strength), 1 );

    // // Pattern 15
    // float barX = step(0.4, mod((vUv.x) * 10.0, 1.0));
    // barX *= step(0.8, mod((vUv.y) * 10.0 + 0.2, 1.0));

    // float barY = step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0));
    // barY *= step(0.4, mod(vUv.y * 10.0 , 1.0));

    // float strength = barX + barY;
    // gl_FragColor += vec4( vec3(strength), 1 );
    
    // // Pattern 16
    // float strength = abs(vUv.x - 0.5);
    // gl_FragColor += vec4( vec3(strength), 1 );
    
    // // Pattern 17
    // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    // gl_FragColor += vec4( vec3(strength), 1 );
    
    // // Pattern 18
    // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    // gl_FragColor += vec4( vec3(strength), 1 );
    
    // // Pattern 19
    // float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // gl_FragColor += vec4( vec3(strength), 1 );
    
    // // Pattern 20
    // float square1 = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // float square2 = 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

    // float strength = square1 * square2;
    // gl_FragColor += vec4( vec3(strength), 1 );
    
    // // Pattern 21
    // float strength = floor(vUv.x * 10.0) / 10.0 ; // so cool
    // /* `round` and `floor` must return 0 or 1, depending on value <> 0.5, but we need to "round" 
    // to the nearest 0.1
    // What we do is multiple uv.x (which is 0..1) by 10, so `floor` gives us 0, 1, 2 etc., and we simply 
    // divide by 10 after the flooring which gives 0.1, 0.2, 0.3 etc
    // */
    // gl_FragColor += vec4( vec3(strength), 1 );
    
    // // Pattern 22
    // float gradientX = floor(vUv.x * 10.0) / 10.0;
    // float gradientY = floor(vUv.y * 10.0) / 10.0;

    // float strength = gradientX * gradientY;
    // gl_FragColor += vec4( vec3(strength), 1 );
    
    // // Pattern 23
    // float strength = random(vUv);
    // gl_FragColor += vec4( vec3(strength), 1 );
    
    // // Pattern 24
    // float gradientX = floor(vUv.x * 10.0) / 10.0;
    // float gradientY = floor(vUv.y * 10.0) / 10.0;

    // float strength = random(vec2(gradientX,gradientY));
    // gl_FragColor += vec4( vec3(strength), 1 );
    
    // // Pattern 25
    // float gradientX = floor(vUv.x * 10.0) / 10.0;
    // float gradientY = floor((vUv.y + vUv.x * 0.5) * 10.0) / 10.0;

    // float strength = random(vec2(gradientX,gradientY));
    // gl_FragColor += vec4( vec3(strength), 1 );
    
    // // Pattern 26

    // float strength = length(vUv);
    // gl_FragColor += vec4( vec3(strength), 1 );
    
    // // Pattern 27
    
    // // couple of ways to do this
    // // float strength = length(vUv - 0.5); // offset the uv from prev example

    // /* 
    // calculate distance between current uv and a given point
    // seems way more intuitive
    // */
    // float strength = distance(vUv, vec2(0.5));

    // gl_FragColor += vec4( vec3(strength), 1 );
    
    // // Pattern 28    
    // float strength = 1.0 - distance(vUv, vec2(0.5));

    // gl_FragColor += vec4( vec3(strength), 1 );
    
    // // Pattern 29
    // float strength = 0.02 / distance(vUv, vec2(0.5));
    
    // gl_FragColor += vec4( vec3(strength), 1 );
    
    // // Pattern 30
    // vec2 lightUv = vec2(
    //     vUv.x * 0.1 + 0.45, 
    //     vUv.y * 0.5 + 0.25
    // );
    // float strength = 0.02 / distance(lightUv, vec2(0.5));
    
    // gl_FragColor += vec4( vec3(strength), 1 );
    
    // // Pattern 31
    // vec2 lightUvX = vec2(
    //     vUv.x * 0.1 + 0.45, 
    //     vUv.y * 0.5 + 0.25
    // );

    // float lightX = 0.02 / distance(lightUvX, vec2(0.5));
    // vec2 lightUvY = vec2(
    //     vUv.y * 0.1 + 0.45, 
    //     vUv.x * 0.5 + 0.25
    // );

    // float lightY = 0.02 / distance(lightUvY, vec2(0.5));

    // float strength = (lightX + lightY )* 0.5;
    
    // gl_FragColor += vec4( vec3(strength), 1 );
    
    // // Pattern 32
    // vec2 rotatedUv = rotate(vUv, PI / 4.0, vec2(0.5));

    // vec2 lightUvX = vec2(
    //     rotatedUv.x * 0.1 + 0.45, 
    //     rotatedUv.y * 0.5 + 0.25
    // );

    // float lightX = 0.02 / distance(lightUvX, vec2(0.5));
    // vec2 lightUvY = vec2(
    //     rotatedUv.y * 0.1 + 0.45, 
    //     rotatedUv.x * 0.5 + 0.25
    // );

    // float lightY = 0.02 / distance(lightUvY, vec2(0.5));

    // float strength = (lightX + lightY )* 0.5;
    
    // gl_FragColor += vec4( vec3(strength), 1 );
    
    // // Pattern 33

    // float dist = distance(vUv, vec2(0.5));

    // float strength = step(0.25, dist );
    
    // gl_FragColor += vec4( vec3(strength), 1 );
    
    // // Pattern 34

    // float dist = distance( vUv, vec2(0.5));

    // float strength = abs(dist - 0.25 );
    
    // gl_FragColor += vec4( vec3(strength), 1 );
    
    // // Pattern 35

    // float dist = distance( vUv, vec2(0.5));

    // float strength = step(0.01, abs(dist - 0.25 ));
    
    // gl_FragColor += vec4( vec3(strength), 1 );
    
    // // Pattern 36

    // float dist = distance( vUv, vec2(0.5));

    // float strength = 1.0 - step(0.01, abs(dist - 0.25 ));
    
    // gl_FragColor += vec4( vec3(strength), 1 );
    
    // // Pattern 37
    // vec2 wavyUv = vec2(vUv.x, vUv.y + sin(vUv.x * 30.0) * 0.1);

    // float dist = distance( wavyUv, vec2(0.5));

    // float strength = 1.0 - step(0.01, abs(dist - 0.25 ));
    
    // gl_FragColor = vec4( vec3(strength), 1 );
    
    // // Pattern 38
    // vec2 wavyUv = vec2(
    //     vUv.x + sin(vUv.y * 30.0) * 0.1, 
    //     vUv.y + sin(vUv.x * 30.0) * 0.1
    // );

    // float dist = distance( wavyUv, vec2(0.5));

    // float strength = 1.0 - step(0.01, abs(dist - 0.25 ));
    
    // gl_FragColor = vec4( vec3(strength), 1 );
    
    // // Pattern 39
    // vec2 wavyUv = vec2(
    //     vUv.x + sin(vUv.y * 100.0) * 0.1, 
    //     vUv.y + sin(vUv.x * 100.0) * 0.1
    // );

    // float dist = distance( wavyUv, vec2(0.5));

    // float strength = 1.0 - step(0.01, abs(dist - 0.25 ));
    
    // gl_FragColor = vec4( vec3(strength), 1 );
    
    // // Pattern 40

    // // float angle = vUv.x / vUv.y; // accidentally works ?

    // float angle = atan(vUv.x, vUv.y);

    // float strength = angle;
    
    // gl_FragColor = vec4( vec3(strength), 1 );
    
    // // Pattern 41

    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);

    // float strength = angle;
    
    // gl_FragColor = vec4( vec3(strength), 1 );
    
    // // Pattern 42

    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);

    // angle /= PI * 2.0;
    // angle += 0.5;


    // float strength = angle;
    
    // gl_FragColor = vec4( vec3(strength), 1 );
    
    // // Pattern 43

    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // angle *= 20.0; // looks sick if u bump it way up 

    // angle = mod(angle, 1.0);

    // float strength = angle;
    
    // gl_FragColor = vec4( vec3(strength), 1 );
    
    // // Pattern 44

    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;

    // float strength = sin(angle * 100.0) ;
    
    // gl_FragColor = vec4( vec3(strength), 1 );
    
    // // Pattern 45
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;

    // float sinusoid = sin(angle * 100.0);

    // float radius = 0.25 + (sinusoid * 0.02);

    // float dist = abs(distance(vUv, vec2(0.5)) - radius);

    // float strength = 1.0 - step(0.01, dist);
    
    // gl_FragColor = vec4( vec3(strength), 1 );
    
    // // Pattern 46
    // float strength = cnoise(vUv * 10.0);
    
    // gl_FragColor = vec4( vec3(strength), 1 );
    
    // // Pattern 47
    // float strength = cnoise(vUv * 10.0);
    // strength = step(0.0, strength);
    
    // gl_FragColor = vec4( vec3(strength), 1 );
    
    // // Pattern 48
    // float strength = cnoise(vUv * 10.0);
    // strength = 1.0 - abs(strength);
    
    // gl_FragColor = vec4( vec3(strength), 1 );
    
    // // Pattern 49
    // float strength = cnoise(vUv * 10.0);
    // strength = sin(strength * 20.0);

    // gl_FragColor = vec4( vec3(strength), 1 );
    
    // Pattern 50
    float strength = cnoise(vUv * 20.0) + uTime/7.0;
    strength = sin(strength * 20.0);
    strength = step(0.9, strength);
    
    // clamp the strength
    strength = clamp(strength, 0.0, 1.0);

    // Colors
    vec3 blackColor = vec3(0.0);
    vec3 uvColor = vec3(vUv, 1.0);

    vec3 shiftingColor = mix(uvColor * 1.0, vec3(sin(uTime), sin(uTime), 1.0), 0.7);

    vec3 mixedColor = mix(blackColor, shiftingColor, strength);


    gl_FragColor = vec4( mixedColor, 1 );
}

