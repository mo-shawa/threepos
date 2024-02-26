// uniform mat4 modelMatrix; // apply transformations relative to the mesh
// /* e.g. when you set in JS mesh.position.x, mesh.position is transformed internally into a model matrix
//  and made available in the vertex shader as `modelMatrix` */
// uniform mat4 viewMatrix; // apply transformations relative to the camera
// /* e.g. set camera.position in JS => transformed by three into viewMatrix and available as uniform */
// uniform mat4 projectionMatrix; // transform the coordinates into clip space whatever the **** that is
// /* I don't have an example because I don't understand */
uniform vec2 uFrequency;
uniform float uTime;

// attribute vec3 position;
/*
Provided by three.js. vec3 of x, y, z of vertices 
Is an attribute, so is always unique per vertex
*/
attribute float aRandom; // our custom attribute
// attribute vec2 uv;

varying float vRandom;
varying vec2 vUv;
varying float vElevation;

void main(){
  vec4 modelPosition = modelMatrix * vec4(position, 1);
  float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.05;
  elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.05;
  
  modelPosition.z += elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;


  /* type: vec4
    gl_Position already exists, we are simply reassigning to it
    must multiply mat4 's by vec4 since gl_Position is a vec4 value
  */
  gl_Position = projectedPosition; 
  // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0); 
  // _________________[3]_____________[2]___________[1]________[0]__________________________
  // The order in which the matrix transforms are applied MATTERS. read from right to left 

  vRandom = aRandom;
  vUv = uv;
  vElevation = elevation;
}