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
const heroGallery=document.getElementById('heroGallery');
const heroPreviousImage=document.getElementById('heroPreviousImage');
const heroCurrentImage=document.getElementById('heroCurrentImage');
const heroImageCache=new Map();
let heroPhotoIndex=heroPhotoThumbs.findIndex(btn=>btn.classList.contains('active'));
let heroPhotoTimer;
let heroPhotoIdleTimer;
let heroPhotoAnimating=false;
let queuedHeroPhotoIndex=null;
if(heroPhotoIndex<0)heroPhotoIndex=0;

function preloadHeroImage(src){
  if(heroImageCache.has(src))return heroImageCache.get(src);
  const request=new Promise((resolve,reject)=>{
    const img=new Image();
    img.onload=()=>resolve(src);
    img.onerror=reject;
    img.decoding='async';
    img.src=src;
  });
  heroImageCache.set(src,request);
  return request;
}

heroPhotoThumbs.forEach(btn=>{
  const src=btn.dataset.img;
  if(src)preloadHeroImage(src).catch(()=>{});
});

function stopHeroAutoplay(){
  clearInterval(heroPhotoTimer);
  clearTimeout(heroPhotoIdleTimer);
}

function scheduleHeroAutoplay(){
  stopHeroAutoplay();
  if(heroPhotoThumbs.length<2)return;
  heroPhotoIdleTimer=setTimeout(()=>{
    heroPhotoTimer=setInterval(()=>showHeroPhoto(heroPhotoIndex+1),7200);
  },3600);
}

function setHeroThumbState(index,state){
  heroPhotoThumbs.forEach((item,itemIndex)=>{
    item.classList.toggle('active',itemIndex===index&&state==='active');
    item.classList.toggle('is-pending',itemIndex===index&&state==='pending');
  });
}

async function showHeroPhoto(index){
  if(!heroPreviousImage||!heroCurrentImage||!heroPhotoThumbs.length)return;
  const normalizedIndex=(index+heroPhotoThumbs.length)%heroPhotoThumbs.length;
  if(heroPhotoAnimating){
    queuedHeroPhotoIndex=normalizedIndex;
    return;
  }
  const btn=heroPhotoThumbs[normalizedIndex];
  const nextSrc=btn.dataset.img;
  if(!nextSrc||heroCurrentImage.src.endsWith(nextSrc))return;

  stopHeroAutoplay();
  setHeroThumbState(normalizedIndex,'pending');

  try{
    await preloadHeroImage(nextSrc);
  }catch(error){
    setHeroThumbState(heroPhotoIndex,'active');
    scheduleHeroAutoplay();
    return;
  }

  heroPhotoAnimating=true;
  const oldSrc=heroCurrentImage.getAttribute('src');
  heroPreviousImage.src=oldSrc;
  heroPreviousImage.className='hero-gallery-layer hero-gallery-layer-previous is-visible';
  heroCurrentImage.src=nextSrc;
  heroCurrentImage.className='hero-gallery-layer hero-gallery-layer-current';
  heroPhotoIndex=normalizedIndex;
  setHeroThumbState(heroPhotoIndex,'active');

  requestAnimationFrame(()=>{
    heroGallery?.classList.add('is-transitioning');
    heroPreviousImage.classList.add('is-leaving');
    heroCurrentImage.classList.add('is-visible');
  });

  window.setTimeout(()=>{
    heroPreviousImage.className='hero-gallery-layer hero-gallery-layer-previous';
    heroCurrentImage.className='hero-gallery-layer hero-gallery-layer-current is-visible';
    heroPhotoAnimating=false;
    const queuedIndex=queuedHeroPhotoIndex;
    queuedHeroPhotoIndex=null;
    heroGallery?.classList.remove('is-transitioning');
    if(queuedIndex!==null&&queuedIndex!==heroPhotoIndex){
      showHeroPhoto(queuedIndex);
      return;
    }
    scheduleHeroAutoplay();
  },430);
}

