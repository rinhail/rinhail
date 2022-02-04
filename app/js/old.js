const mapHeight = 8;
const mapWidth = 25;
const restartButton = document.querySelector('#restart');

let x;
let y;
let score;
let HPcount;
let DMGcount;
let eneiesCount = 0;
let isHealExists = 0;

let generateMap = () => {
  let map = document.getElementById('map');
  let tbl = document.createElement('table');
	for (let i = 1;i <= mapHeight; i++) {
		let tr = tbl.insertRow();
    tr.classList.add('map-row');
  	for (let j = 1;j <= mapWidth; j++) {
    	let td = tr.insertCell();
      td.classList.add('map-cell');
      td.id = i + '_' + j;
    }
  }
  map.appendChild(tbl);
}

let generateLVL = () => {
  let isPlayerExists = 0;
	for (let i = 1;i <= mapHeight; i++) {
  	for (let j = 1;j <= mapWidth; j++) {
    	let element = document.getElementById(i + '_' + j);
    	if (getRandomInt(mapWidth) == 0) {
      	if (isPlayerExists == 0) {
        	element.classList.add('current');
          isPlayerExists = 1;
          x = j;
          y = i;
        }
      }
      if (getRandomInt(mapWidth) == 0) {
      	if (isHealExists == 0) {
        	element.classList.add('heal');
          isHealExists = 1;
        }
      }
      if (getRandomInt(mapHeight) == 0) {
        element.classList.add('enemy');
        eneiesCount += 1;
        enemiesCountOutput();
      }
    }
  }
}

let generateHeal = () => {
	for (let i = 1;i <= mapHeight; i++) {
  	for (let j = 1;j <= mapWidth; j++) {
    	let element = document.getElementById(i + '_' + j);
      if (getRandomInt(mapWidth) == 0) {
      	if (isHealExists == 0) {
        	element.classList.add('heal');
          isHealExists = 1;
        }
      }
    }
  }
}

let enemiesCountOutput = () => {
	let elelmentOutput = document.getElementById('enemies-output');
  let stringEnemies = '';
	for (let i = 1;i <= eneiesCount; i++) {
    stringEnemies += '☻';
  }
  elelmentOutput.innerHTML = stringEnemies;
}

let HPoutput = () => {
	let elelmentHP = document.getElementById('hp-output');
  let stringHP = '';
	for (let i = 1;i <= HPcount; i++) {
    stringHP += '♥';
  }
  elelmentHP.innerHTML = stringHP;
}

let updateScore = () => {
	let elelmentHP = document.getElementById('score-output');
  elelmentHP.innerHTML = score;
}

let getPoint = () => {
	score += 1;
  updateScore();
}

let takeDMG = () => {
	HPcount -= 1;
  if (HPcount == 0) {
  	gameOver();
  } else {
  	HPoutput();
    getPoint();
  }
}

let killEnemy = (element) => {
	element.classList.remove('enemy');
  eneiesCount -= 1;
  enemiesCountOutput();
}

let checkDMG = () => {
	let element = document.querySelector('.current');
	if (element.classList.contains('enemy')) {
    takeDMG();
    killEnemy(element);
  }
}

let getHeal = () => {
	let element = document.querySelector('.current');
	if (element.classList.contains('heal')) {
    HPcount += 1;
    HPoutput();
    element.classList.remove('heal');
    isHealExists = 0;
    generateHeal();
  }
}

let gameOver = () => {
	let elelmentHP = document.getElementById('hp-output');
  elelmentHP.innerHTML = 'DEAD';
  clearMap();
  x = 0;
  y = 0;
}

let clearMap = () => {
	for (let i = 1;i <= mapHeight; i++) {
  	for (let j = 1;j <= mapWidth; j++) {
		 let element = document.getElementById(i + '_' + j);
     element.className = '';
     element.classList.add('map-cell');
    }
  }
}

let clearOldCell = () => {
	let element = document.getElementById(y + '_' + x);
  element.classList.remove('current');
}

let paintCurrentCell = () => {
	let element = document.getElementById(y + '_' + x);
  element.classList.add('current');
}

let canItPass = (x, y) => {
let element = document.getElementById(y + '_' + x);
	if (element.classList.contains('map-cell')) {
    return true;
  }
}

