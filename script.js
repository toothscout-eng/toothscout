const menu=document.querySelector('.menu'),links=document.querySelector('.links');if(menu&&links)menu.addEventListener('click',()=>links.classList.toggle('open'));
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
document.querySelectorAll('form[data-mail]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form),pairs=[...d.entries()].map(([k,v])=>`${k}: ${v}`).join('\n');location.href=`mailto:hello@toothscout.com?subject=${encodeURIComponent(form.dataset.mail)}&body=${encodeURIComponent(pairs)}`}));


/* Animate the content inside the phone when it enters the screen */
document.addEventListener("DOMContentLoaded", function () {
   const phone = document.querySelector(".phone");
   if (!phone) {
       return;
   }
   const reducedMotion = window.matchMedia(
       "(prefers-reduced-motion: reduce)"
   ).matches;
   if (reducedMotion) {
       phone.classList.add("phone-active");
       return;
   }
   const phoneObserver = new IntersectionObserver(
       function (entries, observer) {
           entries.forEach(function (entry) {
               if (entry.isIntersecting) {
                   phone.classList.add("phone-active");
                   observer.unobserve(phone);
               }
           });
       },
       {
           threshold:0.3
       }
   );
   phoneObserver.observe(phone);
});
