const screens = document.querySelectorAll('.screen');
const chooseInsectBtns = document.querySelectorAll('.choose-insect-btn');
const startBtn = document.getElementById('start-btn')
const gameContainer = document.getElementById('game-container')
const timeEl = document.getElementById('time')
const scoreEl = document.getElementById('score')
const message = document.getElementById('message')
const playAgainBtn = document.getElementById('play-again-btn')

let seconds = 0
let score = 0
let selectedInsect = {}
let gameInterval = null
let gameActive = false

startBtn.addEventListener('click', () => screens[0].classList.add('up'))

chooseInsectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const img = btn.querySelector('img')
        const src = img.getAttribute('src')
        const alt = img.getAttribute('alt')
        selectedInsect = { src, alt }
        score = 0
        seconds = 60
        scoreEl.innerHTML = `Score: ${score}`
        timeEl.innerHTML = `Time: 01:00`
        message.classList.remove('visible')
        screens[1].classList.add('up')
        setTimeout(createInsect, 1000)
        startGame()
    })
})

function startGame() {
    gameActive = true
    if (gameInterval) clearInterval(gameInterval)
    gameInterval = setInterval(increaseTime, 1000)
}

function increaseTime() {
    let m = Math.floor(seconds / 60)
    let s = seconds % 60
    m = m < 10 ? `0${m}` : m
    s = s < 10 ? `0${s}` : s
    timeEl.innerHTML = `Time: ${m}:${s}`
    seconds--
    if (seconds < 0) {
        clearInterval(gameInterval)
        gameOver()
    }
}

function createInsect() {
    if (!gameActive) return
    const insect = document.createElement('div');
    insect.classList.add('insect');
    const { x, y } = getRandomLocation();
    insect.style.top = `${y}px`;
    insect.style.left = `${x}px`;
    insect.innerHTML = `<img src="${selectedInsect.src}" alt="${selectedInsect.alt}" style="transform: rotate(${Math.random() * 360}deg)" />`;
    
    insect.addEventListener('click', catchInsect);
    
    gameContainer.appendChild(insect);
};

function gameOver() {
    gameActive = false
    document.querySelectorAll('.insect').forEach(insect => insect.remove())
    message.innerHTML = `Game Over! <br> Your final score is ${score}`
    
    message.classList.add('visible')
}

function getRandomLocation() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const x = Math.random() * (width - 200) + 100;
    const y = Math.random() * (height - 200) + 100;
    return { x, y };
};

function catchInsect() {
    increaseScore();
    this.classList.add('caught');
    setTimeout(() => this.remove(), 2000)
    addInsect();
};

function addInsect() {
    setTimeout(createInsect, 1000)
    setTimeout(createInsect, 1500)
};

function increaseScore() {
    score++
    if (score > 19 & seconds > 0) {
        message.innerHTML = 'Are you annoyed yet? <br> You are playing an impossible game!'
        message.classList.add('visible')
    }
    scoreEl.innerHTML = `Score: ${score}`
}