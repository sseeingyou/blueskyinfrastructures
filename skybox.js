import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';

// Scene setup
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 1;

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Load skybox
const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
  'posx.jpg', // +x
  'negx.jpg', // -x
  'posy.jpg', // +y
  'negy.jpg', // -y
  'posz.jpg', // +z
  'negz.jpg'  // -z
]);
scene.background = texture;

// Scroll-based camera rotation
let targetY = 0;
let currentY = 0;

window.addEventListener('scroll', () => {
  targetY = window.scrollY;
});

function animate() {
  currentY += (targetY - currentY) * 0.05;
  camera.rotation.y = currentY * 0.001;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
