const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const resetButton = document.querySelector('.reset');

pipe.style.display = 'none';
pipe.style.animation = 'none';

// Sons
const jumpSound = new Audio('./sounds/Mario-jump-sound.mp3');
jumpSound.volume = 0.6;
const gameOverSound = new Audio('./sounds/game over2.mp3');
const music = new Audio('./sounds/musica de fundo.mp3');
const contagem = new Audio('./sounds/contagem.mp3');

music.loop = true;
window.addEventListener('load', () => {
    showLogin();
});

resetButton.addEventListener('click', () => {
    // Reseta variáveis do jogo
    pipeSpeed = 18;
    const board = document.querySelector('.game-board');
    const boardWidth = board ? board.offsetWidth : window.innerWidth;
    pipeLeft = boardWidth;
    pipe.style.left = pipeLeft + 'px';
    pipe.style.animation = 'pipe-animation 1.4s linear infinite';
    mario.src = './images/mario.gif';
    mario.style.width = '300px';
    resetButton.style.display = 'none';
    rankingBtn.style.display = 'none';
    changePlayerBtn.style.display = 'none';
    music.currentTime = 0;
    music.play();
    score = 0;
    if (scoreDisplay) scoreDisplay.textContent = score;
    gameRunning = true;
    requestAnimationFrame(gameLoop);
});

const jump = () => {
    if (!mario.classList.contains('jump')) {
        jumpSound.currentTime = 0;
        jumpSound.play();

        mario.classList.add('jump');
        setTimeout(() => {
            mario.classList.remove('jump');
        }, 500);
    }
};

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') jump();
});
document.addEventListener('click', jump);
document.addEventListener('touchstart', jump);

// MOVIMENTO SUAVE DO PIPE
let pipeSpeed = 18; // pixels por frame (aumenta para ficar mais rápido)
let speedIncrease = 0.04; // quanto aumenta por frame
let pipeLeft = 800; // posição inicial (ajuste conforme seu layout)
let gameRunning = true;

function startGame() {
    // Garante que o pipe começa fora da tela à direita do game-board
    const board = document.querySelector('.game-board');
    const boardWidth = board ? board.offsetWidth : window.innerWidth;
    pipeLeft = boardWidth; // Começa exatamente na borda direita
    pipe.style.left = pipeLeft + 'px';
    pipe.style.animation = 'none'; // remove animação CSS
    gameRunning = true;
    requestAnimationFrame(gameLoop);
}

let score = 0;
const scoreDisplay = document.querySelector('.score'); // Adicione um elemento no HTML

function gameLoop() {
    if (!gameRunning) return;

    pipeLeft -= pipeSpeed;
    pipe.style.left = pipeLeft + 'px';

    if (pipeLeft < -pipe.offsetWidth) {
        const board = document.querySelector('.game-board');
        const boardWidth = board ? board.offsetWidth : window.innerWidth;
        pipeLeft = boardWidth;
        pipeSpeed += speedIncrease;
        score++;
        if (scoreDisplay) scoreDisplay.textContent = score;
    }

    // Colisão
    const pipeRect = pipe.getBoundingClientRect();
    const marioRect = mario.getBoundingClientRect();
    if (
        pipeRect.left < marioRect.right - 50 &&
        pipeRect.right > marioRect.left + 50 &&
        marioRect.bottom > pipeRect.top + 10
    ) {
        gameOver();
        return;
    }

    requestAnimationFrame(gameLoop);
}

// ... Seu código anterior ...

let playerName = localStorage.getItem('mario_player_name') || '';
const loginScreen = document.querySelector('.login-screen');
const playerNameInput = document.getElementById('playerNameInput');
const startBtn = document.getElementById('startBtn');
const rankingBtn = document.querySelector('.ranking-btn');
const changePlayerBtn = document.querySelector('.change-player-btn');
const rankingModal = document.querySelector('.ranking-modal');
const rankingList = document.querySelector('.ranking-list');
const closeRanking = document.querySelector('.close-ranking');

// Exibe tela de login se não houver nome salvo
function showLogin() {
    loginScreen.style.display = 'flex';
    document.querySelector('.score').style.display = 'none';
    resetButton.style.display = 'none';
    rankingBtn.style.display = 'none';
    mario.src = './images/mario.gif';
    mario.style.width = '300px';
    changePlayerBtn.style.display = 'none';
    score = 0;
    if (scoreDisplay) scoreDisplay.textContent = score;
     pipe.style.display = 'none';
    pipe.style.animation = 'none';
}
function hideLogin() {
    loginScreen.style.display = 'none';
    document.querySelector('.score').style.display = '';
     pipe.style.display = 'none';
    pipe.style.animation = 'pipe-animation 1.4s linear infinite';
}

if (!playerName) {
    showLogin();
} else {
    hideLogin();
}

// Começar com nome
startBtn.onclick = () => {
    const name = playerNameInput.value.trim();
    if (name.length < 2) {
        alert('Digite um nome com pelo menos 2 letras!');
        return;
    }
    playerName = name;
    localStorage.setItem('mario_player_name', playerName);
    music.play();
    startCountdownAndGame(); // Chama a contagem regressiva!
};

// Trocar jogador
changePlayerBtn.onclick = () => {
    playerName = '';
    localStorage.removeItem('mario_player_name');
    showLogin();
};

// Ranking
rankingBtn.onclick = showRanking;
closeRanking.onclick = () => rankingModal.style.display = 'none';

function showRanking() {
    const ranking = JSON.parse(localStorage.getItem('mario_ranking') || '[]');
    rankingList.innerHTML = ranking
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map((item, i) => `<li>${i+1}. ${item.name} - ${item.score}</li>`)
        .join('');
    rankingModal.style.display = 'flex';
}

// Salvar score no ranking local
function saveScore(name, score) {
    if (!name || score <= 0) return;
    let ranking = JSON.parse(localStorage.getItem('mario_ranking') || '[]');
    const idx = ranking.findIndex(item => item.name.toLowerCase() === name.toLowerCase());
    if (idx !== -1) {
        // Atualiza apenas se o novo score for maior
        if (score > ranking[idx].score) {
            ranking[idx].score = score;
        }
    } else {
        ranking.push({ name, score });
    }
    localStorage.setItem('mario_ranking', JSON.stringify(ranking));
}

// Modifique seu gameOver:
function gameOver() {
    if (!gameRunning) return;
    gameRunning = false;
     music.currentTime = 0;
    music.pause();
    mario.src = './images/game-over.png';
    mario.style.width = '150px';
    gameOverSound.currentTime = 0;
    gameOverSound.play();
    resetButton.style.display = 'block';
    rankingBtn.style.display = 'block';
    changePlayerBtn.style.display = 'block';
    saveScore(playerName, score);
}

// (Opcional) Esconde ranking ao clicar fora do modal
rankingModal.addEventListener('click', e => {
    if (e.target === rankingModal) rankingModal.style.display = 'none';
});

const countdownEl = document.querySelector('.countdown');

function startCountdownAndGame() {
    let count = 3;
    countdownEl.textContent = count;
    countdownEl.style.display = 'block';
    pipe.style.display = 'none'; // Garante que o pipe não aparece antes
    hideLogin();

    function next() {
        if (count > 1) {
            count--;
            countdownEl.textContent = count;
            setTimeout(next, 800);
        } else {
            countdownEl.textContent = 'Vai!';
            contagem.currentTime = 1.3;
            contagem.volume = 1.0;
            contagem.play();
            setTimeout(() => {
                countdownEl.style.display = 'none';
                pipe.style.display = 'block';
                startGame();
            }, 800);
        }
    }
    setTimeout(next, 800);
}