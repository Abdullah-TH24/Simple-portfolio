import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { gsap } from "gsap";

// Debug
// const gui = new GUI({ title: "My portfolio" });

// Improve color
THREE.ColorManagement.enabled = false;

// Texture
const textureLoader = new THREE.TextureLoader();

// Water
const waterColor = textureLoader.load("Water/WaterCOLOR.jpg");
const waterDisp = textureLoader.load("Water/WaterDISP.jpg");
const waterNormal = textureLoader.load("Water/WaterNORM.jpg");
const waterOcc = textureLoader.load("Water/WaterOCC.jpg");
const waterSpec = textureLoader.load("Water/WaterSPEC.jpg");

// Stone
const stoneColor = textureLoader.load("Stone/Stone_Floorbasecolor.jpg");
const stoneOcc = textureLoader.load("Stone/Stone_FloorambientOcclusion.jpg");
const stoneHeight = textureLoader.load("Stone/Stone_Floorheight.png");
const stoneNormal = textureLoader.load("Stone/Stone_Floornormal.jpg");
const stoneRoughness = textureLoader.load("Stone/Stone_Floorroughness.jpg");

// Lava
const lavaColor = textureLoader.load("Lava/LavaCOLOR.jpg");
const lavaDisp = textureLoader.load("Lava/LavaDISP.png");
const lavaMask = textureLoader.load("Lava/LavaMASK.jpg");
const lavaNormal = textureLoader.load("Lava/LavaNORM.jpg");
const lavaOcc = textureLoader.load("Lava/LavaOCC.jpg");
const lavaRoughness = textureLoader.load("Lava/LavaROUGH.jpg");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */

// Amdient
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);

// Directional
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

/**
 * Objects
 */

// Material
const objectsDistance = 6;

// Sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({
    map: lavaColor,
    displacementScale: 0.1,
    displacementMap: lavaDisp,
    normalMap: lavaNormal,
    aoMap: lavaOcc,
    roughness: 0.5,
    aoMapIntensity: 1,
    roughnessMap: lavaRoughness,
  })
);
sphere.position.x = -2;
sphere.position.y = 0;

// Sphere
const cone = new THREE.Mesh(
  new THREE.ConeGeometry(1.5, 2, 4),
  new THREE.MeshStandardMaterial({
    map: stoneColor,
    displacementScale: 0.1,
    displacementMap: stoneHeight,
    normalMap: stoneNormal,
    aoMap: stoneOcc,
    roughness: 0.5,
    aoMapIntensity: 1,
    roughnessMap: stoneRoughness,
  })
);
cone.position.x = 2;
cone.position.y = -objectsDistance;

// Sphere
const donat = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  new THREE.MeshPhongMaterial({
    map: waterColor,
    displacementMap: waterDisp,
    normalMap: waterNormal,
    aoMap: waterOcc,
    specularMap: waterSpec,
    aoMapIntensity: 1,
  })
);
donat.position.x = -2;
donat.position.y = -objectsDistance * 2;

scene.add(sphere, cone, donat);
const sectionObject = [sphere, cone, donat];

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.z = 4;
cameraGroup.add(camera);

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

// Render
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);

// Mouse
let cursor = {};
cursor.x = 0;
cursor.y = 0;
window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = e.clientY / sizes.height - 0.5;
});

// Scroll
let scrollY = window.scrollY;
let currentSection = 0;
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
  const newSection = Math.round(scrollY / sizes.height);
  if (newSection != currentSection) {
    currentSection = newSection;
    gsap.to(sectionObject[currentSection].rotation, {
      duration: 2,
      ease: "power2.inOut",
      x: "+=6",
      y: "+=3",
      z: "+=6",
    });
  }
});

// Resize
window.addEventListener("resize", () => {
  // Change dimensions
  if (sizes.width < 767) {
    sphere.position.x = 0;
    cone.position.x = 0;
    donat.position.x = 0;
  } else {
    sphere.position.x = -2;
    cone.position.x = 2;
    donat.position.x = -2;
  }

  // Sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Render
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1));
});

// Clock
const clock = new THREE.Clock();
let prevTime = 0;

// Animation
const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // Animations
  const daltaTime = elapsedTime - prevTime;
  prevTime = elapsedTime;
  const parallaxX = cursor.x;
  const parallaxY = cursor.y;

  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * 5 * daltaTime;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * 5 * daltaTime;

  for (const object of sectionObject) {
    object.rotation.x += daltaTime * 0.1;
    object.rotation.y += daltaTime * 0.12;
  }

  // Camera
  camera.position.y = -(scrollY / sizes.height) * objectsDistance;

  // Render
  renderer.render(scene, camera);

  // Call frames
  window.requestAnimationFrame(animate);
};

animate();
