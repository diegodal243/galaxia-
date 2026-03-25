const startScreen = document.getElementById('start-screen');
const galaxyContainer = document.getElementById('galaxy-container');
const galaxy = document.getElementById('galaxy');
const bgMusic = document.getElementById('bg-music');

// Configuración
const totalFotos = 15;
const frases = [
  "Eres mi universo entero ✨", 
  "Luz de mi vida 💛", 
  "Siempre juntos 🚀", 
  "Mi persona favorita 💖", 
  "Te elegiría mil veces más 🥰",
  "Mi lugar seguro 🏡",
  "Amo tu sonrisa 😍"
];

// Evento: Cuando el usuario toca la pantalla
startScreen.addEventListener('click', () => {
  // Ocultar pantalla de inicio
  startScreen.style.opacity = '0';
  setTimeout(() => {
    startScreen.style.display = 'none';
    // Mostrar la galaxia
    galaxyContainer.classList.remove('hidden');
    // Reproducir música (si existe el archivo)
    bgMusic.play().catch(e => console.log("No se encontró el audio"));
    
    crearUniverso();
  }, 500); // Espera medio segundo a que se desvanezca
});

function crearUniverso() {
  // Crear las 15 fotos
  for (let i = 1; i <= totalFotos; i++) {
    const item = document.createElement('div');
    item.className = 'item photo';
    
    // Calcular el ángulo para que queden en un círculo perfecto (360 / 15 = 24 grados)
    const angle = (i * (360 / totalFotos));
    // Altura aleatoria para que no se vean planas
    const ty = (Math.random() - 0.5) * 200; 
    // Distancia aleatoria desde el centro
    const tz = 250 + Math.random() * 80;

    item.style.setProperty('--ry', `${angle}deg`);
    item.style.setProperty('--ty', `${ty}px`);
    item.style.setProperty('--tz', `${tz}px`);

    item.innerHTML = `<img src="assets/foto${i}.jpg" alt="Recuerdo ${i}">`;
    galaxy.appendChild(item);
  }

  // Crear los textos repartidos
  frases.forEach((frase, index) => {
    const item = document.createElement('div');
    item.className = 'item text';
    
    const angle = (index * (360 / frases.length)) + 15; // +15 para desfasarlos de las fotos
    const ty = (Math.random() - 0.5) * 250;
    const tz = 200 + Math.random() * 50;

    item.style.setProperty('--ry', `${angle}deg`);
    item.style.setProperty('--ty', `${ty}px`);
    item.style.setProperty('--tz', `${tz}px`);

    item.textContent = frase;
    galaxy.appendChild(item);
  });
}
