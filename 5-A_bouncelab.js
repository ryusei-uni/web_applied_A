const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const info = document.getElementById("info");
const infolog = document.getElementById("info-log");
const ctrlindex = document.getElementById("ctrl-index");

let x = 40;
let y = 80;
let vx = 120;
let vy = 140;
let temp_vx = 120;
let temp_vy = 140;
let r = 14;
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
    if(e.code=== "ArrowDown"){
       if(vx!=0||vy!=0){
            temp_vx = vx;
            temp_vy = vy;
       }

        vx = 0;
        vy = 0;
    }

    if(e.code === "ArrowLeft"){
    
        r ++;
    }
    if(r != 0){
        if(e.code === "ArrowRight" ){
            r --;
        }
    }
    if(e.code === "Space"){
        chenge_color = "#ffd166";
    }

    if(e.code === "ArrowLeft"){
        
        r ++;
    }
    if(e.code === "KeyZ" ){
        r =14 ;
    }  
    keys[e.code] =true;
});

document.addEventListener("keyup",(e)=>{
keys[e.code] = false;
    if(e.code=== "ArrowDown"){

       vx = temp_vx;
       vy = temp_vy;
       


    }
});

function drawlog(){
    // infolog.innerHTML = "";

    ctrlindex.innerHTML += "<p>・Spaceキーで色を初期の色に戻します。</p>";
    ctrlindex.innerHTML += "<p>・上矢印キーで速度を上げれる</p>";
    ctrlindex.innerHTML += "<p>・下矢印キーでボールをその場で停止します</p>";
    ctrlindex.innerHTML += "<p>・右矢印キーでボールを小さくします</p>";
    ctrlindex.innerHTML += "<p>・左矢印キーでボールを大きくします</p>";
    ctrlindex.innerHTML += "<p>・Zキーでボールのサイズをリセットします</p>";
}

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
        chenge_color = "#"+(Math.floor(randomR)).toString(16) + (Math.floor(randomG)).toString(16) + (Math.floor(randomB)).toString(16);
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
    
    infolog.innerText = "はねた回数:"+ bouncing_count + "回" ;
    
    // ctrlindex.innerText = r;
    
    
    update(dt);
    draw();
    requestAnimationFrame(loop);
}

drawlog();

requestAnimationFrame(loop);

/*
   

*/