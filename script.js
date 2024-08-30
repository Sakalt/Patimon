// モンスターのデータ
const monsters = {
    '日陰': { type: '火', hp: 120, attack: 25 },
    '銭亀': { type: '水', hp: 150, attack: 15 },
    '摩訶不思議シード': { type: '草', hp: 100, attack: 30 },
    '雷神': { type: '雷', hp: 130, attack: 20 },
    '眠り草': { type: '眠り', hp: 110, attack: 22 }
};

const typeAdvantages = {
    '火': '草',
    '水': '火',
    '草': '水',
    '雷': '水', // 雷は水に強い
    '眠り': '草' // 眠りは草に強い
};

let player = {
    name: '',
    type: '',
    hp: 100,
    attack: 20,
    xp: 0,
    level: 1
};

let enemy = {
    name: 'ランダムパチモン',
    type: '草',
    hp: 100,
    attack: 20
};

let steps = 0; // 草むらステージの進行状況

function chooseMonster() {
    document.getElementById("scene-intro").style.display = "none";
    document.getElementById("scene-choose").style.display = "block";
}

function startAdventure(monsterName, monsterType, monsterHp, monsterAttack) {
    player.name = monsterName;
    player.type = monsterType;
    player.hp = monsters[monsterName].hp;
    player.attack = monsters[monsterName].attack;
    
    enemy.name = 'ランダムパチモン';
    enemy.type = monsters[enemy.name].type;
    enemy.hp = monsters[enemy.name].hp;
    enemy.attack = monsters[enemy.name].attack;
    
    document.getElementById("scene-choose").style.display = "none";
    document.getElementById("scene-adventure").style.display = "block";
}

function explore(location) {
    let message = '';
    switch (location) {
        case 'center':
            player.hp = monsters[player.name].hp; // HPを全回復
            message = '回復センターでパチモンのHPが回復しました！';
            break;
        case 'rival':
            enemy.hp = monsters[enemy.name].hp; // ライバルの家でバトル
            message = 'ライバルの家に到着しました。バトルが始まるかも！';
            break;
        case 'grass':
            steps = 0;
            document.getElementById("scene-adventure").style.display = "none";
            document.getElementById("scene-grass").style.display = "block";
            document.getElementById("grass-message").textContent = '草むらに入った。進んでみよう！';
            break;
    }
    document.getElementById("explore-message").textContent = message;
}

function moveForward() {
    steps++;
    if (steps % 10 === 0) {
        encounterMonster();
    }
    document.getElementById("grass-message").textContent = `草むらを${steps}マス進んだ。`;
}

function encounterMonster() {
    const monsterNames = Object.keys(monsters);
    const randomName = monsterNames[Math.floor(Math.random() * monsterNames.length)];
    enemy = { ...monsters[randomName], name: randomName };
    
    document.getElementById("scene-grass").style.display = "none";
    document.getElementById("scene-battle").style.display = "block";
    
    document.getElementById("player-monster-name").textContent = player.name;
    document.getElementById("enemy-monster-name").textContent = enemy.name;
    document.getElementById("player-hp").textContent = player.hp;
    document.getElementById("player-attack").textContent = player.attack;
    document.getElementById("enemy-hp").textContent = enemy.hp;
    document.getElementById("enemy-attack").textContent = enemy.attack;
}

function returnToAdventure() {
    document.getElementById("scene-grass").style.display = "none";
    document.getElementById("scene-adventure").style.display = "block";
}

function attack() {
    const playerDamage = Math.max(0, player.attack - (enemy.type === typeAdvantages[player.type] ? 5 : 0));
    const enemyDamage = Math.max(0, enemy.attack - (player.type === typeAdvantages[enemy.type] ? 5 : 0));
    
    enemy.hp -= playerDamage;
    player.hp -= enemyDamage;
    
    document.getElementById("player-hp").textContent = player.hp;
    document.getElementById("enemy-hp").textContent = enemy.hp;
    document.getElementById("battle-message").textContent = `あなたのパチモンが${playerDamage}のダメージを与え、敵は${enemyDamage}のダメージを受けました。`;
    
    if (enemy.hp <= 0) {
        document.getElementById("battle-message").textContent = '敵のパチモンを倒しました！';
        saveGame();
    } else if (player.hp <= 0) {
        document.getElementById("battle-message").textContent = 'あなたのパチモンが倒されました。ゲームオーバー。';
        saveGame();
    }
}

function saveGame() {
    const gameData = {
        player,
        enemy,
        steps
    };
    localStorage.setItem('gameData', JSON.stringify(gameData));
}

function loadGame() {
    const savedData = localStorage.getItem('gameData');
    if (savedData) {
        const gameData = JSON.parse(savedData);
        player = gameData.player;
        enemy = gameData.enemy;
        steps = gameData.steps;
        
        document.getElementById("player-monster-name").textContent = player.name;
        document.getElementById("player-hp").textContent = player.hp;
        document.getElementById("player-attack").textContent = player.attack;
        document.getElementById("player-xp").textContent = player.xp;
        
        document.getElementById("enemy-monster-name").textContent = enemy.name;
        document.getElementById("enemy-hp").textContent = enemy.hp;
        document.getElementById("enemy-attack").textContent = enemy.attack;
    }
}

window.onload = loadGame;
