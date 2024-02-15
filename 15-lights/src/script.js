import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 400 });

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */

// General:
// Lights are very performance intensive. Use minimum amount possible and lean on shadowmap/matcaps/baking lighting into textures where possible
// from lowest to highest performance cost:
// AmbientLight/HemisphereLight > DirectionalLight/PointLight > SpotLight/RectAreaLight
//

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

gui
  .add(ambientLight, "intensity")
  .min(0)
  .max(1)
  .step(0.001)
  .name("Ambient light intensity");

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 0, 0);
scene.add(directionalLight);

gui
  .add(directionalLight, "intensity")
  .min(0)
  .max(1)
  .step(0.001)
  .name("Directional light intensity");

// HemisphereLight: one color lighting from above, one color from below (sky color and ground color, blending near the middle)
const hemisphereLight = new THREE.HemisphereLight("blue", "green");
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  0.1,
  0xff00ff
);

scene.add(hemisphereLight, hemisphereLightHelper);

// PointLight: its a light from a point
const pointLight = new THREE.PointLight(0x0000ff, 0.9, 1, 0.5);
pointLight.position.set(1, 0.1, 1);
scene.add(pointLight);

const spotLight = new THREE.SpotLight(0x78ff00, 0.9, 10, Math.PI * 0.2, 0.1, 1);
spotLight.position.set(0, 2, 3);
scene.add(spotLight);

// can change where spotlight is facing with spotlight.target.position
// but we need to add spotlight.target to the scene
spotLight.target.position.set(3, 0, 0);
scene.add(spotLight.target);

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
