class MemoryGame {
    constructor(mode, difficulty) {
        this.mode = mode;
        this.difficulty = difficulty;
        this.pairCount = difficulty === 'easy' ? 6 : (difficulty === 'medium' ? 11 : 33);
        this.icons = [
            "🍎", "🍏", "🚗", "🚙", "🐶", "🐕", "💎", "🔷", "🌟", "✨", "🔥", "💥", "⚽", "🏀",
            "🏆", "🥇", "🎲", "🧩", "🚀", "🛸", "🎮", "🕹️", "🖥️", "💻", "📚", "📖", "🍔", "🌭",
            "🎁", "📦", "😊", "🙂", "😂", "🤣", "😒", "🙄", "😍", "🥰", "😘", "😗", "😁", "😄",
            "😎", "🕶️", "😭", "😢", "😜", "😝"
        ];
        this.colors = [
            "#ff7675", "#ff6b6b", "#ff7b89", "#ff5e78", "#ffa8a8", "#ffb6b6",
            "#74b9ff", "#70a1ff", "#6faaff", "#7ebdff", "#65c7f7", "#82ccff",
            "#ffeaa7", "#ffe066", "#fff3b0", "#ffec99", "#fff1a8", "#f9e79f",
            "#55efc4", "#48dbb4", "#7bed9f", "#2ed573", "#20bf6b", "#1dd1a1",
            "#a29bfe", "#a093e0", "#9d91f3", "#b39ddb", "#b388eb", "#9c88ff",
            "#fab1a0", "#f8a5c2", "#f7b267", "#f6d365", "#f3a683", "#f5cd79",
            "#fdcb6e", "#feca57", "#ffbe76", "#ffc312", "#ffd32a", "#f6e58d",
            "#6c5ce7", "#706fd3", "#5f27cd", "#7158e2", "#9980fa", "#7d5fff"
        ];
        this.container = document.getElementById('game');
        this.winPopup = document.getElementById('win');
        this.noAllow = document.getElementById('noAllow');
        this.endTitle = document.getElementById('endTitle');
        this.timeDisplay = document.getElementById('time');
        this.timerDisplay = document.getElementById('timer');
        this.scoreBoard = document.getElementById('scores');
        this.topList = document.getElementById('top-scores-list');
        this.startTime = null;
        this.timer = null;
        this.cards = [];
        this.selected = [];
        this.matched = 0;

        this.gameType = document.getElementById("gameType").value;
        this.playerInfo = document.getElementById("playerInfo");
        this.currentPlayer = 1;
        this.scores = { 1: 0, 2: 0 };

        this.opponent = document.getElementById("opponent").value;
        this.cpuMemory = {};
        this.cpuThinking = false;

        this.start();
    }

