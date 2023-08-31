class Ghost {
    constructor(user,pp,size,x, y, width, height, speed, imageX, imageY, imageWidth, imageHeight, range) {
        this.user = user;
        this.pp = pp;
        this.size = size;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = DIRECTION_RIGHT;
        this.imageX = imageX;
        this.imageY = imageY;
        this.imageHeight = imageHeight;
        this.imageWidth = imageWidth;
        this.range = range;
        this.randomTargetIndex = parseInt(Math.random() * 4);
        this.target = randomTargetsForGhosts[this.randomTargetIndex];
        setInterval(() => {
            this.changeRandomDirection();
        }, 1000);
    }

        clear() {
        canvasContext.clearRect(this.x, this.y, this.width, this.height);
    }

    changeRandomDirection() {
        this.randomTargetIndex = Math.floor(Math.random() * 4);
        this.target = randomTargetsForGhosts[this.randomTargetIndex];
    }

    moveProcess() {
        if (this.isInRange()) {
            this.target = randomTargetsForGhosts[this.randomTargetIndex];
          } else {
            this.target = pacman;
          }
          
        this.changeDirectionIfPossible();
        this.moveForwards();
        if (this.checkCollisions()) {
            this.moveBackwards();
            return;
        }
    }

    isInRange() {
        let xDistance = Math.abs(pacman.getMapX() - this.getMapX());
        let yDistance = Math.abs(pacman.getMapY() - this.getMapY());
        if (
            Math.sqrt(xDistance * xDistance + yDistance * yDistance) <=
            this.range
        ) {
            return true;
        }
        return false;
    }




      
    moveBackwards() {
        switch (this.direction) {
            case 4: // Right
                this.x -= this.speed;
                break;
            case 3: // Up
                this.y += this.speed;
                break;
            case 2: // Left
                this.x += this.speed;
                break;
            case 1: // Bottom
                this.y -= this.speed;
                break;
        }
    }

    moveForwards() {
        switch (this.direction) {
            case 4: // Right
                this.x += this.speed;
                break;
            case 3: // Up
                this.y -= this.speed;
                break;
            case 2: // Left
                this.x -= this.speed;
                break;
            case 1: // Bottom
                this.y += this.speed;
                break;
        }
    }

    checkCollisions() {
        let isCollided = false;
        if (
            map[parseInt(this.y / oneBlockSize)][
                parseInt(this.x / oneBlockSize)
            ] == 1 ||
            map[parseInt(this.y / oneBlockSize + 0.9999)][
                parseInt(this.x / oneBlockSize)
            ] == 1 ||
            map[parseInt(this.y / oneBlockSize)][
                parseInt(this.x / oneBlockSize + 0.9999)
            ] == 1 ||
            map[parseInt(this.y / oneBlockSize + 0.9999)][
                parseInt(this.x / oneBlockSize + 0.9999)
            ] == 1
        ) {
            isCollided = true;
        }
        return isCollided;
    }

    changeDirectionIfPossible() {
        let tempDirection = this.direction;
        this.direction = this.calculateNewDirection(
            map,
            parseInt(this.target.x / oneBlockSize),
            parseInt(this.target.y / oneBlockSize)
        );
        if (typeof this.direction == "undefined") {
            this.direction = tempDirection;
            return;
        }
        let xBefore = this.x;
        let yBefore = this.y;
        this.moveForwards();
        if (this.checkCollisions()) {
            this.x = xBefore;
            this.y = yBefore;
            this.direction = tempDirection;
        }
    }
    

    calculateNewDirection(map, destX, destY) {
        let mp = [];
        for (let i = 0; i < map.length; i++) {
            mp[i] = map[i].slice();
        }

        let queue = [
            {
                x: this.getMapX(),
                y: this.getMapY(),
                rightX: this.getMapXRightSide(),
                rightY: this.getMapYRightSide(),
                moves: [],
            },
        ];
        while (queue.length > 0) {
            let poped = queue.shift();
            if (poped.x == destX && poped.y == destY) {
                return poped.moves[0];
            } else {
                mp[poped.y][poped.x] = 1;
                let neighborList = this.addNeighbors(poped, mp);
                for (let i = 0; i < neighborList.length; i++) {
                    queue.push(neighborList[i]);
                }
            }
        }

        return 1; // direction
    }

    addNeighbors(poped, mp) {
        let queue = [];
        let numOfRows = mp.length;
        let numOfColumns = mp[0].length;

        if (
            poped.x - 1 >= 0 &&
            poped.x - 1 < numOfRows &&
            mp[poped.y][poped.x - 1] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_LEFT);
            queue.push({ x: poped.x - 1, y: poped.y, moves: tempMoves });
        }
        if (
            poped.x + 1 >= 0 &&
            poped.x + 1 < numOfRows &&
            mp[poped.y][poped.x + 1] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_RIGHT);
            queue.push({ x: poped.x + 1, y: poped.y, moves: tempMoves });
        }
        if (
            poped.y - 1 >= 0 &&
            poped.y - 1 < numOfColumns &&
            mp[poped.y - 1][poped.x] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_UP);
            queue.push({ x: poped.x, y: poped.y - 1, moves: tempMoves });
        }
        if (
            poped.y + 1 >= 0 &&
            poped.y + 1 < numOfColumns &&
            mp[poped.y + 1][poped.x] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_BOTTOM);
            queue.push({ x: poped.x, y: poped.y + 1, moves: tempMoves });
        }
        return queue;
    }

    getMapX() {
        let mapX = parseInt(this.x / oneBlockSize);
        return mapX;
    }

    getMapY() {
        let mapY = parseInt(this.y / oneBlockSize);
        return mapY;
    }

    getMapXRightSide() {
        let mapX = parseInt((this.x * 0.99 + oneBlockSize) / oneBlockSize);
        return mapX;
    }

    getMapYRightSide() {
        let mapY = parseInt((this.y * 0.99 + oneBlockSize) / oneBlockSize);
        return mapY;
    }

    changeAnimation() {
        this.currentFrame =
            this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
    }

   draw(pp,size) {
    let ghostImage = new Image();
    ghostImage.src = pp;
    canvasContext.save();
    canvasContext.drawImage(
        ghostImage,
        this.imageX,
        this.imageY,
        this.imageWidth,
        this.imageHeight,
        this.x,
        this.y,
        size,
        size,
    );
    canvasContext.restore();
}

    
}

