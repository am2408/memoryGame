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
        // this.style.backgroundColor = this.getAttribute('dataColor');
        // this.style.transform = 'rotateY(180deg)';
        cardsChecker.push(this.getAttribute('dataColor'));
        this.classList.add('active1');
        this.classList.add('selectedCard');
        this.style.pointerEvents = 'none';
        this.children[0].children[0].style.fill = this.getAttribute('dataColor');
    } else if (cardsChecker.length == 1 && cardsChecker.includes(this.getAttribute('dataColor')) && !this.className.includes('active1')) {
        // this.style.backgroundColor = this.getAttribute('dataColor');
        // this.style.transform = 'rotateY(180deg)';
        this.classList.add('selectedCard');
        this.style.pointerEvents = 'none';
        this.children[0].children[0].style.fill = this.getAttribute('dataColor');
        document.getElementsByClassName('active1')[0].style.pointerEvents = 'none';
        document.getElementsByClassName('active1')[0].classList.remove('active1');
        cardsChecker = [];
        score++;
    } else {
        // this.style.transform = 'rotateY(180deg)';
        // this.style.backgroundColor = this.getAttribute('dataColor');
        this.classList.add('selectedCard');
        this.children[0].children[0].style.fill = this.getAttribute('dataColor');
        cardsChecker = [];
        setTimeout(() => {
            // this.style = '';
            this.classList.remove('selectedCard');
            this.children[0].children[0].style = '';
            document.getElementsByClassName('active1')[0].style = '';
            document.getElementsByClassName('active1')[0].children[0].children[0].style = '';
            document.getElementsByClassName('active1')[0].classList.remove('selectedCard');
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
    let title = document.createElement('h1');
    title.className = 'title titleMain';
    title.innerHTML = 'Memory Game';
    for (let i = 0; i < gameCards; i++) {
        let color = getRandomColor();
        do {
            color = getRandomColor();
        } while (gameColor.includes(color));
        let div = document.createElement('div');
        div.innerHTML = '<svg viewBox="0 0 512 512" style="pointer-events:none; transform: rotateY(180deg)"><path d="M448.964 365.617C348.188 384.809 255.14 307.765 255.14 205.419c0-58.893 31.561-112.832 82.574-141.862 25.83-14.7 19.333-53.859-10.015-59.28A258.114 258.114 0 0 0 280.947 0c-141.334 0-256 114.546-256 256 0 141.334 114.547 256 256 256 78.931 0 151.079-35.924 198.85-94.783 18.846-23.22-1.706-57.149-30.833-51.6zM280.947 480c-123.712 0-224-100.288-224-224s100.288-224 224-224c13.984 0 27.665 1.294 40.94 3.745-58.972 33.56-98.747 96.969-98.747 169.674 0 122.606 111.613 214.523 231.81 191.632C413.881 447.653 351.196 480 280.947 480z" fill="#00db22"></path></svg>';
        div.className = 'cards';
        div.setAttribute('dataColor', color);
        div.addEventListener('click', checker);
        let div2 = document.createElement('div');
        div2.innerHTML = '<svg viewBox="0 0 512 512" style="pointer-events:none; transform: rotateY(180deg)"><path d="M448.964 365.617C348.188 384.809 255.14 307.765 255.14 205.419c0-58.893 31.561-112.832 82.574-141.862 25.83-14.7 19.333-53.859-10.015-59.28A258.114 258.114 0 0 0 280.947 0c-141.334 0-256 114.546-256 256 0 141.334 114.547 256 256 256 78.931 0 151.079-35.924 198.85-94.783 18.846-23.22-1.706-57.149-30.833-51.6zM280.947 480c-123.712 0-224-100.288-224-224s100.288-224 224-224c13.984 0 27.665 1.294 40.94 3.745-58.972 33.56-98.747 96.969-98.747 169.674 0 122.606 111.613 214.523 231.81 191.632C413.881 447.653 351.196 480 280.947 480z" fill="#00db22"></path></svg>';
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
    container.prepend(title);
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