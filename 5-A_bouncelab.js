const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const info = document.getElementById("info");

let x = 40;
let y = 80;
let vx = 120;
let vy = 140;
const r = 14;
let last = performance.now();

// let chenge_color = "#ffd166";

keys ={};

document.addEventListener("keydown",(e)=>{
    if(e.code === "ArrowUp"){
        vx *= 1.2;
        vy *= 1.2;
    }
    // keys[e.code] =true;
});

// document.addEventListener("keyup",(e)=>{
// keys[e.code] = false;
// });

function update(dt){
    x += vx* dt;
    y += vy* dt;
    // x += vx;
    // y += vy;

    // if(keys[e.code] == "C"){
    //     chenge_color ="#d1ffff"
    // }

    if(x + r > canvas.width ){
        x =  canvas.width - r;
        vx = -vx;
    }

    if( x - r< 0){
        x = r ;
        vx = -vx;
    }

    if(y + r > canvas.height ){
        y =  canvas.height - r;
        vy = -vy;
    }


    if( y - r < 0){
        y = r ;
        vy = -vy;
    }
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
   
     ctx.fillStyle = chenge_color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
}

function loop(now){
    
    const dt = Math.min((now - last) / 1000, 0.033);
    // const dt = (now - last) /1000;

    last = now;
    

    info.textContent = "dt:"+ dt.toFixed(4)+ "秒 / 1秒に約" + (1 / dt).toFixed(0) + "回";

    update(dt);
    draw();
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

/*
   

*/