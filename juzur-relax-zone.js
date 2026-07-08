const nav=document.getElementById('nav');
const glow=document.querySelector('.cursor-glow');
const words=['Relax zone.','Coffee time.','Quiet living.'];
const word=document.getElementById('word');
let i=0;
if(word){
  setInterval(()=>{i=(i+1)%words.length;word.textContent=words[i]},1500);
}
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
  const nextSrc=btn.dataset.img;
  if(!nextSrc||heroMainPhoto.src.endsWith(nextSrc))return;
  heroPhotoThumbs.forEach(item=>item.classList.remove('active'));
  btn.classList.add('active');

  const preload=new Image();
  preload.onload=()=>{
    heroMainPhoto.classList.add('is-changing');
    setTimeout(()=>{
      heroMainPhoto.src=nextSrc;
      requestAnimationFrame(()=>heroMainPhoto.classList.remove('is-changing'));
    },180);
  };
  preload.onerror=()=>{
    heroMainPhoto.src=nextSrc;
    heroMainPhoto.classList.remove('is-changing');
  };
  preload.src=nextSrc;
}

function startHeroPhotoRotation(){
  if(heroPhotoThumbs.length<2)return;
  clearInterval(heroPhotoTimer);
  heroPhotoTimer=setInterval(()=>showHeroPhoto(heroPhotoIndex+1),4600);
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

const GOOGLE_SHEETS_ENDPOINT='https://script.google.com/macros/s/AKfycbwSe1QGurJhBKVmZCCwlsrltcZ6PTHpZlpQkqvt2sCAxdMQxjoCifCeC0ZDAqx9JEGxLA/exec';
const PRODUCT_ORIGINAL_PRICE='EGP 2,499';
const PRODUCT_DISCOUNT='20%';
const PRODUCT_FINAL_PRICE='EGP 1,999';
const checkoutForm=document.getElementById('checkoutForm');
const checkoutSection=document.getElementById('checkout');
let checkoutIsSubmitting=false;

if(checkoutSection){
  const checkoutObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      document.body.classList.toggle('checkout-in-view',entry.isIntersecting);
    });
  },{threshold:.08});
  checkoutObserver.observe(checkoutSection);
}

checkoutForm?.addEventListener('submit',async event=>{
  event.preventDefault();
  if(checkoutIsSubmitting)return;
  checkoutIsSubmitting=true;
  const note=document.getElementById('checkoutNote');
  const submitButton=checkoutForm.querySelector('button[type="submit"]');
  if(submitButton){
    submitButton.disabled=true;
    submitButton.textContent='Submitting...';
  }
  const formData=new FormData(checkoutForm);
  const orderId=`JUZUR-${Date.now()}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
  const payload={
    orderId,
    name:(formData.get('name')||'').toString().trim(),
    address:(formData.get('address')||'').toString().trim(),
    phone:(formData.get('phone')||'').toString().trim(),
    pieces:(formData.get('pieces')||'1').toString().trim(),
    originalPrice:PRODUCT_ORIGINAL_PRICE,
    discount:PRODUCT_DISCOUNT,
    finalPrice:PRODUCT_FINAL_PRICE,
    submittedAt:new Date().toISOString()
  };

  if(note){
    note.textContent='Submitting your order...';
    note.classList.add('success');
  }

  const endpointIsReady=GOOGLE_SHEETS_ENDPOINT&&GOOGLE_SHEETS_ENDPOINT.startsWith('https://');
  try{
    if(endpointIsReady){
      const sheetsRequest=fetch(GOOGLE_SHEETS_ENDPOINT,{
        method:'POST',
        mode:'no-cors',
        body:JSON.stringify(payload)
      });
      const sendTimeout=new Promise(resolve=>setTimeout(resolve,4500));
      await Promise.race([sheetsRequest,sendTimeout]);
    }
    if(note){
      note.textContent=endpointIsReady
        ? 'Thank you. Your order was submitted and we will contact you to confirm delivery.'
        : 'Order ready on this page. Add the Google Sheets URL in the website file to save it automatically.';
    }
    checkoutForm.reset();
    if(checkoutForm.elements.pieces)checkoutForm.elements.pieces.value='1';
  }catch(error){
    if(note){
      note.textContent='The order could not be sent. Please try again or contact us directly.';
      note.classList.remove('success');
    }
  }finally{
    checkoutIsSubmitting=false;
    if(submitButton){
      submitButton.disabled=false;
      submitButton.textContent='Submit Order';
    }
  }
});
