

function update(dt){


    // updataPlayer(dt);
}

function draw(){

    ctx.clearRect(0, 0,  canvas.width, canvas.height);

    // ctx.fillStyle = "#7ef5e1";
     drawPlayer();
   

    // 目印の線（跳んだ高さをくらべる）
    ctx.fillStyle = "#ff6b6b";
      ctx.fillRect(0, floor.y - TARGET_HEIGHT, canvas.width, 2);

    drawPlat();
   
    drawStage();
}

let last = performance.now();

function loop(now){
    const dt = Math.min((now - last) / 1000, 0.033);

    last = now;
    update(dt);
    draw();
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/*
  
*/