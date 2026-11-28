const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

const BOUNCE = 0.45;
const STOP_SPEED = 250;
const FRICTION = 0;


const floor = {x:0,y:320,w:640,h:40};

const plat = {x:300,y:230,w:160,h:16};

const sky = ctx.createLinearGradient(0, 0, 0, floor.y);
sky.addColorStop(0, "#211d47");
sky.addColorStop(0.58, "#8f4671");
sky.addColorStop(1, "#ee996e");
const stars = [[40, 65], [93, 89], [156, 64], [224, 32], [282, 77],
  [346, 45], [407, 94], [482, 49], [560, 79], [604, 59]];
const ridge = [[0, 249], [72, 193], [146, 253], [224, 207], [301, 269],
  [366, 236], [459, 278], [556, 211], [640, 255]];

function drawScenery() {
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, floor.y);
  ctx.fillStyle = "#ffdfc2";
  for (const [x, y] of stars) {
    ctx.fillRect(x, y, 3, 3);
  }

  ctx.fillStyle = "#ffbd89";
  ctx.beginPath();
  ctx.arc(493, 178, 52, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#db8b88";
  ctx.fillRect(96, 133, 84, 5);
  ctx.fillRect(121, 125, 38, 8);
  ctx.fillRect(374, 155, 94, 4);
  ctx.fillRect(394, 148, 48, 7);

  ctx.fillStyle = "#694165";
  ctx.beginPath();
  ctx.moveTo(0, floor.y);
  for (const [x, y] of ridge) {
    ctx.lineTo(x, y);
  }
  ctx.lineTo(canvas.width, floor.y);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#2c203d";
  ctx.fillRect(floor.x, floor.y, floor.w, floor.h);
  ctx.fillStyle = "#503653";
  for (let x = 12; x < floor.w; x += 32) {
    ctx.fillRect(x, floor.y + 12, 16, 4);
    ctx.fillRect(x + 4, floor.y + 23, 8, 3);
  }

  ctx.fillStyle = "#442c4d";
  ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
  ctx.fillStyle = "#8b5975";
  ctx.fillRect(plat.x + 8, plat.y + 7, plat.w - 16, 3);
  ctx.fillStyle = "#eeba8c";
  ctx.fillRect(floor.x, floor.y, floor.w, 3);
  ctx.fillRect(plat.x, plat.y, plat.w, 3);
}
