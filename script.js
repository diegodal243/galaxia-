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
  
  crearFondoEstrellas();
  crearAroDeEstrellasYFotos();
  iniciarRotacionAro();

  setTimeout(() => {
    startScreen.style.display = 'none';
    scene.classList.remove('hidden');
    uiControls.classList.remove('hidden'); // Mostrar los botones
    camera.classList.add('entry-animation');
  }, 1000);
});

function crearFondoEstrellas() {
  for (let i = 0; i < 300; i++) {
    const star = document.createElement('div');
    star.className = 'bg-star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    const size = Math.random() * 3;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    bgStars.appendChild(star);
  }
}

function crearAroDeEstrellasYFotos() {
  const radioInterno = 180; 
  const radioExterno = 1500; // Lo hicimos AÚN MÁS GRANDE para poder navegar por él
  
  // 1. Crear 3000 estrellas para que se vea súper denso
  for (let i = 0; i < 3000; i++) {
    const star = document.createElement('div');
    star.className = 'disk-star';
    
    const angulo = Math.random() * Math.PI * 2;
    const radio = radioInterno + Math.pow(Math.random(), 2) * (radioExterno - radioInterno);
    
    const tx = Math.cos(angulo) * radio;
    const tz = Math.sin(angulo) * radio;
    const ty = (Math.random() - 0.5) * 20; 
    
    star.style.setProperty('--tx', `${tx}px`);
    star.style.setProperty('--ty', `${ty}px`);
    star.style.setProperty('--tz', `${tz}px`);
    
    const size = Math.random() * 3;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    
    const randColor = Math.random();
    if (randColor > 0.85) star.style.backgroundColor = '#ffcc88'; 
    else if (randColor > 0.70) star.style.backgroundColor = '#aaddff'; 
    else star.style.backgroundColor = '#ffffff'; 

    star.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px ${star.style.backgroundColor}`;
    accretionDisk.appendChild(star);
  }

  // 2. FOTOS PEQUEÑAS MEZCLADAS EN LAS ESTRELLAS
  for (let i = 0; i < totalFotos; i++) {
    const photoWrapper = document.createElement('div');
    photoWrapper.className = 'photo-container';
    
    const anguloBase = (i / totalFotos) * Math.PI * 2;
    const angulo = anguloBase + (Math.random() * 0.3 - 0.15); 
    
    // Distribuimos las fotos a lo largo de todo el inmenso aro
    const radioFoto = radioInterno + 100 + Math.random() * (radioExterno - radioInterno - 300); 
    
    const tx = Math.cos(angulo) * radioFoto;
    const tz = Math.sin(angulo) * radioFoto;
    const ty = (Math.random() - 0.5) * 15; // Mismo plano que las estrellas
    
    photoWrapper.style.setProperty('--tx', `${tx}px`);
    photoWrapper.style.setProperty('--ty', `${ty}px`);
    photoWrapper.style.setProperty('--tz', `${tz}px`);
    
    photoWrapper.innerHTML = `<img src="assets/foto${i + 1}.jpg" alt="Recuerdo">`;
    
    photoWrapper.addEventListener('click', (e) => {
      e.stopPropagation(); 
      abrirCarta(`assets/foto${i + 1}.jpg`, mensajesFotos[i]);
    });

    accretionDisk.appendChild(photoWrapper);
  }
}

let diskAngle = 0;
function iniciarRotacionAro() {
  diskAngle += 0.03; // Aún más lento por lo inmenso que es
  document.documentElement.style.setProperty('--diskAngle', `${diskAngle}deg`);
  requestAnimationFrame(iniciarRotacionAro);
}

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

// --- VARIABLES DE NAVEGACIÓN (ROTACIÓN, ZOOM Y PANEO) ---
let rotX = -25; 
let rotY = 0; 
let zoomZ = 100; 
let panX = 0;
let panY = 0;
let isDragging = false;
let startX, startY;

// Arrastrar con ratón para ROTAR la cámara
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
  
  rotY += deltaX * 0.3; 
  rotX -= deltaY * 0.3; 
  
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

// --- LÓGICA DE LOS BOTONES DE LA INTERFAZ ---

// Zoom con Rueda o Slider
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
  aplicarZoom(zoomZ - (e.deltaY * 1.5));
}, { passive: false });

zoomSlider.addEventListener('input', (e) => aplicarZoom(parseInt(e.target.value)));
document.getElementById('zoom-in').addEventListener('click', () => aplicarZoom(zoomZ + 200));
document.getElementById('zoom-out').addEventListener('click', () => aplicarZoom(zoomZ - 200));

// Paneo (Moverse de un lado a otro en la galaxia)
const velocidadPan = 150;

function aplicarPaneo() {
  document.documentElement.style.setProperty('--panX', `${panX}px`);
  document.documentElement.style.setProperty('--panY', `${panY}px`);
}

document.getElementById('pan-up').addEventListener('click', () => { panY -= velocidadPan; aplicarPaneo(); });
document.getElementById('pan-down').addEventListener('click', () => { panY += velocidadPan; aplicarPaneo(); });
document.getElementById('pan-left').addEventListener('click', () => { panX += velocidadPan; aplicarPaneo(); });
document.getElementById('pan-right').addEventListener('click', () => { panX -= velocidadPan; aplicarPaneo(); });
