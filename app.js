// ============================================================================
// 3 YEARS ANNIVERSARY — 3D HOLOGRAM CINEMATIC EXPERIENCE (Three.js)
// ============================================================================

const MEMORIES = [
  {
    id: 0,
    chapter: 'KHỞI ĐẦU • VŨ TRỤ TÌNH YÊU',
    title: 'Trái Tim Hologram Kỷ Niệm 3 Năm',
    desc: 'Giữa hàng triệu vì sao trong vũ trụ, thật kỳ diệu khi hai quỹ đạo của chúng mình đã gặp nhau và cùng tỏa sáng suốt 1.095 ngày qua.'
  },
  {
    id: 1,
    chapter: 'KỶ NIỆM 01 • CUNG ĐƯỜNG BIỂN XANH',
    title: 'Bầu Trời Xanh & Đôi Mình Ton-sur-ton',
    desc: 'Dưới nắng vàng rực rỡ và biển xanh mênh mông, cái ôm thật chặt của em làm mọi con đường phía trước đều trở nên tuyệt đẹp.',
    photoIndex: 0
  },
  {
    id: 2,
    chapter: 'KỶ NIỆM 02 • NẮNG VÀNG TRÊN CÁT TRẮNG',
    title: 'Nét Tinh Nghịch Đáng Yêu Của Em',
    desc: 'Chiếc mũ cói, váy hồng dịu dàng và biểu cảm lè lưỡi siêu cấp đáng yêu của cô gái luôn mang lại tiếng cười cho anh mỗi ngày.',
    photoIndex: 1
  },
  {
    id: 3,
    chapter: 'KỶ NIỆM 03 • LỜI HỨA BÊN SÓNG BIỂN',
    title: 'Bàn Tay Anh Sẽ Luôn Che Chở Cho Em',
    desc: 'Dù ngoài kia sóng gió thế nào, chỉ cần nhìn thấy nụ cười rạng rỡ này của em, anh biết mình luôn có một bình yên để trở về.',
    photoIndex: 2
  },
  {
    id: 4,
    chapter: 'KỶ NIỆM 04 • PHÚT GIÂY ĐỜI THƯỜNG',
    title: 'Ánh Mắt Trong Veo & Nụ Cười Ấm Áp',
    desc: 'Chẳng cần đi đâu xa xôi, chính những khoảnh khắc đời thường nhí nhảnh bên nhau lại là mảnh ghép ngọt ngào nhất suốt 3 năm qua.',
    photoIndex: 3
  },
  {
    id: 5,
    chapter: 'KỶ NIỆM 05 • ĐỒNG HÀNH MỌI CHẶNG ĐƯỜNG',
    title: 'Cùng Nhau Băng Qua Mọi Cung Đường',
    desc: 'Đội mũ bảo hiểm lên và tiếp tục hành trình năm thứ 4, thứ 10 và mãi mãi về sau cùng nhau em nhé! Happy 3rd Anniversary ❤️',
    photoIndex: 4
  }
];

// Fallback paths if EMBEDDED_PHOTOS is not loaded
const PHOTO_PATHS = [
  'assets/photos/photo1.jpg',
  'assets/photos/photo2.jpg',
  'assets/photos/photo3.jpg',
  'assets/photos/photo4.jpg',
  'assets/photos/photo5.jpg'
];

