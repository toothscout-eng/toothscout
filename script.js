const menu=document.querySelector('.menu'),links=document.querySelector('.links');if(menu&&links)menu.addEventListener('click',()=>links.classList.toggle('open'));
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
document.addEventListener("DOMContentLoaded", function () {

    const phone = document.querySelector(".phone");

    if (!phone) return;

    phone.classList.add("phone-active");

});
 


const canvas=document.getElementById("particleCanvas");if(canvas){const ctx=canvas.getContext("2d");let particles=[];let mouse={x:null,y:null};function resizeCanvas(){canvas.width=canvas.offsetWidth*window.devicePixelRatio;canvas.height=canvas.offsetHeight*window.devicePixelRatio;ctx.setTransform(1,0,0,1,0,0);ctx.scale(window.devicePixelRatio,window.devicePixelRatio)}resizeCanvas();window.addEventListener("resize",()=>{resizeCanvas();createParticles()});window.addEventListener("mousemove",e=>{const r=canvas.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top});class Particle{constructor(){this.x=Math.random()*canvas.offsetWidth;this.y=Math.random()*canvas.offsetHeight;this.size=Math.random()*2.8+.4;this.speedX=(Math.random()-.5)*.08;this.speedY=(Math.random()-.5)*.08;this.opacity=Math.random();this.fade=.001+Math.random()*.003;this.grow=Math.random()>.5}update(){this.x+=this.speedX;this.y+=this.speedY;if(this.grow){this.opacity+=this.fade;if(this.opacity>=1)this.grow=false}else{this.opacity-=this.fade;if(this.opacity<=0){this.x=Math.random()*canvas.offsetWidth;this.y=Math.random()*canvas.offsetHeight;this.opacity=0;this.grow=true}}if(mouse.x){let dx=mouse.x-this.x;let dy=mouse.y-this.y;let dist=Math.sqrt(dx*dx+dy*dy);if(dist<120){this.x-=dx*.0007;this.y-=dy*.0007}}}draw(){ctx.beginPath();ctx.fillStyle=`rgba(70,240,255,${this.opacity})`;ctx.shadowColor="rgba(70,240,255,.8)";ctx.shadowBlur=24;ctx.arc(this.x,this.y,this.size,0,Math.PI*2);ctx.fill()}}function createParticles(){particles=[];const count=window.innerWidth<768?180:420;for(let i=0;i<count;i++){particles.push(new Particle())}}createParticles();function connect(){for(let a=0;a<particles.length;a++){for(let b=a+1;b<particles.length;b++){let dx=particles[a].x-particles[b].x;let dy=particles[a].y-particles[b].y;let dist=Math.sqrt(dx*dx+dy*dy);if(dist<140){ctx.beginPath();ctx.strokeStyle=`rgba(70,240,255,${(1-dist/140)*0.12})`;ctx.lineWidth=1.1;ctx.moveTo(particles[a].x,particles[a].y);ctx.lineTo(particles[b].x,particles[b].y);ctx.stroke()}}}}function animate(){ctx.clearRect(0,0,canvas.offsetWidth,canvas.offsetHeight);particles.forEach(p=>{p.update();p.draw()});connect();requestAnimationFrame(animate)}animate()}
