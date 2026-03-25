const startScreen = document.getElementById('start-screen');
const galaxyContainer = document.getElementById('galaxy-container');
const galaxy = document.getElementById('galaxy');
const bgMusic = document.getElementById('bg-music');

const totalFotos = 15;
const frases = [
  "Eres mi universo entero ✨", 
  "Luz de mi vida 💛", 
  "Siempre juntos 🚀", 
  "Mi persona favorita 💖", 
  "Te elegiría mil veces más 🥰"
];

startScreen.addEventListener('click', () => {
  startScreen.style.opacity = '0';
  
  setTimeout(() => {
    startScreen.style.display = 'none';
    galaxyContainer.classList.remove('hidden');
    
    // Añadimos la clase para el efecto de zoom épico
    galaxyContainer.classList.add('zoom-in-effect');
    
    bgMusic.play().catch(e => console.log("No se pudo reproducir el audio"));
    
    crearUniverso();
  }, 500);
});

function crearUniverso() {
  // 1. Crear las fotos usando la Proporción Áurea para una espiral 3D perfecta
  for (let i = 0; i < totalFotos; i++) {
    const item = document.createElement('div');
    item.className = 'item photo';
    
    // Ángulo áureo (aprox 137.5 grados) crea una distribución natural hermosa
    const angle = i * 137.5; 
    // Las distribuimos desde arriba hacia abajo en el eje Y
    const ty = -180 + (i * 25); 
    // Empiezan cerca del centro y se van alejando ligeramente
    const tz = 220 + (i * 5); 

    item.style.setProperty('--ry', `${angle}deg`);
    item.style.setProperty('--ty', `${ty}px`);
    item.style.setProperty('--tz', `${tz}px`);

    // EFECTO TIKTOK: Retrasamos la aparición de cada foto para que salgan una por una (0.15s de diferencia)
    item.style.animationDelay = `${i * 0.15}s`;

    // Asignamos la foto (foto1.jpg hasta foto15.jpg)
    item.innerHTML = `<img src="assets/foto${i + 1}.jpg" alt="Recuerdo ${i + 1}">`;
    galaxy.appendChild(item);
  }

  // 2. Crear los textos flotantes intercalados
  frases.forEach((frase, index) => {
    const item = document.createElement('div');
    item.className = 'item text';
    
    const angle = (index * (360 / frases.length)) + 45; 
    const ty = (Math.random() - 0.5) * 300;
    const tz = 260 + Math.random() * 60;

    item.style.setProperty('--ry', `${angle}deg`);
    item.style.setProperty('--ty', `${ty}px`);
    item.style.setProperty('--tz', `${tz}px`);
    
    // Los textos aparecen después de que terminan de salir las fotos
    item.style.animationDelay = `${(totalFotos * 0.15) + (index * 0.2)}s`;

    item.textContent = frase;
    galaxy.appendChild(item);
  });
}