// ============================================================================
// ROMANTIC WEB AUDIO SYNTHESIZER (Music Box + Warm Pad)
// ============================================================================
class RomanticMusicBox {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.intervalId = null;
    this.step = 0;
    // Romantic chord progression in F Major / D Minor (Canon / Love Story vibe)
    this.melody = [
      { note: 69, bass: 53, dur: 1.4 }, // A4 over F3
      { note: 72, bass: 57, dur: 1.4 }, // C5 over A3
      { note: 76, bass: 60, dur: 1.4 }, // E5 over C4
      { note: 74, bass: 52, dur: 1.4 }, // D5 over E3
      { note: 69, bass: 50, dur: 1.4 }, // A4 over D3
      { note: 72, bass: 53, dur: 1.4 }, // C5 over F3
      { note: 69, bass: 46, dur: 1.4 }, // A4 over Bb2
      { note: 67, bass: 53, dur: 1.4 }, // G4 over F3
      { note: 65, bass: 48, dur: 1.4 }, // F4 over C3
      { note: 69, bass: 52, dur: 1.4 }, // A4 over E3
      { note: 72, bass: 55, dur: 1.4 }, // C5 over G3
      { note: 77, bass: 53, dur: 1.8 }  // F5 over F3
    ];
  }

  midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  start() {
    if (this.isPlaying) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isPlaying = true;
    this.playStep();
    this.intervalId = setInterval(() => this.playStep(), 1350);
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  playStep() {
    if (!this.isPlaying || !this.ctx) return;
    const item = this.melody[this.step % this.melody.length];
    this.step++;
    this.triggerBell(this.midiToFreq(item.note), 0.14, 2.8);
    this.triggerBell(this.midiToFreq(item.bass), 0.08, 3.4);
  }

  triggerBell(freq, gainLevel, duration) {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(freq * 2, now);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.15, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainLevel, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    subOsc.connect(subGain);
    subGain.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + duration + 0.05);
    subOsc.stop(now + duration + 0.05);
  }
}

