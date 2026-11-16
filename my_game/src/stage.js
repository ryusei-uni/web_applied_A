const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

const BOUNCE = 0.45;
const STOP_SPEED = 250;
const FRICTION = 0;


const TARGET_HEIGHT = 64;

const floor = {x:0,y:320,w:640,h:40};

const plat = {x:300,y:230,w:160,h:16};

function drawStage(){
    ctx.fillStyle = "#203060";
    ctx.fillRect(floor.x,floor.y,floor.w,floor.h);
}

function drawPlat(){

    ctx.fillStyle = "#2e446e";
    ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
}