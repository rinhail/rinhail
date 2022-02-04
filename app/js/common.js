const game = {
  score: undefined,
  isPlayerExists: false,
  isHealExists: false,
  enemiesCount: 0,
  restartButton: document.querySelector('#restart'),
  HPOutput: document.getElementById('hp-output'),
  enemiesOutput: document.getElementById('enemies-output'),
  scoreOutput: document.getElementById('score-output'),
  HPCountOutput() {
    let stringHP = ''
    for (let i = 1;i <= HPcount; i++) {
      stringHP += '♥'
    }
    this.HPOutput.innerHTML = stringHP;
  },
  enemiesCountOutput() {
    let stringEnemies = ''
    for (let i = 1;i <= this.enemiesCount; i++) {
      stringEnemies += '☻'
    }
    this.enemiesOutput.innerHTML = stringEnemies
  },
  updateScore() {
    this.scoreOutput.innerHTML = score
  },
  gameOver() {
    this.HPOutput.innerHTML = 'DEAD'
    map.clear()
    player.x = 0
    player.y = 0
  },
  getPoint() {
    score += 1
    this.updateScore()
  },
  getRandomInt(max) {
    return Math.floor(Math.random() * max)
  },
  init() {
    HPcount = 3
    eneiesCount= 0
    score = 0
    isHealExists = 0
    
    control.focus()
    
    map.clear()
    map.generateLVL()
    this.HPCountOutput()
    player.positionDetermination()
    enemy.AI()
  }
}

const map = {
  elem: document.getElementById('map'),
  table: document.createElement('table'),
  height: 8,
  width: 25,
  generateMap() {
    for (let i = 1;i <= this.height; i++) {
      let tr = this.table.insertRow()
      tr.classList.add('map-row')
      for (let j = 1;j <= this.width; j++) {
        let td = tr.insertCell()
        td.classList.add('map-cell')
        td.id = i + '_' + j
      }
    }
    this.elem.appendChild(this.table);
  },
  clear() {
    for (let i = 1;i <= this.height; i++) {
      for (let j = 1;j <= this.width; j++) {
       let element = document.getElementById(i + '_' + j)
       element.className = ''
       element.classList.add('map-cell')
      }
    }
  },
  clearOldCell() {
    let element = document.getElementById(player.y + '_' + player.x)
    element.classList.remove('current')
  },
  paintCurrentCell() {
    let element = document.getElementById(player.y + '_' + player.x)
    element.classList.add('current')
  },
  generateLVL() {
    for (let i = 1;i <= this.height; i++) {
      for (let j = 1;j <= this.width; j++) {
        let element = document.getElementById(i + '_' + j)
        if (game.getRandomInt(this.width) == 0) {
          if (game.isPlayerExists === false) {
            element.classList.add('current')
            game.isPlayerExists = 1
            player.x = j
            player.y = i
          }
        }
        if (game.getRandomInt(this.width) == 0) {
          if (game.isHealExists == 0) {
            element.classList.add('heal')
            game.isHealExists = true
          }
        }
        if (game.getRandomInt(this.height) == 0) {
          element.classList.add('enemy')
          game.enemiesCount += 1
          game.enemiesCountOutput()
        }
      }
    }
  },
  generateHeal() {
    for (let i = 1;i <= this.height; i++) {
      for (let j = 1;j <= this.width; j++) {
        let element = document.getElementById(i + '_' + j)
        if (game.getRandomInt(this.width) == 0) {
          if (game.isHealExists === false) {
            element.classList.add('heal')
            game.isHealExists = 1
          }
        }
      }
    }
  }
}

