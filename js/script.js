const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const resetButton = document.querySelector('.reset');
const jumpSound = new Audio('./sounds/Mario-jump-sound.mp3');
const gameOverSound = new Audio('./sounds/game over2.mp3');
const music = new Audio('./sounds/musica de fundo.mp3');
music.loop = true; // Faz a música repetir
music.volume = 0.6; // (opcional) diminui o volume

window.addEventListener('load', () => {
    music.play();
});

resetButton.addEventListener('click', () => {
    location.reload();
});



const jump = () => {
    // Calcula altura máxima do pulo (máx 35% da altura do game-board ou 180px)
    const boardHeight = document.querySelector('.game-board').offsetHeight;
    const jumpHeight = Math.min(boardHeight * 0.5, 200);

    jumpSound.currentTime = 0; // Reseta o tempo do som
    jumpSound.play();

    mario.classList.add('jump');
    mario.style.setProperty('--jump-height', `${jumpHeight}px`);

    setTimeout(() => {
        mario.classList.remove('jump');
        mario.style.removeProperty('--jump-height');
    }, 500);
};

// Adapta a animação do pulo para ser responsiva
const style = document.createElement('style');
style.innerHTML = `
@keyframes jump {
    0% { bottom: 0; }
    40% { bottom: var(--jump-height, 130px); }
    50% { bottom: var(--jump-height, 130px); }
    60% { bottom: var(--jump-height, 130px); }
    100% { bottom: 0; }
}`;
document.head.appendChild(style);

const loop = setInterval(() => {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

    // Responsivo: limites proporcionais ao tamanho da tela
    const boardWidth = document.querySelector('.game-board').offsetWidth;
    const boardHeight = document.querySelector('.game-board').offsetHeight;
    const collisionLimit = boardWidth * 0.20;

    // Altura do Mario para colisão (pega o height real)
    const marioHeight = mario.offsetHeight;
    // O Mario só morre se estiver baixo o suficiente para "bater" no pipe
    const marioColide = marioPosition < (pipe.offsetHeight * 0.6);

    if (pipePosition <= collisionLimit && pipePosition > 0 && marioColide) {
        gameOverSound.play();
        music.pause(); 
        music.currentTime = 0; 
        pipe.style.animation = 'none';
        pipe.style.left = `${pipePosition}px`;

        mario.style.animation = 'none';
        mario.style.bottom = `${marioPosition}px`;
        mario.src = './images/game-over.png';
        mario.style.width = `${mario.offsetWidth * 0.55}px`;
        mario.style.marginLeft = `${mario.offsetWidth * 0.7}px`;

        resetButton.style.display = 'block';

        clearInterval(loop);
    }
}, 10);

function checkOrientation() {
    const message = document.getElementById('rotate-message');
    if (window.innerHeight > window.innerWidth) {
        // Está em modo retrato (vertical)
        message.style.display = 'flex';
    } else {
        // Está em modo paisagem (horizontal)
        message.style.display = 'none';
    }
}

window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);
window.addEventListener('load', checkOrientation);

document.addEventListener('keydown', jump)
document.addEventListener('touchstart', jump);
document.addEventListener('click', jump);