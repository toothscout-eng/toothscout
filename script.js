const menu=document.querySelector('.menu'),links=document.querySelector('.links');if(menu&&links)menu.addEventListener('click',()=>links.classList.toggle('open'));
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
document.addEventListener("DOMContentLoaded", function () {

    const phone = document.querySelector(".phone");

    if (!phone) return;

    phone.classList.add("phone-active");

});
 