let positionDetermination = () => {
	for (let i = 1;i <= mapHeight; i++) {
  	for (let j = 1;j <= mapWidth; j++) {
		 let element = document.getElementById(i + '_' + j);
     if (element.classList.contains('current')) {
       x = j;
       y = i;
     }
    }
  }
}

let moveTo = (key) => {
	if (key == 'ArrowLeft') {
  	if (canItPass(x - 1, y)) {
      clearOldCell();
      x -= 1;
      paintCurrentCell();
    }
  } else if (key == 'ArrowRight') {
    if (canItPass(x + 1, y)) {
      clearOldCell();
      x += 1;
      paintCurrentCell();
    }
  } else if (key == 'ArrowUp') {
    if (canItPass(x, y - 1)) {
      clearOldCell();
      y -= 1;
      paintCurrentCell();
    }
  } else if (key == 'ArrowDown') {
    if (canItPass(x, y + 1)) {
      clearOldCell();
      y += 1;
      paintCurrentCell();
    }
  }
}

let getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

let getEnemyPosition = (enemy) => {
	let enemyID = enemy.id;
  let enemyCord = enemyID.split("_");
  return enemyCord;
}

let clearEnemyOldCell = (enemy) => {
	enemy.classList.remove('enemy');
}

let paintEnemyNewCell = (y, x) => {
	let element = document.getElementById(y + '_' + x);
  element.classList.add('enemy');
}

let checkEnemyNextStep = (x, y) => {
	let enemyNextStep = document.getElementById(y + '_' + x);
	if (enemyNextStep.classList.contains('enemy')) {
  	return false;
  }
  return true;
}

let enemyMoveDown = (enemy) => {
	let enemyCord = getEnemyPosition(enemy);
  let y = Number(enemyCord[0]) + 1;
  let x = Number(enemyCord[1]);
  
  if (y <= mapHeight) {
  	if (checkEnemyNextStep(x, y)) {
      clearEnemyOldCell(enemy);
      paintEnemyNewCell(y, x);
    }
  }
}

let enemyMoveUp = (enemy) => {
	let enemyCord = getEnemyPosition(enemy);
  let y = Number(enemyCord[0]) - 1;
  let x = Number(enemyCord[1]);
  if (y >= 1) {
   if (checkEnemyNextStep(x, y)) {
      clearEnemyOldCell(enemy);
      paintEnemyNewCell(y, x);
    }
  }
}

let enemyMoveRight = (enemy) => {
	let enemyCord = getEnemyPosition(enemy);
  let y = Number(enemyCord[0]);
  let x = Number(enemyCord[1]) + 1;
  
  if (x <= mapWidth) {
    if (checkEnemyNextStep(x, y)) {
      clearEnemyOldCell(enemy);
      paintEnemyNewCell(y, x);
    }
  }
}

let enemyMoveLeft = (enemy) => {
	let enemyCord = getEnemyPosition(enemy);
  let y = Number(enemyCord[0]);
  let x = Number(enemyCord[1]) - 1;
  
  if (x >= 1) {
    if (checkEnemyNextStep(x, y)) {
      clearEnemyOldCell(enemy);
      paintEnemyNewCell(y, x);
    }
  }
}

let AI = () => {
	let AIstep = setInterval(() => {
    var enemies = document.getElementsByClassName('enemy');
    Array.prototype.forEach.call(enemies, enemy => {
      let fate = getRandomInt(4);
      if (fate == 0) {
        enemyMoveDown(enemy);
      } else if (fate == 1) {
        enemyMoveUp(enemy);
      } else if (fate == 2) {
        enemyMoveRight(enemy);
      } else {
        enemyMoveLeft(enemy);
      }
    });
  }, 1000);
}

let init = () => {
	HPcount = 3;
  eneiesCount= 0;
  score = 0;
  isHealExists = 0;
  
  control.focus()
  
  clearMap();
	generateLVL();
	HPoutput();
  positionDetermination();
  AI();
  
  let checkDMGinterval = setInterval(() => {
  	let DMGinterval = setTimeout(() => {
    	checkDMG();
    }, 1000);
  }, 100);
  
  let getHealInterval = setInterval(() => {
  	getHeal();
  }, 100);
}

let input = (e) => {
  let currentKey = e.key;
  moveTo(currentKey);
}

generateMap();
init();

restartButton.addEventListener('click', event => {
  init();
});

control.onkeyup = control.onkeypress = input;