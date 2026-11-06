const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const info = document.getElementById("info");
const infolog = document.getElementById("info-log");

let x = 40;
let y = 80;
let vx = 120;
let vy = 140;
const r = 14;
let last = performance.now();

let chenge_color = "#ffd166";


let isclush =false;

let bouncing_count = 0;
keys ={};

document.addEventListener("keydown",(e)=>{
    if(e.code === "ArrowUp"){
        vx *= 1.2;
        vy *= 1.2;
    }
    keys[e.code] =true;
});

document.addEventListener("keyup",(e)=>{
keys[e.code] = false;
});

function update(dt){
    x += vx* dt;
    y += vy* dt;
    // x += vx;
    // y += vy;
    if(isclush){
        
        for(let i = 0; i < 3; i++){
            var randomR = Math.random() * 255       
            var randomG = Math.random() * 255       
            var randomB = Math.random() * 255       
        }
        chenge_color = "#"+(Math.floor(randomR)).toString(16) + (Math.floor(randomG)).toString(16) + (Math.floor(randomR)).toString(16);
        isclush =false

        vx /= 1.2;
        vy /= 1.2;
    }
    
    
    if(x + r > canvas.width ){
        x =  canvas.width - r;
        vx = -vx;
        bouncing_count++;
        isclush =true;
    }
    
    if( x - r< 0){
        x = r ;
        vx = -vx;
        bouncing_count++;
        isclush =true;
    }
    
    if(y + r > canvas.height ){
        y =  canvas.height - r;
        vy = -vy;
        bouncing_count++;
        isclush =true;
    }
    
    
    if( y - r < 0){
        y = r ;
        vy = -vy;
        bouncing_count++;
        isclush =true;
    }
    
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
   
    ctx.fillStyle = chenge_color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.font ="23px serif"
    ctx.fillStyle ="#FFFFFF";
    ctx.fillText("はねた回数:"+bouncing_count,10,24);
    
}

function loop(now){
    
    const dt = Math.min((now - last) / 1000, 0.033);
    // const dt = (now - last) /1000;

    last = now;
    

    info.textContent = "dt:"+ dt.toFixed(4)+ "秒 / 1秒に約" + (1 / dt).toFixed(0) + "回";

    infolog.innerHTML = "<p>"+bouncing_count+"</p>"

    update(dt);
    draw();
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

/*
   

*/