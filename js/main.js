/* VARIABLES */

let container = document.getElementById('container');
let gameColor = [];
let cardsChecker = [];
let score = 0;
let m = 0;
let s = 0;
let userTime = null;
let start = false;
let time = null;
let gameCards = 20;

/* FUNCTIONS */

function timeCounter() {
    s++;
    if (s > 60) {
        s = 0;
        m++;
    }
    userTime = m + ' minute(s) ' + s + ' seconde(s)';
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function checker() {
    if (!start) {
        start = true;
        timeCounter();
        time = setInterval(timeCounter, 1000);
    }
    if (cardsChecker.length == 0) {
        this.style.backgroundColor = this.getAttribute('dataColor');
        cardsChecker.push(this.getAttribute('dataColor'));
        this.classList.add('active1');
    } else if (cardsChecker.length == 1 && cardsChecker.includes(this.getAttribute('dataColor'))) {
        this.style.backgroundColor = this.getAttribute('dataColor');
        cardsChecker = [];
        document.getElementsByClassName('active1')[0].classList.remove('active1');
        score++;
    } else {
        this.style.backgroundColor = this.getAttribute('dataColor');
        cardsChecker = [];
        setTimeout(() => {
            this.style = '';
            document.getElementsByClassName('active1')[0].style = '';
            document.getElementsByClassName('active1')[0].classList.remove('active1');
        }, 500);
    }
    if (score == gameCards) {
        document.getElementById('win').style.opacity = '1';
        document.getElementById('win').style.pointerEvents = 'all';
        document.getElementById('time').innerHTML = userTime;
    }
}

function startGame() {
    for (let i = 0; i < gameCards; i++) {
        let color = getRandomColor();
        do {
            color = getRandomColor();
        } while (gameColor.includes(color));
        let div = document.createElement('div');
        div.className = 'cards';
        div.setAttribute('dataColor', color);
        div.addEventListener('click', checker);
        let div2 = document.createElement('div');
        div2.className = 'cards';
        div2.setAttribute('dataColor', color);
        div2.addEventListener('click', checker);
        container.append(div);
        container.append(div2);
        gameColor.push(color);
    }

    let cards = document.querySelectorAll('.cards');
    for (let i = 0; i < cards.length; i++) {
        container.appendChild(container.children[getRandomInt(cards.length)]);
    }
}

function resetGame() {
    clearInterval(time);
    container.innerHTML = '';
    gameColor = [];
    score = 0;
    time = null;
    userTime = null;
    s = 0;
    m = 0;
    start = false;
    document.getElementById('win').style.opacity = '0';
    document.getElementById('win').style.pointerEvents = 'none';
    startGame();
}

/* START GAME */

startGame();