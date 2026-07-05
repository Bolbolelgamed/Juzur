const nav=document.getElementById('nav');
const glow=document.querySelector('.cursor-glow');
const words=['Relax zone.','Coffee time.','Quiet living.'];
let i=0;
setInterval(()=>{i=(i+1)%words.length;document.getElementById('word').textContent=words[i]},1500);
window.addEventListener('scroll',()=>{nav.classList.toggle('scrolled',scrollY>30);document.querySelectorAll('.parallax').forEach(el=>{el.style.translate=`0 ${scrollY*-0.04}px`})});
window.addEventListener('mousemove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
document.querySelectorAll('.thumb').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.thumb').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const img=document.getElementById('mainProduct');img.style.opacity=.2;setTimeout(()=>{img.src=btn.dataset.img;img.style.opacity=1},180)}));
const modal=document.getElementById('modal');
document.querySelectorAll('.lightbox').forEach(img=>img.addEventListener('click',()=>{modal.querySelector('img').src=img.src;modal.classList.add('open')}));
modal.addEventListener('click',()=>modal.classList.remove('open'));

const heroPhotoThumbs=[...document.querySelectorAll('.hero-photo-thumb')];
const heroMainPhoto=document.getElementById('heroMainPhoto');
let heroPhotoIndex=heroPhotoThumbs.findIndex(btn=>btn.classList.contains('active'));
let heroPhotoTimer;
if(heroPhotoIndex<0)heroPhotoIndex=0;

function showHeroPhoto(index){
  if(!heroMainPhoto||!heroPhotoThumbs.length)return;
  heroPhotoIndex=(index+heroPhotoThumbs.length)%heroPhotoThumbs.length;
  const btn=heroPhotoThumbs[heroPhotoIndex];
  heroPhotoThumbs.forEach(item=>item.classList.remove('active'));
  btn.classList.add('active');
  heroMainPhoto.classList.add('is-changing');
  setTimeout(()=>{
    heroMainPhoto.src=btn.dataset.img;
    heroMainPhoto.classList.remove('is-changing');
  },220);
}

function startHeroPhotoRotation(){
  if(heroPhotoThumbs.length<2)return;
  clearInterval(heroPhotoTimer);
  heroPhotoTimer=setInterval(()=>showHeroPhoto(heroPhotoIndex+1),3600);
}

heroPhotoThumbs.forEach((btn,index)=>btn.addEventListener('click',()=>{
  showHeroPhoto(index);
  startHeroPhotoRotation();
}));
startHeroPhotoRotation();

heroPhotoThumbs.forEach(btn=>btn.addEventListener('mouseenter',()=>{
  clearInterval(heroPhotoTimer);
}));
heroPhotoThumbs.forEach(btn=>btn.addEventListener('mouseleave',()=>{
  startHeroPhotoRotation();
}));

const checkoutForm=document.getElementById('checkoutForm');
checkoutForm?.addEventListener('submit',event=>{
  event.preventDefault();
  const pieces=checkoutForm.elements.pieces?.value||'1';
  const note=document.getElementById('checkoutNote');
  if(note){
    note.textContent=`Your request for ${pieces} SofaTray piece${pieces==='1'?'':'s'} is ready for confirmation.`;
    note.classList.add('success');
  }
  checkoutForm.reset();
  if(checkoutForm.elements.pieces)checkoutForm.elements.pieces.value='1';
});
