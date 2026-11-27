const mouse = {x: -100, y:-100};

canvas.addEventListener ("pointermove",(e) =>{
const rect = canvas.getBoundingClientRect();

mouse.x = e.clientX - rect.left;
// mouse.x = e.clientX ;
mouse.y = e.clientY - rect.top;s
// mouse.y = e.clientY ;
});

function drawAim(){
    ctx.strokeStyle = "#ffd166";
    ctx.beginPath();
    ctx.arc(mouse.x,mouse.y,12,0,Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#ffd166";
    ctx.fillRect(mouse.x -1,mouse.y -1,3,3);
}