    start() {
        document.getElementById('intro').classList.add('hidden');
        this.timerDisplay.classList.remove('hidden');
        this.scoreBoard.classList.remove('hidden');
        this.container.classList.remove('hidden');

        if (this.gameType == '1v1') {
            this.playerInfo.classList.remove("hidden");
            this.timerDisplay.classList.add('hidden');
            this.scoreBoard.classList.add('hidden');
            this.updatePlayerInfo();
        } else {
            this.playerInfo.classList.add("hidden");
        }

        this.container.innerHTML = '';
        this.winPopup.classList.add('hidden');
        this.selected = [];
        this.matched = 0;
        this.cards = [];
        this.renderTopScores();
        this.startTime = Date.now();
        this.timer = setInterval(() => this.updateTimer(), 1000);

        const values = [];
        if (this.mode === "both") {
            while (values.length < this.pairCount * 2) {
                const icon = this.icons[Math.floor(Math.random() * this.icons.length)];
                const color = this.colors[Math.floor(Math.random() * this.colors.length)];
                const pair = { color, icon };
                const count = values.filter(v => v.icon === icon && v.color === color).length;
                if (count < 2) {
                    values.push(pair, pair);
                }
            }
        } else if (this.mode === "color") {
            while (values.length < this.pairCount * 2) {
                const color = this.colors[Math.floor(Math.random() * this.colors.length)];
                const pair = { color };
                const count = values.filter(v => v.color === color).length;
                if (count < 2) {
                    values.push(pair, pair);
                }
            }
        } else if (this.mode === "icon") {
            while (values.length < this.pairCount * 2) {
                const icon = this.icons[Math.floor(Math.random() * this.icons.length)];
                const pair = { icon };
                const count = values.filter(v => v.icon === icon).length;
                if (count < 2) {
                    values.push(pair, pair);
                }
            }
        }
        this.shuffle(values);

        values.forEach(({ color, icon }) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.color = color;
            card.dataset.icon = icon;
            card.textContent = '';
            card.style.background = "#f2f2f2 center / 50% no-repeat url('https://cdn-icons-png.flaticon.com/512/2476/2476190.png')";
            card.addEventListener('click', () => this.flip(card));
            this.container.appendChild(card);
            this.cards.push(card);
        });
        this.adjustGrid();
    }

    updateTimer() {
        const duration = Math.floor((Date.now() - this.startTime) / 1000);
        this.timerDisplay.textContent = 'Time : ' + duration + 's';
    }

    updatePlayerInfo() {
        if (this.opponent == 'none') {
            this.playerInfo.textContent = `Player ${this.currentPlayer} — Score P1: ${this.scores[1]} | P2: ${this.scores[2]}`;
        } else {
            if (this.currentPlayer == 2) {
                this.playerInfo.textContent = `Computer — Score P1: ${this.scores[1]} | Computer: ${this.scores[2]}`;
            } else {
                this.playerInfo.textContent = `Player ${this.currentPlayer} — Score P1: ${this.scores[1]} | Computer: ${this.scores[2]}`;
            }
        }
    }

    flip(card) {
        if (this.selected.includes(card) || card.classList.contains('flipped') || this.selected.length === 2) return;
        card.classList.add('flipped');

        if (this.mode === "color") {
            card.textContent = "";
            card.style.background = `linear-gradient(135deg, ${card.dataset.color}, ${card.dataset.color})`;
        } else if (this.mode === "icon") {
            card.innerHTML = `<span>${card.dataset.icon}</span>`;
            card.style.background = "#f2f2f2 center / 50% no-repeat url('https://cdn-icons-png.flaticon.com/512/2476/2476190.png')";
        } else {
            card.innerHTML = `<span>${card.dataset.icon}</span>`;
            card.style.background = `linear-gradient(135deg, ${card.dataset.color}, ${card.dataset.color})`;
        }

        this.selected.push(card);
        if (this.selected.length === 2) setTimeout(() => this.check(), 500);

        if (this.opponent === "cpu-medium") {
            for (const card of this.selected) {
                const key = `${card.dataset.icon || ""}-${card.dataset.color || ""}`;
                if (!this.cpuMemory[key]) this.cpuMemory[key] = [];
                if (!this.cpuMemory[key].includes(card)) this.cpuMemory[key].push(card);
            }
        }
    }

    check() {
        const [first, second] = this.selected;
        let match;
        if (this.mode === "color") {
            match = first.dataset.color === second.dataset.color;
        } else if (this.mode === "icon") {
            match = first.dataset.icon === second.dataset.icon;
        } else {
            match = (first.dataset.icon === second.dataset.icon) && (first.dataset.color === second.dataset.color);
        }
        if (match) {
            this.matched++;
            if (this.gameType == '1v1') {
                this.scores[this.currentPlayer]++;
                this.updatePlayerInfo();
            }
            if (this.matched === this.pairCount) {
                if (this.gameType == '1v1') {
                    this.show1v1Win();
                } else {
                    clearInterval(this.timer);
                    this.showWin();
                }
            } else {
                if (
                    this.gameType === '1v1' &&
                    this.opponent !== 'none' &&
                    this.currentPlayer === 2
                ) {
                    this.noAllow.classList.remove('hidden');
                    if (this.opponent === "cpu-medium") {
                        const key = `${first.dataset.icon || ""}-${first.dataset.color || ""}`;
                        delete this.cpuMemory[key];
                    }

                    setTimeout(() => this.cpuPlay(), 500);
                } else {
                    this.noAllow.classList.add('hidden');
                }
            }
        } else {
            if (this.gameType == '1v1') {
                this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
                this.updatePlayerInfo();
                if (this.opponent !== 'none' && this.currentPlayer == 2) {
                    this.noAllow.classList.remove('hidden');
                    setTimeout(() => this.cpuPlay(), 500);
                } else {
                    this.noAllow.classList.add('hidden');
                }
            }
            [first, second].forEach(card => {
                card.classList.remove('flipped');
                card.innerHTML = '';
                card.style.background = "#f2f2f2 center / 50% no-repeat url('https://cdn-icons-png.flaticon.com/512/2476/2476190.png')";
            });
        }
        this.selected = [];
    }

    showWin() {
        const duration = Math.floor((Date.now() - this.startTime) / 1000);
        this.endTitle.textContent = "🎉 Bravo !"
        this.winPopup.classList.remove('hidden');
        this.noAllow.classList.remove('hidden');
        this.timeDisplay.textContent = `Terminé en ${duration} secondes !`;
        this.saveScore(duration);
        this.renderTopScores();
    }

    show1v1Win() {
        this.winPopup.classList.remove('hidden');
        this.noAllow.classList.remove('hidden');
        let message;
        if (this.scores[1] > this.scores[2]) {
            this.endTitle.textContent = "🎉 Bravo !"
            message = "🎉 Player 1 win !";
        } else if (this.scores[2] > this.scores[1]) {
            if (this.opponent == 'none') {
                this.endTitle.textContent = "🎉 Bravo !"
                message = "🎉 Player 2 win !";
            } else {
                this.endTitle.textContent = "💩 You lose !"
                message = "🤖 Computer win !";
            }
        } else {
            this.endTitle.textContent = "🎉 Bravo !"
            message = "🤝 Tie !";
        }
        if (this.opponent == 'none') {
            this.timeDisplay.textContent = message + `  (P1: ${this.scores[1]} | P2: ${this.scores[2]})`;
        } else {
            this.timeDisplay.textContent = message + `  (P1: ${this.scores[1]} | Computer: ${this.scores[2]})`;
        }
    }

    saveScore(duration) {
        const key = `memory-top5-${this.difficulty}-${this.mode}`;
        let scores = JSON.parse(localStorage.getItem(key)) || [];
        scores.push(duration);
        scores.sort((a, b) => a - b);
        scores = scores.slice(0, 5);
        localStorage.setItem(key, JSON.stringify(scores));
    }

    renderTopScores() {
        const key = `memory-top5-${this.difficulty}-${this.mode}`;
        const scores = JSON.parse(localStorage.getItem(key)) || [];
        this.topList.innerHTML = '';
        scores.forEach(score => {
            const li = document.createElement('li');
            li.textContent = score + 's';
            this.topList.appendChild(li);
        });
    }

    shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    cpuPlay() {
        if (this.cpuThinking) return;
        this.cpuThinking = true;

        let candidates = [];

        if (this.opponent === "cpu-impossible") {
            const byKey = {};
            this.cards.forEach(card => {
                if (!card.classList.contains("flipped")) {
                    const key = `${card.dataset.icon || ""}-${card.dataset.color || ""}`;
                    if (!byKey[key]) byKey[key] = [];
                    byKey[key].push(card);
                }
            });
            for (let pair of Object.values(byKey)) {
                if (pair.length >= 2) {
                    candidates = [pair[0], pair[1]];
                    break;
                }
            }
        } else if (this.opponent === "cpu-easy") {
            const available = this.cards.filter(c => !c.classList.contains("flipped"));
            candidates = available.sort(() => Math.random() - 0.5).slice(0, 2);
        } else if (this.opponent === "cpu-medium") {
            for (let key in this.cpuMemory) {
                const cards = this.cpuMemory[key].filter(c => !c.classList.contains("flipped"));
                if (cards.length >= 2) {
                    candidates = [cards[0], cards[1]];
                    break;
                }
            }

            if (candidates.length < 2) {
                const available = this.cards.filter(c => !c.classList.contains("flipped"));
                candidates = available.sort(() => Math.random() - 0.5).slice(0, 2);
            }
        }

        candidates[0].click();
        setTimeout(() => {
            candidates[1].click();
            this.cpuThinking = false;
        }, 300);
    }

    adjustGrid() {
        const total = this.cards.length;
        const container = this.container;
        const maxWidth = container.offsetWidth;
        const maxHeight = window.innerHeight - 200;

        let bestCols = 1;
        let bestSize = 0;

        for (let cols = 1; cols <= total; cols++) {
            const rows = Math.ceil(total / cols);
            const cardSizeW = maxWidth / cols;
            const cardSizeH = maxHeight / rows;
            const size = Math.min(cardSizeW, cardSizeH);
            if (size > bestSize) {
                bestSize = size;
                bestCols = cols;
            }
        }

        container.style.gridTemplateColumns = `repeat(${bestCols}, 1fr)`;
    }
}

let game;
document.getElementById('startGame').addEventListener('click', () => {
    const mode = document.getElementById('mode').value;
    const difficulty = document.getElementById('difficulty').value;
    game = new MemoryGame(mode, difficulty);
});
document.getElementById('restart').addEventListener('click', () => location.reload());

if (document.getElementById('gameType').value == 'solo') {
    document.getElementById('opponentZone').style.display = "none";
} else {
    document.getElementById('opponentZone').style = "";
}

document.getElementById('gameType').addEventListener('change', (e) => {
    if (e.target.value == 'solo') {
        document.getElementById('opponentZone').style.display = "none";
    } else {
        document.getElementById('opponentZone').style = "";
    }
})