// ============================================================================
// MAIN 3D SCENE INITIALIZATION
// ============================================================================
const container = document.getElementById('webgl-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x04010a, 0.018);

const camera = new THREE.PerspectiveCamera(
  52,
  window.innerWidth / window.innerHeight,
  0.1,
  300
);
camera.position.set(0, 6.5, 22);

// Secondary cameras for 4-Sided Pyramid Hologram mode
const pyramidCam = new THREE.PerspectiveCamera(45, 1, 0.1, 200);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance'
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
container.appendChild(renderer.domElement);

// ============================================================================
// LIGHTING
// ============================================================================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
scene.add(ambientLight);

const corePinkLight = new THREE.PointLight(0xff2a85, 3.2, 35);
corePinkLight.position.set(0, 2.5, 0);
scene.add(corePinkLight);

const cyanBaseLight = new THREE.PointLight(0x00f2fe, 2.6, 30);
cyanBaseLight.position.set(0, -3.5, 0);
scene.add(cyanBaseLight);

const goldTopLight = new THREE.PointLight(0xffd166, 1.8, 30);
goldTopLight.position.set(0, 9, 4);
scene.add(goldTopLight);

// ============================================================================
// HOLOGRAM BASE PROJECTOR & ENERGY RINGS
// ============================================================================
const projectorGroup = new THREE.Group();
scene.add(projectorGroup);

// Futuristic emitter platform at y = -4.2
const baseGeo = new THREE.CylinderGeometry(4.2, 5.2, 0.45, 64);
const baseMat = new THREE.MeshStandardMaterial({
  color: 0x0b0518,
  metalness: 0.85,
  roughness: 0.2,
  emissive: 0x00f2fe,
  emissiveIntensity: 0.25
});
const baseMesh = new THREE.Mesh(baseGeo, baseMat);
baseMesh.position.y = -4.2;
projectorGroup.add(baseMesh);

// Glowing concentric hologram rings on the emitter floor
const holoRings = [];
const ringRadii = [3.6, 6.5, 9.8, 12.6];
ringRadii.forEach((radius, idx) => {
  const rGeo = new THREE.RingGeometry(radius - 0.06, radius + 0.06, 96);
  const rMat = new THREE.MeshBasicMaterial({
    color: idx % 2 === 0 ? 0x00f2fe : 0xff2a85,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: idx === 0 ? 0.85 : 0.4,
    blending: THREE.AdditiveBlending
  });
  const ring = new THREE.Mesh(rGeo, rMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = -3.92 + idx * 0.02;
  projectorGroup.add(ring);
  holoRings.push(ring);
});

// Hologram Beam Cone (Custom Shader for sci-fi scanlines & volumetric fade)
const beamVertexShader = `
  varying vec2 vUv;
  varying vec3 vPos;
  void main() {
    vUv = uv;
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const beamFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vPos;
  void main() {
    // Vertical gradient fade from emitter upwards
    float verticalFade = smoothstep(0.0, 0.2, vUv.y) * (1.0 - smoothstep(0.3, 1.0, vUv.y));
    // Moving horizontal scanlines
    float scanline = sin((vUv.y * 80.0) - uTime * 4.5) * 0.5 + 0.5;
    float pulse = sin(uTime * 2.0) * 0.15 + 0.85;
    vec3 cyan = vec3(0.0, 0.95, 1.0);
    vec3 pink = vec3(1.0, 0.16, 0.52);
    vec3 col = mix(cyan, pink, vUv.y);
    float alpha = verticalFade * (0.12 + scanline * 0.14) * pulse;
    gl_FragColor = vec4(col, alpha);
  }
`;

const beamUniforms = {
  uTime: { value: 0 }
};

const beamGeo = new THREE.CylinderGeometry(7.2, 2.8, 11.5, 64, 1, true);
const beamMat = new THREE.ShaderMaterial({
  vertexShader: beamVertexShader,
  fragmentShader: beamFragmentShader,
  uniforms: beamUniforms,
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending
});
const beamMesh = new THREE.Mesh(beamGeo, beamMat);
beamMesh.position.y = 1.6;
projectorGroup.add(beamMesh);

// ============================================================================
// CENTRAL 3D HOLOGRAPHIC HEART & PARTICLE SWARM
// ============================================================================
const centerHeartGroup = new THREE.Group();
centerHeartGroup.position.set(0, 1.4, 0);
scene.add(centerHeartGroup);

// Create extruded 3D Heart Shape
const heartShape = new THREE.Shape();
const hx = 0, hy = 0;
heartShape.moveTo(hx, hy + 0.65);
heartShape.bezierCurveTo(hx, hy + 0.65, hx - 0.15, hy + 1.25, hx - 0.85, hy + 1.25);
heartShape.bezierCurveTo(hx - 1.75, hy + 1.25, hx - 1.75, hy + 0.15, hx - 1.75, hy + 0.15);
heartShape.bezierCurveTo(hx - 1.75, hy - 0.55, hx - 1.05, hy - 1.25, hx, hy - 1.95);
heartShape.bezierCurveTo(hx + 1.05, hy - 1.25, hx + 1.75, hy - 0.55, hx + 1.75, hy + 0.15);
heartShape.bezierCurveTo(hx + 1.75, hy + 0.15, hx + 1.75, hy + 1.25, hx + 0.85, hy + 1.25);
heartShape.bezierCurveTo(hx + 0.25, hy + 1.25, hx, hy + 0.65, hx, hy + 0.65);

const extrudeSettings = {
  depth: 0.45,
  bevelEnabled: true,
  bevelSegments: 6,
  steps: 2,
  bevelSize: 0.22,
  bevelThickness: 0.22
};

const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
heartGeo.center();

// Hologram Fresnel + Scanline Shader for the Central Heart
const holoHeartMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 }
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPos;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPos;
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 2.2);
      float scan = sin(vWorldPos.y * 18.0 - uTime * 6.0) * 0.5 + 0.5;
      vec3 coreColor = vec3(1.0, 0.15, 0.55);
      vec3 rimColor = vec3(0.0, 0.95, 1.0);
      vec3 finalCol = mix(coreColor, rimColor, fresnel * 0.75) + vec3(scan * 0.18);
      float alpha = 0.55 + fresnel * 0.45;
      gl_FragColor = vec4(finalCol, alpha);
    }
  `,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

const heartMesh = new THREE.Mesh(heartGeo, holoHeartMat);
heartMesh.scale.set(0.95, 0.95, 0.95);
centerHeartGroup.add(heartMesh);

// Wireframe cage around the heart for true hologram feel
const wireHeartMat = new THREE.MeshBasicMaterial({
  color: 0xff85c0,
  wireframe: true,
  transparent: true,
  opacity: 0.22,
  blending: THREE.AdditiveBlending
});
const wireHeartMesh = new THREE.Mesh(heartGeo, wireHeartMat);
wireHeartMesh.scale.set(1.03, 1.03, 1.03);
centerHeartGroup.add(wireHeartMesh);

// Floating "3 YEARS" Orbital Rings around the Central Heart
const orbitRing1 = new THREE.Mesh(
  new THREE.TorusGeometry(2.55, 0.025, 16, 100),
  new THREE.MeshBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.7 })
);
orbitRing1.rotation.x = Math.PI / 3;
centerHeartGroup.add(orbitRing1);

const orbitRing2 = new THREE.Mesh(
  new THREE.TorusGeometry(2.9, 0.02, 16, 100),
  new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.55 })
);
orbitRing2.rotation.y = Math.PI / 4;
orbitRing2.rotation.x = -Math.PI / 3;
centerHeartGroup.add(orbitRing2);

// ============================================================================
// FLOATING 3D HOLOGRAM PHOTO FRAMES (5 COUPLE PHOTOS)
// ============================================================================
const photoFramesGroup = new THREE.Group();
scene.add(photoFramesGroup);

const photoMeshes = [];
const frameAnchors = [];
const RING_RADIUS = 9.4;

// Create a soft circular glow texture for particles
function createGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.35, 'rgba(255, 110, 199, 0.8)');
  grad.addColorStop(0.7, 'rgba(0, 242, 254, 0.3)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

// Create a floating label plate above each photo frame
function createHoloBadgeTexture(textTop, textMain) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 512, 128);

  // Glowing pill background
  ctx.fillStyle = 'rgba(8, 18, 38, 0.72)';
  ctx.strokeStyle = '#00f2fe';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(16, 16, 480, 96, 48);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#00f2fe';
  ctx.font = '600 20px Montserrat, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(textTop, 256, 52);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px Georgia, serif';
  ctx.fillText(textMain, 256, 90);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

const textureLoader = new THREE.TextureLoader();
const photoSources =
  window.EMBEDDED_PHOTOS && window.EMBEDDED_PHOTOS.length === 5
    ? window.EMBEDDED_PHOTOS
    : PHOTO_PATHS;

photoSources.forEach((src, index) => {
  const angle = (index / photoSources.length) * Math.PI * 2;
  const x = Math.sin(angle) * RING_RADIUS;
  const z = Math.cos(angle) * RING_RADIUS;

  const frameHolder = new THREE.Group();
  frameHolder.position.set(x, 1.35, z);
  // Make each frame face outward from the center so the camera can fly in front of it
  frameHolder.rotation.y = angle;
  photoFramesGroup.add(frameHolder);

  // Load couple photo texture
  const tex = textureLoader.load(src);
  tex.encoding = THREE.sRGBEncoding;

  // Main Photo Card (vertical portrait ratio matching the uploaded photos)
  const cardWidth = 3.15;
  const cardHeight = 4.25;
  const photoGeo = new THREE.PlaneGeometry(cardWidth, cardHeight);
  const photoMat = new THREE.MeshBasicMaterial({
    map: tex,
    side: THREE.DoubleSide
  });
  const photoMesh = new THREE.Mesh(photoGeo, photoMat);
  photoMesh.userData = { sceneIndex: index + 1 };
  frameHolder.add(photoMesh);
  photoMeshes.push(photoMesh);

  // Outer Neon Hologram Glass Border
  const borderGeo = new THREE.PlaneGeometry(cardWidth + 0.28, cardHeight + 0.28);
  const borderMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: beamUniforms.uTime,
      uIndex: { value: index }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uIndex;
      varying vec2 vUv;
      void main() {
        vec2 d = abs(vUv - 0.5) * 2.0;
        float edge = max(d.x, d.y);
        float glow = smoothstep(0.84, 1.0, edge);
        float wave = sin(uTime * 3.0 + uIndex * 1.3 + vUv.y * 12.0) * 0.5 + 0.5;
        vec3 cyan = vec3(0.0, 0.95, 1.0);
        vec3 pink = vec3(1.0, 0.16, 0.52);
        vec3 col = mix(cyan, pink, wave);
        gl_FragColor = vec4(col, glow * 0.9);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const borderMesh = new THREE.Mesh(borderGeo, borderMat);
  borderMesh.position.z = -0.02;
  frameHolder.add(borderMesh);

  // Corner Holo Brackets
  const pedestalRingGeo = new THREE.RingGeometry(1.4, 1.55, 48);
  const pedestalRingMat = new THREE.MeshBasicMaterial({
    color: index % 2 === 0 ? 0x00f2fe : 0xff2a85,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });
  const pedRing = new THREE.Mesh(pedestalRingGeo, pedestalRingMat);
  pedRing.rotation.x = Math.PI / 2;
  pedRing.position.y = -2.45;
  frameHolder.add(pedRing);

  // Floating Header Badge above each photo
  const memoryInfo = MEMORIES[index + 1];
  const badgeTex = createHoloBadgeTexture(
    `MEMORY 0${index + 1} • 3 YEARS`,
    memoryInfo.title.slice(0, 26)
  );
  const badgeGeo = new THREE.PlaneGeometry(2.8, 0.7);
  const badgeMat = new THREE.MeshBasicMaterial({
    map: badgeTex,
    transparent: true,
    side: THREE.DoubleSide
  });
  const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
  badgeMesh.position.set(0, cardHeight / 2 + 0.62, 0.05);
  frameHolder.add(badgeMesh);

  frameAnchors.push({
    group: frameHolder,
    angle,
    baseY: 1.35
  });
});

// ============================================================================
// STARFIELD & RISING HOLOGRAM SPARKLES
// ============================================================================
const glowTex = createGlowTexture();
const particleCount = 1400;
const pGeo = new THREE.BufferGeometry();
const pPositions = new Float32Array(particleCount * 3);
const pColors = new Float32Array(particleCount * 3);
const pSpeeds = new Float32Array(particleCount);

const colorPalette = [
  new THREE.Color(0xff2a85),
  new THREE.Color(0x00f2fe),
  new THREE.Color(0xffd166),
  new THREE.Color(0xffffff)
];

for (let i = 0; i < particleCount; i++) {
  const r = 2.0 + Math.random() * 34.0;
  const theta = Math.random() * Math.PI * 2;
  pPositions[i * 3] = Math.cos(theta) * r;
  pPositions[i * 3 + 1] = (Math.random() - 0.3) * 24;
  pPositions[i * 3 + 2] = Math.sin(theta) * r;

  const c = colorPalette[i % colorPalette.length];
  pColors[i * 3] = c.r;
  pColors[i * 3 + 1] = c.g;
  pColors[i * 3 + 2] = c.b;

  pSpeeds[i] = 0.4 + Math.random() * 1.2;
}

pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

const pMat = new THREE.PointsMaterial({
  size: 0.34,
  map: glowTex,
  vertexColors: true,
  transparent: true,
  opacity: 0.85,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});

const particleSystem = new THREE.Points(pGeo, pMat);
scene.add(particleSystem);

// ============================================================================
// CINEMATIC CAMERA DIRECTOR & ORBIT INTERACTION
// ============================================================================
let currentSceneIndex = 0; // 0 = overview, 1..5 = couple photos
let autoPlay = true;
let autoPlayTimer = 0;
const SCENE_DURATION = 7.5; // seconds per photo in movie mode
let isPyramidMode = false;

const targetCameraPos = new THREE.Vector3(0, 6.2, 21.5);
const targetLookAt = new THREE.Vector3(0, 1.4, 0);
const currentLookAt = new THREE.Vector3(0, 1.4, 0);

// User manual drag offset
let isDragging = false;
let prevPointer = { x: 0, y: 0 };
let userYawOffset = 0;
let userPitchOffset = 0;

function setScene(index) {
  currentSceneIndex = index;
  autoPlayTimer = 0;
  userYawOffset = 0;
  userPitchOffset = 0;

  // Update UI Timeline Dots
  document.querySelectorAll('.scene-dot').forEach((btn) => {
    const idx = parseInt(btn.getAttribute('data-scene'), 10);
    btn.classList.toggle('active', idx === index);
  });

  // Update Story Caption
  const info = MEMORIES[index] || MEMORIES[0];
  const captionBox = document.getElementById('captionBox');
  captionBox.style.transform = 'translateY(8px)';
  captionBox.style.opacity = '0.4';

  setTimeout(() => {
    document.getElementById('sceneChapter').textContent = info.chapter;
    document.getElementById('sceneTitle').textContent = info.title;
    document.getElementById('sceneDesc').textContent = info.desc;
    captionBox.style.transform = 'translateY(0)';
    captionBox.style.opacity = '1';
  }, 180);
}

function computeCameraTargets(elapsedTime) {
  if (currentSceneIndex === 0) {
    // Slow cinematic orbit around the entire 3D universe
    const orbitAngle = elapsedTime * 0.18 + userYawOffset;
    const radius = 20.5;
    targetCameraPos.set(
      Math.sin(orbitAngle) * radius,
      5.2 + Math.sin(elapsedTime * 0.4) * 1.2 + userPitchOffset * 4,
      Math.cos(orbitAngle) * radius
    );
    targetLookAt.set(0, 1.3, 0);
  } else {
    // Fly directly in front of the selected couple photo frame
    const anchor = frameAnchors[currentSceneIndex - 1];
    if (anchor) {
      const worldAngle = anchor.angle + photoFramesGroup.rotation.y + userYawOffset * 0.5;
      const camDist = RING_RADIUS + 5.6;
      const subtleSway = Math.sin(elapsedTime * 0.9) * 0.35;

      targetCameraPos.set(
        Math.sin(worldAngle + subtleSway * 0.04) * camDist,
        anchor.baseY + 0.15 + userPitchOffset * 2.5,
        Math.cos(worldAngle + subtleSway * 0.04) * camDist
      );

      targetLookAt.set(
        Math.sin(anchor.angle + photoFramesGroup.rotation.y) * RING_RADIUS,
        anchor.baseY + 0.1,
        Math.cos(anchor.angle + photoFramesGroup.rotation.y) * RING_RADIUS
      );
    }
  }
}

// Pointer drag & click raycasting on 3D photos
const raycaster = new THREE.Raycaster();
const pointerNDC = new THREE.Vector2();

window.addEventListener('pointerdown', (e) => {
  if (e.target.closest('button') || e.target.closest('.modal-card')) return;
  isDragging = true;
  prevPointer.x = e.clientX;
  prevPointer.y = e.clientY;
});

window.addEventListener('pointermove', (e) => {
  if (!isDragging) return;
  const dx = e.clientX - prevPointer.x;
  const dy = e.clientY - prevPointer.y;
  prevPointer.x = e.clientX;
  prevPointer.y = e.clientY;
  userYawOffset -= dx * 0.005;
  userPitchOffset = Math.max(-0.8, Math.min(0.8, userPitchOffset + dy * 0.004));
});

window.addEventListener('pointerup', (e) => {
  if (!isDragging) return;
  isDragging = false;
});

window.addEventListener('click', (e) => {
  if (e.target.closest('button') || e.target.closest('.modal-card') || isPyramidMode) return;
  pointerNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointerNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointerNDC, camera);
  const hits = raycaster.intersectObjects(photoMeshes);
  if (hits.length > 0) {
    const clickedScene = hits[0].object.userData.sceneIndex;
    if (clickedScene) {
      setScene(clickedScene);
    }
  }
});

// ============================================================================
// 4-SIDED PYRAMID HOLOGRAM RENDERER (TOP, BOTTOM, LEFT, RIGHT VIEWPORTS)
// ============================================================================
function renderPyramidHologramMode() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const minDim = Math.min(w, h);
  const quadSize = Math.floor(minDim * 0.34);
  const centerGap = Math.floor(minDim * 0.11); // Space in the middle for the pyramid apex

  const cx = Math.floor(w / 2);
  const cy = Math.floor(h / 2);

  renderer.setScissorTest(true);
  renderer.setClearColor(0x000000, 1);
  renderer.setViewport(0, 0, w, h);
  renderer.setScissor(0, 0, w, h);
  renderer.clear();

  // Hide background fog & floor projector rings so only the pure hologram floats in black space
  projectorGroup.visible = false;

  // Focus on either the central heart + active photo or cycle smoothly
  const lookTarget = new THREE.Vector3(0, 1.4, 0);
  const camRadius = 15.5;

  // 4 quadrants around the center crosshair: Top, Bottom, Left, Right
  const views = [
    {
      // TOP quadrant (upside down relative to screen so it reflects right-side up)
      x: cx - Math.floor(quadSize / 2),
      y: cy + centerGap,
      up: [0, -1, 0],
      angleOffset: 0
    },
    {
      // BOTTOM quadrant
      x: cx - Math.floor(quadSize / 2),
      y: cy - centerGap - quadSize,
      up: [0, 1, 0],
      angleOffset: Math.PI
    },
    {
      // LEFT quadrant
      x: cx - centerGap - quadSize,
      y: cy - Math.floor(quadSize / 2),
      up: [1, 0, 0],
      angleOffset: -Math.PI / 2
    },
    {
      // RIGHT quadrant
      x: cx + centerGap,
      y: cy - Math.floor(quadSize / 2),
      up: [-1, 0, 0],
      angleOffset: Math.PI / 2
    }
  ];

  views.forEach((v) => {
    renderer.setViewport(v.x, v.y, quadSize, quadSize);
    renderer.setScissor(v.x, v.y, quadSize, quadSize);

    pyramidCam.aspect = 1;
    pyramidCam.updateProjectionMatrix();
    pyramidCam.position.set(
      Math.sin(v.angleOffset) * camRadius,
      1.4,
      Math.cos(v.angleOffset) * camRadius
    );
    pyramidCam.up.set(v.up[0], v.up[1], v.up[2]);
    pyramidCam.lookAt(lookTarget);

    renderer.render(scene, pyramidCam);
  });

  projectorGroup.visible = true;
  renderer.setScissorTest(false);
}

// ============================================================================
// ANIMATION LOOP
// ============================================================================
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  // Update Hologram Shaders
  beamUniforms.uTime.value = elapsed;
  holoHeartMat.uniforms.uTime.value = elapsed;

  // Pulse and rotate Central 3D Heart
  const heartBeat = 0.95 + Math.sin(elapsed * 4.2) * 0.06 + Math.pow(Math.sin(elapsed * 2.1), 6) * 0.08;
  heartMesh.scale.set(heartBeat, heartBeat, heartBeat);
  centerHeartGroup.rotation.y = elapsed * 0.65;
  orbitRing1.rotation.z = elapsed * 0.8;
  orbitRing2.rotation.x = elapsed * 0.6;

  // Gently rotate the hologram rings on the floor
  holoRings.forEach((r, idx) => {
    r.rotation.z = elapsed * (idx % 2 === 0 ? 0.3 : -0.25);
  });

  // Rotate photo carousel slowly when in overview or Pyramid Mode
  if (currentSceneIndex === 0 || isPyramidMode) {
    photoFramesGroup.rotation.y += delta * 0.22;
  }

  // Float individual photo frames up and down smoothly
  frameAnchors.forEach((item, idx) => {
    item.group.position.y = item.baseY + Math.sin(elapsed * 1.8 + idx * 1.2) * 0.22;
  });

  // Animate rising hologram particles
  const posAttr = pGeo.attributes.position;
  for (let i = 0; i < particleCount; i++) {
    let py = posAttr.getY(i);
    py += pSpeeds[i] * delta;
    if (py > 14) py = -5;
    posAttr.setY(i, py);
  }
  posAttr.needsUpdate = true;
  particleSystem.rotation.y = elapsed * 0.05;

  // Auto-play Director progression
  if (autoPlay && !isPyramidMode) {
    autoPlayTimer += delta;
    if (autoPlayTimer >= SCENE_DURATION) {
      const nextScene = (currentSceneIndex + 1) % MEMORIES.length;
      setScene(nextScene);
    }
  }

  // Render either 4-Sided Pyramid Mode or Fullscreen Cinematic Mode
  if (isPyramidMode) {
    renderPyramidHologramMode();
  } else {
    computeCameraTargets(elapsed);
    camera.position.lerp(targetCameraPos, 0.045);
    currentLookAt.lerp(targetLookAt, 0.06);
    camera.lookAt(currentLookAt);

    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }
}

animate();

// ============================================================================
// UI EVENT LISTENERS & LIVE COUNTER
// ============================================================================
const musicBox = new RomanticMusicBox();

const introScreen = document.getElementById('introScreen');
const startBtn = document.getElementById('startExperienceBtn');
const btnAutoPlay = document.getElementById('btnAutoPlay');
const btnPyramidMode = document.getElementById('btnPyramidMode');
const btnExitPyramid = document.getElementById('btnExitPyramid');
const btnToggleCrosshair = document.getElementById('btnToggleCrosshair');
const btnAudio = document.getElementById('btnAudio');
const btnLoveLetter = document.getElementById('btnLoveLetter');
const btnPyramidGuide = document.getElementById('btnPyramidGuide');
const btnActivatePyramidFromGuide = document.getElementById('btnActivatePyramidFromGuide');

startBtn.addEventListener('click', () => {
  introScreen.classList.add('hidden');
  musicBox.start();
  setScene(1); // Fly directly into the first couple photo after intro!
});

btnAutoPlay.addEventListener('click', () => {
  autoPlay = !autoPlay;
  btnAutoPlay.classList.toggle('active', autoPlay);
  btnAutoPlay.querySelector('.btn-text').textContent = autoPlay
    ? 'Đạo Diễn 3D: BẬT'
    : 'Đạo Diễn 3D: TẮT';
});

function setPyramidMode(active) {
  isPyramidMode = active;
  document.body.classList.toggle('pyramid-active', active);
}

btnPyramidMode.addEventListener('click', () => setPyramidMode(true));
btnExitPyramid.addEventListener('click', () => setPyramidMode(false));

btnToggleCrosshair.addEventListener('click', () => {
  const cross = document.getElementById('pyramidGuideCross');
  cross.style.opacity = cross.style.opacity === '0' ? '1' : '0';
});

btnAudio.addEventListener('click', () => {
  const playing = musicBox.toggle();
  btnAudio.classList.toggle('active', playing);
  btnAudio.querySelector('.btn-text').textContent = playing
    ? 'Nhạc Nền: BẬT'
    : 'Nhạc Nền: TẮT';
});

// Timeline buttons
document.querySelectorAll('.scene-dot').forEach((btn) => {
  btn.addEventListener('click', () => {
    const idx = parseInt(btn.getAttribute('data-scene'), 10);
    setScene(idx);
  });
});

// Modals
btnLoveLetter.addEventListener('click', () => {
  document.getElementById('letterModal').classList.add('open');
});

btnPyramidGuide.addEventListener('click', () => {
  document.getElementById('guideModal').classList.add('open');
});

btnActivatePyramidFromGuide.addEventListener('click', () => {
  document.getElementById('guideModal').classList.remove('open');
  setPyramidMode(true);
});

document.querySelectorAll('.modal-close').forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-close');
    document.getElementById(targetId).classList.remove('open');
  });
});

// Live 3-Year Second Counter
let extraSeconds = 0;
setInterval(() => {
  extraSeconds++;
  const totalSeconds = 1095 * 86400 + extraSeconds;
  const formattedSec = totalSeconds.toLocaleString('vi-VN');
  const el = document.getElementById('liveCounter');
  if (el) {
    el.textContent = `3 Năm • 1.095 Ngày • ${formattedSec} Giây Yêu Thương`;
  }
}, 1000);

// Responsive resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
