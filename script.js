const startScreen = document.getElementById('start-screen');
const scene = document.getElementById('scene');
const camera = document.getElementById('camera');
const accretionDisk = document.getElementById('accretion-disk');
const bgMusic = document.getElementById('bg-music');
const bgStars = document.getElementById('bg-stars');
const uiControls = document.getElementById('ui-controls');

const letterModal = document.getElementById('letter-modal');
const closeLetterBtn = document.getElementById('close-letter');
const letterImg = document.getElementById('letter-img');
const letterText = document.getElementById('letter-text');

const totalFotos = 15;
const mensajesFotos = [
  "Gracias por estar siempre, en las buenas y en las malas.",
  "La amistad más bonita que la vida me pudo regalar es la tuya.",
  "Eres esa hermana que la vida me permitió elegir.",
  "Nuestras locuras son mis recuerdos favoritos.",
  "Aprecio cada segundo que pasamos juntas. ¡Gracias por tanto!",
  "Una mejor amiga es la que sabe tu historia y la sigue escribiendo contigo.",
  "Inseparables es poco para describir nuestra amistad.",
  "Eres la única que me entiende sin que yo diga nada.",
  "Mejor amiga: mi confidente, mi consejera, mi familia.",
  "Por mil años más de risas y aventuras compartidas.",
  "Tu amistad es un regalo que cuido todos los días.",
  "Amo tu sonrisa en esta foto, ilumina mi día.",
  "Eres mi persona favorita en el mundo.",
  "Gracias por no dejarme sola en ninguna de mis ocurrencias.",
  "¡Te adoro, mi mejor amiga del alma! ✨💖"
];

startScreen.addEventListener('click', () => {
  startScreen.style.transform = 'scale(0)';
  startScreen.style.opacity = '0';
  
  bgMusic.play().catch(e => console.log("Audio no reproducido"));
  
  crearFondoEstrellasOptimizado();
  crearAroGirasol();
  iniciarRotacionAro();

  setTimeout(() => {
    startScreen.style.display = 'none';
    scene.classList.remove('hidden');
    uiControls.classList.remove('hidden'); 
    camera.classList.add('entry-animation');
  }, 1000);
});

// TRUCO DE OPTIMIZACIÓN: 1 solo elemento de fondo que proyecta 200 sombras en lugar de 200 elementos. CERO LAG.
function crearFondoEstrellasOptimizado() {
  let boxShadows = [];
  for (let i = 0; i < 200; i++) {
    const x = Math.floor(Math.random() * 4000 - 2000);
    const y = Math.floor(Math.random() * 4000 - 2000);
    const color = Math.random() > 0.8 ? '#ffddaa' : '#ffffff';
    boxShadows.push(`${x}px ${y}px 2px ${color}`);
  }
  bgStars.style.boxShadow = boxShadows.join(', ');
}

function crearAroGirasol() {
  const c = 22; // Constante de expansión de la espiral
  // Reducimos los puntos físicos de 3000 a 400. La nebulosa de CSS compensa visualmente, quitando el lag por completo.
  const totalPuntos = 400; 
  
  // 1. Estrellas del Disco (Espiral de Fermat)
  for (let i = 1; i <= totalPuntos; i++) {
    const star = document.createElement('div');
    star.className = 'disk-star';
    
    const angulo = i * 137.508 * (Math.PI / 180);
    const radio = 150 + c * Math.sqrt(i);
    
    const tx = Math.cos(angulo) * radio;
    const tz = Math.sin(angulo) * radio;
    const ty = (Math.random() - 0.5) * 10; 
    
    star.style.setProperty('--tx', `${tx}px`);
    star.style.setProperty('--ty', `${ty}px`);
    star.style.setProperty('--tz', `${tz}px`);
    
    const size = Math.random() * 3 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    
    const randColor = Math.random();
    if (randColor > 0.7) star.style.backgroundColor = '#ffcc88'; 
    else if (randColor > 0.4) star.style.backgroundColor = '#ffaa00'; 
    else star.style.backgroundColor = '#ffffff'; 

    star.style.boxShadow = `0 0 ${Math.random() * 15 + 10}px ${star.style.backgroundColor}`;
    accretionDisk.appendChild(star);
  }

  // 2. Las 15 Fotos incrustadas perfectamente en la espiral
  for (let i = 1; i <= totalFotos; i++) {
    const photoWrapper = document.createElement('div');
    photoWrapper.className = 'photo-container';
    
    // Repartimos equitativamente las fotos a lo largo de los puntos de la espiral
    const puntoEnEspiral = Math.floor(i * (totalPuntos / totalFotos)); 
    const angulo = puntoEnEspiral * 137.508 * (Math.PI / 180);
    const radioFoto = 150 + c * Math.sqrt(puntoEnEspiral);
    
    const tx = Math.cos(angulo) * radioFoto;
    const tz = Math.sin(angulo) * radioFoto;
    const ty = (Math.random() - 0.5) * 10; 
    
    photoWrapper.style.setProperty('--tx', `${tx}px`);
    photoWrapper.style.setProperty('--ty', `${ty}px`);
    photoWrapper.style.setProperty('--tz', `${tz}px`);
    
    photoWrapper.innerHTML = `<img src="assets/foto${i}.jpg" alt="Recuerdo">`;
    
    photoWrapper.addEventListener('click', (e) => {
      e.stopPropagation(); 
      abrirCarta(`assets/foto${i}.jpg`, mensajesFotos[i - 1]);
    });

    accretionDisk.appendChild(photoWrapper);
  }
}

