const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const resetButton = document.querySelector('.reset');

resetButton.addEventListener('click', () => {
    location.reload();
});



const jump = () => {

    mario.classList.add('jump');

    setTimeout(() => {

         mario.classList.remove('jump');

    }, 500);
}

const loop = setInterval(() => {

    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');
    
    if (pipePosition <= 240 && pipePosition > 0 && marioPosition < 160) {

        pipe.style.animation = 'none';
        pipe.style.left = `${pipePosition}px`;

         mario.style.animation = 'none';
        mario.style.bottom = `${marioPosition}px`;
        mario.src = './images/game-over.png';
        mario.style.width = '150px';
        mario.style.marginLeft = '100px';

        resetButton.style.display = 'block'; 

        clearInterval(loop);
    }

},10)

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