// Profil resmini ve tebrikler mesajını gösteren fonksiyon
function showProfilePictureAndMessage(ghost) {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
  
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
  
    // Arka planı oluşturma
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    let img = new Image();
    img.src = ghost.pp;
  
    img.onload = function() {
      // Resmin boyutlarını canvas boyutlarına göre ayarlama
      let imgRatio = img.width / img.height;
      let canvasRatio = canvas.width / canvas.height;
  
      let imgWidth, imgHeight;
  
      if (imgRatio > canvasRatio) {
        imgWidth = canvas.width;
        imgHeight = canvas.width / imgRatio;
      } else {
        imgWidth = canvas.height * imgRatio;
        imgHeight = canvas.height;
      }
  
      let x = (canvas.width - imgWidth) / 2;
      let y = (canvas.height - imgHeight) / 2;
  
      ctx.drawImage(img, x, y, imgWidth, imgHeight);
  
      // Tebrikler yazısı için ayarlar
      ctx.font = '40px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(ghost.user, centerX, centerY + imgHeight / 2 + 13);
  
      setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        removeGhost(ghost);
      }, 20000);
    };
  }
  

  function removeGhost(ghost) {
    let index = ghosts.indexOf(ghost);
    if (index > -1) {
      ghosts.splice(index, 1);
    }
  }

function isGhostAtExit(ghost) {
    let exitX = (map[0].length - 2) * oneBlockSize;
    let exitY = (map.length - 2) * oneBlockSize;
    return ghost.x === exitX && ghost.y === exitY;
  }

let updateGhosts = () => {
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].moveProcess();
        if (isGhostAtExit(ghosts[i])) {
            showProfilePictureAndMessage(ghosts[i]);
          }
    }
};

let drawGhosts = () => {
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].draw( ghosts[i].pp,ghosts[i].size);
    }
};
