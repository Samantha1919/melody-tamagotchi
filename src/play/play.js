const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d"); // context

let rightPressed = false;
let leftPressed = false;
let playerX = canvas.width / 2;
const playerSize = 50;
const squares = [];
let score = 0;
let gameOver = false; // devient true quand on perd, pour stopper la boucle de jeu
const playerImage = new Image();
playerImage.src = "../assets/normal.svg";

const bowImage = new Image();
bowImage.src = "../assets/bow-pink.svg";

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

for (let i = 0; i < 4; i++) {
  // pr en avoir seulement 4 max qui tombent en mm temps
  squares.push({
    x: Math.random() * (canvas.width - playerSize), // pr pas que ca sorte du canvas
    y: Math.random() * -canvas.height,
    size: playerSize, // la taille du carré cest la taille du player
  });
}

function drawPlayer() {
  context.drawImage(
    playerImage,
    playerX, // position horizonzale
    canvas.height - playerSize - 5, // position verticale
    playerSize, // taille en largeur
    playerSize, // taille en hauteur
  );
}

function drawsquares() {
  squares.forEach((square) => {
    context.drawImage(bowImage, square.x, square.y, square.size, square.size); // drawImage ca cree une image de forme carrée vu quon a mis square fin dune taille precise

    square.y += 2; // vitesse
    if (square.y > canvas.height) {
      square.y = 0 - square.size;
      square.x = Math.random() * (canvas.width - playerSize);
    }

    if (
      playerX < square.x + square.size &&
      playerX + playerSize > square.x &&
      canvas.height - playerSize - 5 < square.y + square.size
    ) {
      gameOver = true; // on arrete le jeu AVANT l'alerte, pour pas qu'une 2e collision declenche une 2e alerte
      alert("Game Over! Your score: " + score);
      // On demande au processus main (index.js) de recharger la fenetre via IPC
      window.electronAPI.reloadWindow();
    }
  });
}

function draw() {
  if (gameOver) return; // le jeu est fini : on stoppe la boucle (plus de requestAnimationFrame)

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.strokeRect(0, 0, canvas.width, canvas.height);
  context.closePath();
  drawPlayer();
  drawsquares();
  drawScore();

  if (rightPressed) {
    playerX = Math.min(playerX + 7, canvas.width - playerSize);
  } else if (leftPressed) {
    playerX = Math.max(playerX - 7, 0);
  }

  requestAnimationFrame(draw);
}

draw();

function drawScore() {
  context.font = "16px Arial";
  context.fillStyle = "black";
  context.fillText("Score: " + score, 8, 20);
}

setInterval(() => {
  score++;
}, 1000);
