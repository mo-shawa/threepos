import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

// Shadows are very expensive, as mentioned in 15. Use minimally and bake shadows into textures wherever possible
// Considerations:
// - set the shadow camera (light camera) near and far to fit your scene
// -

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Textures
const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load("/textures/bakedShadow.jpg");
const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg");
// const moonMap = textureLoader.load("textures/moon.jpg");

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.position.set(2, 2, -1);
gui.add(directionalLight, "intensity").min(0).max(1).step(0.001);
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);

directionalLight.castShadow = true;

// adjust shadow mapsize to get higher res shadows
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
// minimize "view width" of shadow casting light makes huge difference in shadow quality
directionalLight.shadow.camera.near = 2;
directionalLight.shadow.camera.far = 5;
directionalLight.shadow.camera.top = 1;
directionalLight.shadow.camera.bottom = -1;
directionalLight.shadow.camera.left = -1;
directionalLight.shadow.camera.right = 1;
// radius is basically blur
directionalLight.shadow.radius = 30;

scene.add(directionalLight);

// can use camera helper on light cameras to figure our near and far for shadow.camera:

const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
directionalLightCameraHelper.visible = false;
scene.add(directionalLightCameraHelper);

// Spotlight
const spotlight = new THREE.SpotLight("white", 0.2, 10, Math.PI * 0.3);

spotlight.castShadow = true;
spotlight.position.set(0, 2, 2);
// Shadow config
spotlight.shadow.mapSize.width = 1024;
spotlight.shadow.mapSize.height = 1024;
spotlight.shadow.camera.fov = 30;
spotlight.shadow.camera.near = 1;
spotlight.shadow.camera.far = 5;

const spotlightCameraHelper = new THREE.CameraHelper(spotlight.shadow.camera);
spotlightCameraHelper.visible = false;

scene.add(spotlight, spotlightCameraHelper);

// PointLight
const pointLight = new THREE.PointLight("white", 0.2);

pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 4;

pointLight.position.set(-1, 1, 0);
const pointLightHelper = new THREE.CameraHelper(pointLight.shadow.camera);
pointLightHelper.visible = false;
scene.add(pointLight, pointLightHelper);

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial({
  // map: moonMap,
});
material.roughness = 0.7;
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.castShadow = true;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5; // PI is 180 degrees, plane is vertical by default
plane.position.y = -0.5; // 0 would be through the center of the sphere
plane.receiveShadow = true;

const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: "black",
    alphaMap: simpleShadow,
    transparent: true,
  })
);
sphereShadow.rotation.x = -Math.PI * 0.5;
sphereShadow.position.y = plane.position.y + 0.01;

scene.add(sphere, sphereShadow, plane);

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

renderer.shadowMap.enabled = false;
// Can change renderer's shadow map algorithm if you hate performance
// < performance <<------>> quality >
// BasicShadowMap - PCFShadowMap - PCFSoftShadowMap (+VSMShadowMap but unused generally)
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  // Update Sphere position
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));
  sphere.position.z = Math.sin(elapsedTime) * 2;
  sphere.position.x = Math.cos(elapsedTime) * 2;

  // Update Sphere Shadow
  sphereShadow.position.x = sphere.position.x;
  sphereShadow.position.z = sphere.position.z;
  sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