function startHeroPhotoRotation(){
  if(heroPhotoThumbs.length<2)return;
  stopHeroAutoplay();
  heroPhotoTimer=setInterval(()=>showHeroPhoto(heroPhotoIndex+1),7200);
}

heroPhotoThumbs.forEach((btn,index)=>btn.addEventListener('click',()=>{
  stopHeroAutoplay();
  showHeroPhoto(index);
}));
startHeroPhotoRotation();

heroPhotoThumbs.forEach(btn=>btn.addEventListener('mouseenter',stopHeroAutoplay));
heroPhotoThumbs.forEach(btn=>btn.addEventListener('mouseleave',scheduleHeroAutoplay));

if(heroGallery){
  let pointerId=null;
  let startX=0;
  let startY=0;
  let dragX=0;
  let isDragging=false;
  const releaseDrag=()=>{
    pointerId=null;
    isDragging=false;
    heroGallery.classList.remove('is-dragging');
  };
  heroGallery.addEventListener('pointerdown',event=>{
    if(event.pointerType==='mouse'&&event.button!==0)return;
    pointerId=event.pointerId;
    startX=event.clientX;
    startY=event.clientY;
    dragX=0;
    isDragging=false;
    stopHeroAutoplay();
    heroGallery.setPointerCapture(pointerId);
  });
  heroGallery.addEventListener('pointermove',event=>{
    if(pointerId!==event.pointerId)return;
    dragX=event.clientX-startX;
    const dragY=event.clientY-startY;
    if(!isDragging){
      if(Math.abs(dragX)<8||Math.abs(dragX)<Math.abs(dragY))return;
      isDragging=true;
      heroGallery.classList.add('is-dragging');
    }
    event.preventDefault();
  },{passive:false});
  heroGallery.addEventListener('pointerup',event=>{
    if(pointerId!==event.pointerId)return;
    if(isDragging&&Math.abs(dragX)>64){
      showHeroPhoto(dragX<0?heroPhotoIndex+1:heroPhotoIndex-1);
    }else{
      scheduleHeroAutoplay();
    }
    releaseDrag();
  });
  heroGallery.addEventListener('pointercancel',()=>{
    releaseDrag();
    scheduleHeroAutoplay();
  });
  heroGallery.addEventListener('lostpointercapture',releaseDrag);
}

const GOOGLE_SHEETS_ENDPOINT='https://script.google.com/macros/s/AKfycbwSe1QGurJhBKVmZCCwlsrltcZ6PTHpZlpQkqvt2sCAxdMQxjoCifCeC0ZDAqx9JEGxLA/exec';
const PRODUCT_ORIGINAL_PRICE='EGP 2,499';
const PRODUCT_DISCOUNT='20%';
const PRODUCT_FINAL_PRICE='EGP 1,999';
const checkoutForm=document.getElementById('checkoutForm');
const checkoutSection=document.getElementById('checkout');
const heroCta=document.querySelector('[data-hero-cta]');
let checkoutIsSubmitting=false;

function setHeroCtaVisibilityState(isVisible){
  document.body.classList.add('sticky-cta-ready');
  document.body.classList.toggle('hero-cta-in-view',isVisible);
}

if(heroCta){
  if('IntersectionObserver' in window){
    const heroCtaObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        setHeroCtaVisibilityState(entry.isIntersecting);
      });
    },{threshold:.01});
    heroCtaObserver.observe(heroCta);
  }else{
    const updateHeroCtaState=()=>{
      const rect=heroCta.getBoundingClientRect();
      setHeroCtaVisibilityState(rect.bottom>0&&rect.top<window.innerHeight);
    };
    updateHeroCtaState();
    window.addEventListener('scroll',updateHeroCtaState,{passive:true});
    window.addEventListener('resize',updateHeroCtaState);
  }
}

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
