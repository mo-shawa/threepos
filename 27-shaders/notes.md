# Shaders

Shaders are programs that run on the GPU. They are used to render graphics and perform other operations on the GPU. Shaders are written in a language called GLSL (OpenGL Shading Language).

**Vertex Shaders** are used to transform vertices from model space to screen space. They are run once for each vertex in the input geometry.

**Fragment Shaders** are used to calculate the color of each `fragment` (sort of like a pixel). They are run once for each fragment in the output image.

## Data Types

- `Attribute` - Input to a vertex shader. It is used to pass per-vertex data to the vertex shader. <u>_It is only available in the vertex shader._</u>

  - Used for Position, Normal, Color, etc.
  - **Attribute data is unique to each vertex.**

- `Uniform` - Input to both vertex and fragment shaders. It is used to pass data from the CPU to the GPU.

  - Used for Camera position, Light position, etc.
  - **Uniform data is constant (shared) for all vertices or fragments.**

- `Varying` - Output from a vertex shader and input to a fragment shader. It is used to pass data from the vertex shader to the fragment shader.

  - Used for Color, Normal, etc.
  - **Varying data is interpolated across the primitive (triangle) and is unique to each fragment.**
  - <u>Example:</u> If you pass the color of the vertices of a triangle to the fragment shader, the color of each fragment will be interpolated from the color of the vertices. The closer the fragment is to a vertex, the closer its color will be to the color of that vertex.

## Three.js

We can use either `THREE.ShaderMaterial` or `THREE.RawShaderMaterial` to create custom shaders in Three.js.

- `THREE.ShaderMaterial` - Has some code automatically added to it by Three.js. It is easier.
- `THREE.RawShaderMaterial` - You have to write the entire shader code yourself. It is more flexible.