// Rotación fluida, suave y constante
let diskAngle = 0;
function iniciarRotacionAro() {
  diskAngle -= 0.08; 
  document.documentElement.style.setProperty('--diskAngle', `${diskAngle}deg`);
  requestAnimationFrame(iniciarRotacionAro);
}

// Lógica de la Carta
function abrirCarta(imgSrc, mensaje) {
  letterImg.src = imgSrc;
  letterText.textContent = mensaje;
  letterModal.classList.remove('hidden');
  setTimeout(() => letterModal.classList.add('show'), 10); 
}
closeLetterBtn.addEventListener('click', () => {
  letterModal.classList.remove('show');
  setTimeout(() => letterModal.classList.add('hidden'), 500);
});
letterModal.addEventListener('click', (e) => {
  if(e.target === letterModal) {
    letterModal.classList.remove('show');
    setTimeout(() => letterModal.classList.add('hidden'), 500);
  }
});

// --- VARIABLES Y CONTROLES DE CÁMARA ---
let rotX = -25; 
let rotY = 0; 
let zoomZ = 150; 
let panX = 0;
let panY = 0;
let isDragging = false;
let startX, startY;

// Arrastrar con mouse/dedo para ROTAR
scene.addEventListener('mousedown', (e) => {
  if (camera.classList.contains('entry-animation') || e.target.closest('#ui-controls')) return; 
  isDragging = true; startX = e.clientX; startY = e.clientY;
});
scene.addEventListener('touchstart', (e) => {
  if (camera.classList.contains('entry-animation') || e.target.closest('#ui-controls')) return;
  isDragging = true; startX = e.touches[0].clientX; startY = e.touches[0].clientY;
});

const moverCamara = (x, y) => {
  if (!isDragging || camera.classList.contains('entry-animation')) return;
  const deltaX = x - startX;
  const deltaY = y - startY;
  
  rotY += deltaX * 0.4; 
  rotX -= deltaY * 0.4; 
  
  if(rotX > 85) rotX = 85; 
  if(rotX < -85) rotX = -85; 

  document.documentElement.style.setProperty('--rotX', `${rotX}deg`);
  document.documentElement.style.setProperty('--rotY', `${rotY}deg`);
  document.documentElement.style.setProperty('--invRotX', `${-rotX}deg`);
  document.documentElement.style.setProperty('--invRotY', `${-rotY}deg`);
  
  startX = x; startY = y;
};

scene.addEventListener('mousemove', (e) => moverCamara(e.clientX, e.clientY));
scene.addEventListener('touchmove', (e) => moverCamara(e.touches[0].clientX, e.touches[0].clientY));

const detenerArrastre = () => isDragging = false;
window.addEventListener('mouseup', detenerArrastre);
window.addEventListener('touchend', detenerArrastre);

// Lógica de Controles UI
const zoomSlider = document.getElementById('zoom-slider');

function aplicarZoom(nuevoZoom) {
  zoomZ = nuevoZoom;
  if (zoomZ < -2500) zoomZ = -2500; 
  if (zoomZ > 1500) zoomZ = 1500; 
  document.documentElement.style.setProperty('--zoomZ', `${zoomZ}px`);
  zoomSlider.value = zoomZ;
}

scene.addEventListener('wheel', (e) => {
  if (camera.classList.contains('entry-animation')) return;
  e.preventDefault();
  aplicarZoom(zoomZ - (e.deltaY * 2.0));
}, { passive: false });

zoomSlider.addEventListener('input', (e) => aplicarZoom(parseInt(e.target.value)));
document.getElementById('zoom-in').addEventListener('click', () => aplicarZoom(zoomZ + 300));
document.getElementById('zoom-out').addEventListener('click', () => aplicarZoom(zoomZ - 300));

const velocidadPan = 200;
function aplicarPaneo() {
  document.documentElement.style.setProperty('--panX', `${panX}px`);
  document.documentElement.style.setProperty('--panY', `${panY}px`);
}

document.getElementById('pan-up').addEventListener('click', () => { panY -= velocidadPan; aplicarPaneo(); });
document.getElementById('pan-down').addEventListener('click', () => { panY += velocidadPan; aplicarPaneo(); });
document.getElementById('pan-left').addEventListener('click', () => { panX += velocidadPan; aplicarPaneo(); });
document.getElementById('pan-right').addEventListener('click', () => { panX -= velocidadPan; aplicarPaneo(); });
