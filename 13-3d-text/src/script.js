import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// axes helper
// scene.add(new THREE.AxesHelper());

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapMaterial = textureLoader.load("/textures/matcaps/8.png");

// Fonts:
// Can use font format called "typeface"
// can convert fonts to typeface with facetype.js, or use the fonts given in:
// "node_modules/three/examples/fonts/fontname.typeface.json"
// best to copy them out and place them in static folder
// why does three js have this demonic import structure I will never know

const fontLoader = new FontLoader();
// fontLoader doesn't return anything to the variable, unlike textureLoader
// we must use the callback to do something with the font
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  console.log(font);
  const textGeometry = new TextGeometry("shawa.dev", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5, // less segments => less triangles => ++performance
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 3, // same here ^
  });

  textGeometry.computeBoundingBox();
  console.log(textGeometry.boundingBox);
  // bounding box shows why we stick out past the origin of the helper axes => the bevel is edging past 0 slightly even though mesh should be dead center

  textGeometry.center();
  // we can center the geometry easily with geometry.center(), which is doing this behind the scenes:

  /* textGeometry.translate(
    -(textGeometry.boundingBox.max.x - 0.02) / 2, // -0.02 to account for bevels
    -(textGeometry.boundingBox.max.y - 0.02) / 2,
    -(textGeometry.boundingBox.max.z - 0.02) / 2
  ); */

  const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapMaterial });
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);

  console.time("donuts");
  const donutGeometry = new THREE.TorusGeometry(0.2, 0.1, 20, 20);
  const donutMaterial = new THREE.MeshNormalMaterial({ flatShading: true });
  const randomPosition = () => {
    return (Math.random() - 0.5) * 50;
  };

  for (let i = 0; i < 4000; i++) {
    const donut = new THREE.Mesh(donutGeometry, donutMaterial);

    donut.position.set(randomPosition(), randomPosition(), randomPosition());

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const donutScale = Math.random();

    donut.scale.set(donutScale, donutScale, donutScale);

    scene.add(donut);
  }

  console.timeEnd("donuts");
});

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
  0.5,
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
  camera.position.x = Math.sin(elapsedTime) * 3;
  camera.lookAt(0, 0, 0);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