const player = {
  x: undefined,
  y: undefined,
  HPCount: undefined,
  DMGcount: undefined,
  takeDMG() {
    this.HPcount -= 1
    if (this.HPcount == 0) {
      game.gameOver()
    } else {
      game.HPoutput()
      game.getPoint()
    }
  },
  killEnemy(element) {
    element.classList.remove('enemy')
    game.enemiesCount -= 1
    game.enemiesCountOutput()
  },
  checkDMG() {
    let element = document.querySelector('.current')
    if (element.classList.contains('enemy')) {
      this.takeDMG()
      this.killEnemy(element)
    }
  },
  getHeal() {
    let element = document.querySelector('.current')
    if (element.classList.contains('heal')) {
      this.HPcount += 1
      game.HPoutput()
      element.classList.remove('heal')
      game.isHealExists = 0
      map.generateHeal()
    }
  },
  positionDetermination() {
    for (let i = 1;i <= map.height; i++) {
      for (let j = 1;j <= map.width; j++) {
       let element = document.getElementById(i + '_' + j)
       if (element.classList.contains('current')) {
         player.x = j
         player.y = i
       }
      }
    }
  },
  canItPass(x, y) {
    let element = document.getElementById(y + '_' + x)
    if (element.classList.contains('map-cell')) {
      return true
    }
  },
  moveTo(key) {
    if (key === 'ArrowLeft') {
      if (this.canItPass(this.x - 1, this.y)) {
        map.clearOldCell()
        this.x -= 1
        map.paintCurrentCell()
      }
    } else if (key === 'ArrowRight') {
      if (this.canItPass(this.x + 1, this.y)) {
        map.clearOldCell()
        this.x += 1
        map.paintCurrentCell()
      }
    } else if (key === 'ArrowUp') {
      if (this.canItPass(this.x, this.y - 1)) {
        map.clearOldCell()
        this.y -= 1
        map.paintCurrentCell()
      }
    } else if (key === 'ArrowDown') {
      if (this.canItPass(this.x, this.y + 1)) {
        map.clearOldCell()
        this.y += 1
        map.paintCurrentCell()
      }
    }
  }
}

const enemy = {
  getEnemyPosition(enemy) {
    let enemyID = enemy.id
    let enemyCord = enemyID.split("_")
    return enemyCord
  },
  clearEnemyOldCell(enemy) {
    enemy.classList.remove('enemy')
  },
  paintEnemyNewCell(y, x) {
    let element = document.getElementById(y + '_' + x)
    element.classList.add('enemy')
  },
  checkEnemyNextStep(x, y) {
    let enemyNextStep = document.getElementById(y + '_' + x)
    if (enemyNextStep.classList.contains('enemy')) {
      return false
    }
    return true
  },
  enemyMoveDown(enemy) {
    let enemyCord = this.getEnemyPosition(enemy);
    let y = Number(enemyCord[0]) + 1
    let x = Number(enemyCord[1])
    
    if (y <= map.height) {
      if (this.checkEnemyNextStep(x, y)) {
        this.clearEnemyOldCell(enemy)
        this.paintEnemyNewCell(y, x)
      }
    }
  },
  enemyMoveUp(enemy) {
    let enemyCord = this.getEnemyPosition(enemy);
    let y = Number(enemyCord[0]) - 1
    let x = Number(enemyCord[1])
    if (y >= 1) {
      if (this.checkEnemyNextStep(x, y)) {
        this.clearEnemyOldCell(enemy)
        this.paintEnemyNewCell(y, x)
      }
    }
  },
  enemyMoveRight(enemy) {
    let enemyCord = this.getEnemyPosition(enemy)
    let y = Number(enemyCord[0])
    let x = Number(enemyCord[1]) + 1
    
    if (x <= map.width) {
      if (this.checkEnemyNextStep(x, y)) {
        this.clearEnemyOldCell(enemy)
        this.paintEnemyNewCell(y, x)
      }
    }
  },
  enemyMoveLeft(enemy) {
    let enemyCord = this.getEnemyPosition(enemy)
    let y = Number(enemyCord[0])
    let x = Number(enemyCord[1]) - 1
    
    if (x >= 1) {
      if (this.checkEnemyNextStep(x, y)) {
        this.clearEnemyOldCell(enemy)
        this.paintEnemyNewCell(y, x)
      }
    }
  },
  AI() {
    let AIstep = setInterval(() => {
      var enemies = document.getElementsByClassName('enemy')
      Array.prototype.forEach.call(enemies, enemy => {
        let fate = game.getRandomInt(4)
        if (fate == 0) {
          this.enemyMoveDown(enemy)
        } else if (fate == 1) {
          this.enemyMoveUp(enemy)
        } else if (fate == 2) {
          this.enemyMoveRight(enemy)
        } else {
          this.enemyMoveLeft(enemy)
        }
      })
    }, 1000)
  }
}

let input = (e) => {
  let currentKey = e.key
  player.moveTo(currentKey)
}

map.generateMap()
game.init()

game.restartButton.addEventListener('click', event => {
  game.init()
});

control.onkeyup = control.onkeypress = input