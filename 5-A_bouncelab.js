const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');
const info = document.getElementById('info');
const infolog = document.getElementById('info-log');
const ctrlindex = document.getElementById('ctrl-index');
const btn = document.getElementById("ctrl-list")

let x = 40;
let y = 80;
let vx = 120;
let vy = 140;
let temp_vx = 120;
let temp_vy = 140;
let r = 14;
let last = performance.now();
let chenge_color = '#ffd166';
let isclush = false;
let bouncing_count = 0;
let keys = {};
let islogopen = false;


btn.addEventListener("click",(e)=>{
    if (islogopen) {
        // 閉じるときの処理
        closelog(); 
    } else {
        // 開くときの処理
        drawlog(); 
    }
    islogopen = !islogopen; 
});

document.addEventListener('keydown', (e) => {
     e.preventDefault();
  if (e.code === 'ArrowUp') {
    vx *= 1.2;
    vy *= 1.2;
  }
  if (e.code === 'ArrowDown') {
    if (vx != 0 || vy != 0) {
      temp_vx = vx;
      temp_vy = vy;
    }
    vx = 0;
    vy = 0;
  }
  if (e.code === 'ArrowLeft') {
    r++;
  }
  if (r != 0) {
    if (e.code === 'ArrowRight') {
      r--;
    }
  }
  if (e.code === 'Space') {
    chenge_color = '#ffd166';
  }
  if (r < canvas.width) {
    if (e.code === 'ArrowLeft') {
      r++;
    }
  }
  if (e.code === 'KeyR') {
    r = 14;
    vx = 120;
    vy = 140;
  }
  if (e.code === 'KeyX') {
    if (vx != 0) {
      temp_vx = vx;
    }
    vx = 0;
  }
  if (e.code === 'KeyC') {
    if (vy != 0) {
      temp_vy = vy;
    }
    vy = 0;
  }
  keys[e.code] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.code] = false;
  if (e.code === 'ArrowDown') {
    vx = temp_vx;
    vy = temp_vy;
  }
  // ※元コードの 'keyX' / 'keyC' を 'KeyX' / 'KeyC' に修正
  if (e.code === 'KeyX') {
    vx = temp_vx;
  }
  if (e.code === 'KeyC') {
    vy = temp_vy;
  }
});


function drawlog() {
  ctrlindex.innerHTML += '<p>・Spaceキーで色を初期の色に戻します。</p>';
  ctrlindex.innerHTML += '<p>・上矢印キーで速度を上げれる</p>';
  ctrlindex.innerHTML += '<p>・下矢印キーでボールをその場で停止します</p>';
  ctrlindex.innerHTML += '<p>・右矢印キーでボールを小さくします</p>';
  ctrlindex.innerHTML += '<p>・左矢印キーでボールを大きくします</p>';
  ctrlindex.innerHTML += '<p>・Rキーでボールのサイズや速度をリセットします</p>';
  ctrlindex.innerHTML += '<p>・XキーでVXを０にする離すと元に戻る</p>';
  ctrlindex.innerHTML += '<p>・CキーでVYを０にする離すと元に戻る</p>';
}

function closelog() {
  ctrlindex.innerHTML = "";
}

function update(dt) {
  x += vx * dt;
  y += vy * dt;

  if (isclush) {
    let randomR = Math.random() * 255;
    let randomG = Math.random() * 255;
    let randomB = Math.random() * 255;

    // 1桁の16進数になった時に2桁にゼロ埋めする処理を追加
    const toHex = (n) => Math.floor(n).toString(16).padStart(2, '0');
    chenge_color = `#${toHex(randomR)}${toHex(randomG)}${toHex(randomB)}`;

    isclush = false;
    vx /= 1.2;
    vy /= 1.2;
  }

  if (x + r > canvas.width) {
    x = canvas.width - r;
    vx = -vx;
    bouncing_count++;
    isclush = true;
  }
  if (x - r < 0) {
    x = r;
    vx = -vx;
    bouncing_count++;
    isclush = true;
  }
  if (y + r > canvas.height) {
    y = canvas.height - r;
    vy = -vy;
    bouncing_count++;
    isclush = true;
  }
  if (y - r < 0) {
    y = r;
    vy = -vy;
    bouncing_count++;
    isclush = true;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = chenge_color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '23px serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('はねた回数: ' + bouncing_count, 10, 24);
  ctx.fillText(
    '現在のスピード: VX: ' + Math.floor(vx) + ' VY: ' + Math.floor(vy),
    10,
    24 * 2
  );
  ctx.fillText('現在の半径: R: ' + Math.floor(r), 10, 24 * 3);
}

function loop(now) {
  const dt = Math.min((now - last) / 1000, 0.033);
  last = now;
  info.textContent =
    'dt: ' +
    dt.toFixed(4) +
    ' 秒 / 1秒に約 ' +
    (1 / dt).toFixed(0) +
    ' 回';
  infolog.innerText = 'はねた回数: ' + bouncing_count + ' 回';

  update(dt);
  draw();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
