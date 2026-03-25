const startScreen = document.getElementById('start-screen');
const scene = document.getElementById('scene');
const camera = document.getElementById('camera');
const galaxy = document.getElementById('galaxy');
const bgMusic = document.getElementById('bg-music');
const starsContainer = document.getElementById('stars-container');

// Elementos de la Carta
const letterModal = document.getElementById('letter-modal');
const closeLetterBtn = document.getElementById('close-letter');
const letterImg = document.getElementById('letter-img');
const letterText = document.getElementById('letter-text');

// Configuración de la Galaxia
const totalFotos = 15;
// Escribe aquí un mensajito diferente para cada foto si quieres:
const mensajesFotos = [
  "Este día fue mágico, me encantó cada segundo a tu lado.",
  "Amo tu sonrisa en esta foto, ilumina todo mi mundo.",
  "Un recuerdo inolvidable. Siempre quiero crear más momentos así.",
  "Aquí me di cuenta de lo afortunado que soy de tenerte.",
  "Mi lugar favorito en el mundo es donde sea que estés tú.",
  "Eres mi casualidad más hermosa.",
  "Conmigo siempre vas a estar a salvo.",
  "Cada vez que veo esta foto me vuelvo a enamorar.",
  "Gracias por ser mi persona incondicional.",
  "La vida es mucho mejor desde que tú estás en ella.",
  "Eres mi rayito de sol en los días nublados.",
  "Me haces querer ser una mejor persona cada día.",
  "Nuestras locuras son mis recuerdos favoritos.",
  "No te cambiaría por nada del universo.",
  "Te amo hoy, mañana y siempre. ✨"
];

const frasesFlotantes = ["Mi universo", "Te amo", "Siempre juntos", "Luz de mi vida", "Mi todo"];

// --- INICIAR EXPERIENCIA ---
startScreen.addEventListener('click', () => {
  startScreen.style.opacity = '0';
  setTimeout(() => {
    startScreen.style.display = 'none';
    scene.classList.remove('hidden');
    bgMusic.play().catch(e => console.log("Audio no reproducido"));
    
    crearEstrellas();
    crearUniverso();
  }, 1000);
});

// --- CREAR ESTRELLAS DE FONDO ---
function crearEstrellas() {
  const numEstrellas = 200; // Puedes poner más si quieres!
  for (let i = 0; i < numEstrellas; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 3;
    const delay = Math.random() * 3;
    const duration = 1 + Math.random() * 3;

    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.animationDelay = `${delay}s`;
    star.style.animationDuration = `${duration}s`;

    starsContainer.appendChild(star);
  }
}

// --- CREAR FOTOS Y TEXTOS ---
function crearUniverso() {
  // Generar Fotos
  for (let i = 0; i < totalFotos; i++) {
    const item = document.createElement('div');
    item.className = 'item photo';
    
    // Matemática para espiral esférica
    const phi = Math.acos(-1 + (2 * i) / totalFotos);
    const theta = Math.sqrt(totalFotos * Math.PI) * phi;
    
    const radio = 300; // Qué tan grande es la esfera
    
    // Convertir coordenadas esféricas a CSS (Rotaciones y traslaciones)
    const ry = (theta * 180) / Math.PI; 
    const ty = (radio * Math.cos(phi));
    const tz = radio * Math.sin(phi);

    item.style.setProperty('--ry', `${ry}deg`);
    item.style.setProperty('--ty', `${ty}px`);
    item.style.setProperty('--tz', `${tz}px`);
    item.style.animationDelay = `${i * 0.1}s`;

    item.innerHTML = `<img src="assets/foto${i + 1}.jpg" alt="Recuerdo">`;
    
    // --- EVENTO PARA ABRIR LA CARTA ---
    item.addEventListener('click', (e) => {
      e.stopPropagation(); // Evita que se mueva la cámara al hacer clic
      abrirCarta(`assets/foto${i + 1}.jpg`, mensajesFotos[i]);
    });

    galaxy.appendChild(item);
  }

  // Generar Textos
  frasesFlotantes.forEach((frase, index) => {
    const item = document.createElement('div');
    item.className = 'item text';
    
    const angle = (index * (360 / frasesFlotantes.length));
    const ty = (Math.random() - 0.5) * 400;
    const tz = 350 + Math.random() * 50;

    item.style.setProperty('--ry', `${angle}deg`);
    item.style.setProperty('--ty', `${ty}px`);
    item.style.setProperty('--tz', `${tz}px`);
    item.style.animationDelay = `${(totalFotos * 0.1) + (index * 0.2)}s`;

    item.textContent = frase;
    galaxy.appendChild(item);
  });
}

// --- LOGICA DE LA CARTA ---
function abrirCarta(imgSrc, mensaje) {
  letterImg.src = imgSrc;
  letterText.textContent = mensaje;
  letterModal.classList.remove('hidden');
  // Pequeño retraso para que la animación CSS funcione
  setTimeout(() => letterModal.classList.add('show'), 10); 
}

closeLetterBtn.addEventListener('click', () => {
  letterModal.classList.remove('show');
  setTimeout(() => letterModal.classList.add('hidden'), 500);
});

// Cerrar tocando afuera de la carta
letterModal.addEventListener('click', (e) => {
  if(e.target === letterModal) {
    letterModal.classList.remove('show');
    setTimeout(() => letterModal.classList.add('hidden'), 500);
  }
});

// --- CONTROLES DE CÁMARA (ZOOM Y ROTACIÓN) ---
let rotX = -15; 
let rotY = 0; 
let zoom = 1;
let isDragging = false;
let startX, startY;

// Iniciar arrastre
scene.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
});

scene.addEventListener('touchstart', (e) => {
  isDragging = true;
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

// Arrastrar
const moverCamara = (x, y) => {
  if (!isDragging) return;
  const deltaX = x - startX;
  const deltaY = y - startY;
  
  rotY += deltaX * 0.5; // Sensibilidad horizontal
  rotX -= deltaY * 0.5; // Sensibilidad vertical
  
  // Limitar rotación arriba/abajo
  if(rotX > 60) rotX = 60;
  if(rotX < -60) rotX = -60;

  camera.style.setProperty('--rotX', `${rotX}deg`);
  camera.style.setProperty('--rotY', `${rotY}deg`);
  
  startX = x;
  startY = y;
};

scene.addEventListener('mousemove', (e) => moverCamara(e.clientX, e.clientY));
scene.addEventListener('touchmove', (e) => moverCamara(e.touches[0].clientX, e.touches[0].clientY));

// Soltar arrastre
const detenerArrastre = () => isDragging = false;
window.addEventListener('mouseup', detenerArrastre);
window.addEventListener('touchend', detenerArrastre);

// Hacer Zoom con rueda del ratón
scene.addEventListener('wheel', (e) => {
  e.preventDefault();
  zoom += e.deltaY * -0.001;
  // Limites del zoom
  if (zoom < 0.5) zoom = 0.5;
  if (zoom > 3) zoom = 3;
  camera.style.setProperty('--zoom', zoom);
});
