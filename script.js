'use strict';
// Paste the Stripe Payment Link created for the 1,499 THB Private Workshop here.
// Example format: https://buy.stripe.com/xxxxxxxxxxxxxxxxxx
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/8x2dR99JP14ecuSdX0dUY00';
const META_PIXEL_ID = '1029806336785697';
const ACADEMY = { consultationUrl: '', facebook: '', instagram: '', line: '' };
// Change this value when the offer deadline changes (Bangkok time).
const PROMO_END_AT = '2026-10-08T23:59:59+07:00';
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function trackMetaEvent(eventName, parameters = {}) {
  if (typeof window.fbq === 'function') window.fbq('track', eventName, parameters);
}
function closeMenu() {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'เปิดเมนู');
}
menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'ปิดเมนู' : 'เปิดเมนู');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
window.matchMedia('(min-width: 601px)').addEventListener('change', closeMenu);
document.querySelector('#year').textContent = new Date().getFullYear();
const countdownHeader = document.querySelector('.header');
const pricingContainer = document.querySelector('#pricing .container');
if (countdownHeader && pricingContainer) {
  const countdownNavigation = countdownHeader.querySelector('#navigation');
  const insertCountdown = countdownNavigation || countdownHeader;
  insertCountdown.insertAdjacentHTML(countdownNavigation ? 'afterend' : 'beforeend', `
    <div class="countdown-bar" id="countdownBar" aria-label="เวลาคงเหลือของโปรโมชัน">
      <span class="countdown-bar-label">ราคาพิเศษเหลืออีก</span>
      <div class="countdown-inline" aria-live="off">
        <span><b data-countdown-days>10</b><small>วัน</small></span><i>:</i>
        <span><b data-countdown-hours>00</b><small>ชม.</small></span><i>:</i>
        <span><b data-countdown-minutes>00</b><small>นาที</small></span><i>:</i>
        <span><b data-countdown-seconds>00</b><small>วิ</small></span>
      </div><a href="#pricing">จองสิทธิ์ →</a>
    </div>`);
  pricingContainer.querySelector('.center-heading')?.insertAdjacentHTML('afterend', `
    <section class="countdown-stage" id="pricingCountdown" aria-labelledby="countdown-title">
      <div><p class="countdown-kicker">PRIVATE WORKSHOP / LIMITED OFFER</p><h3 id="countdown-title">เหลือเวลาอีก</h3><p class="countdown-ending">ก่อนปิดสิทธิ์ราคาพิเศษ 1,499 บาท</p></div>
      <div class="countdown-stage-values" aria-live="off"><div class="countdown-day-block"><b data-countdown-days>10</b><span>วัน</span></div><div class="countdown-time-block"><span><b data-countdown-hours>00</b><small>ชั่วโมง</small></span><i>:</i><span><b data-countdown-minutes>00</b><small>นาที</small></span><i>:</i><span><b data-countdown-seconds>00</b><small>วินาที</small></span></div></div>
      <p class="countdown-deadline">สิ้นสุด 8 ตุลาคม 2569 · 23:59 น.</p>
    </section>`);
}
function updateCountdown() {
  const remaining = Math.max(0, new Date(PROMO_END_AT).getTime() - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);
  const values = {
    days: String(Math.floor(totalSeconds / 86400)).padStart(2, '0'),
    hours: String(Math.floor(totalSeconds % 86400 / 3600)).padStart(2, '0'),
    minutes: String(Math.floor(totalSeconds % 3600 / 60)).padStart(2, '0'),
    seconds: String(totalSeconds % 60).padStart(2, '0')
  };
  Object.entries(values).forEach(([unit, value]) => {
    document.querySelectorAll(`[data-countdown-${unit}]`).forEach(element => { element.textContent = value; });
  });
  if (!remaining) document.querySelectorAll('.countdown-bar-label, .countdown-ending').forEach(element => { element.textContent = 'โปรโมชันนี้สิ้นสุดแล้ว'; });
}
updateCountdown();
window.setInterval(updateCountdown, 1000);
document.querySelector('.footer-bottom')?.insertAdjacentHTML('beforebegin', `
  <div class="stripe-trust" aria-label="ชำระเงินอย่างปลอดภัยผ่าน Stripe">
    <span>Secure checkout by</span><span class="stripe-wordmark" aria-label="Stripe">stripe</span>
  </div>`);
const dialog = document.querySelector('#enrollment-dialog');
const enquiry = document.querySelector('#enquiry');
const statusMessage = document.querySelector('.dialog-status');
let lastTrigger;
function openContact(mode, trigger, social) {
  lastTrigger = trigger;
  const isConsult = mode === 'consult';
  const url = social ? ACADEMY[social] : ACADEMY.consultationUrl;
  document.querySelector('#dialog-title').textContent = isConsult ? 'ปรึกษาเรื่องเว็บไซต์ของคุณ' : 'เริ่มต้นเว็บไซต์ของคุณ';
  document.querySelector('#dialog-description').textContent = social ? 'ติดต่อ 6CAT ACADEMY ทาง ' + social.toUpperCase() : 'Private Workshop · 1,499 บาท';
  enquiry.value = isConsult ? 'สวัสดีครับ/ค่ะ สนใจปรึกษาคอร์สสร้างเว็บไซต์ด้วย AI แบบตัวต่อตัว อยากทราบรายละเอียดและเวลาที่เปิดสอน' : 'สวัสดีครับ/ค่ะ สนใจ Private Workshop ราคา 1,499 บาท รบกวนตรวจสอบสิทธิ์โปรโมชั่นและแจ้งรายละเอียดการสมัคร';
  statusMessage.textContent = '';
  const contactLink = document.querySelector('#contact-link');
  const hasUrl = typeof url === 'string' && /^https:\/\//i.test(url);
  contactLink.hidden = !hasUrl;
  document.querySelector('#contact-pending').hidden = hasUrl;
  if (hasUrl) contactLink.href = url;
  else contactLink.removeAttribute('href');
  dialog.showModal();
}
function startStripeCheckout(trigger) {
  trackMetaEvent('InitiateCheckout', { content_name: '6CAT ACADEMY Private Workshop', value: 1499, currency: 'THB' });
  if (/^https:\/\/(buy|checkout)\.stripe\.com\//i.test(STRIPE_PAYMENT_LINK)) {
    window.setTimeout(() => window.location.assign(STRIPE_PAYMENT_LINK), 180);
    return;
  }
  openContact('enroll', trigger);
}
document.querySelectorAll('[data-enroll]').forEach(button => button.addEventListener('click', () => startStripeCheckout(button)));
document.querySelectorAll('[data-consult]').forEach(button => button.addEventListener('click', () => { trackMetaEvent('Contact', { content_name: 'Free consultation' }); openContact('consult', button); }));
document.querySelectorAll('[data-social]').forEach(button => button.addEventListener('click', () => { trackMetaEvent('Contact', { content_name: button.dataset.social + ' contact' }); openContact('consult', button, button.dataset.social); }));
document.querySelectorAll('.line-float, .dialog-line').forEach(link => link.addEventListener('click', () => trackMetaEvent('Contact', { content_name: 'LINE contact' })));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener('close', () => lastTrigger?.focus());
document.querySelector('#copy-enquiry').addEventListener('click', async () => {
  try {
    if (!navigator.clipboard) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(enquiry.value);
    statusMessage.textContent = 'คัดลอกแล้ว พร้อมนำไปส่งให้ทีมงาน';
  } catch {
    enquiry.focus(); enquiry.select();
    statusMessage.textContent = 'เลือกข้อความไว้แล้ว กดคัดลอกบนอุปกรณ์ของคุณ';
  }
});
// Everything stays visible when the CDN is unavailable or motion is reduced.
if (window.gsap) {
  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  const motion = gsap.matchMedia();
  motion.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.timeline({ defaults: { duration: .85, ease: 'power2.out', clearProps: 'opacity,visibility,transform' } })
      .from('.type-private', { y: 18, autoAlpha: 0 })
      .from('.type-workshop', { y: 22, autoAlpha: 0 }, .12)
      .from('.instructor', { y: 24, autoAlpha: 0 }, .25)
      .from('.doodle, .hero-spark', { autoAlpha: 0, stagger: .08 }, .65)
      .from('.hero-copy', { y: 12, autoAlpha: 0 }, .55);
    const activeTweens = [];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const targets = entry.target.classList.contains('stagger-group') ? Array.from(entry.target.children) : entry.target;
        activeTweens.push(gsap.from(targets, { y: 22, autoAlpha: 0, duration: .7, stagger: .09, ease: 'power2.out', clearProps: 'opacity,visibility,transform' }));
        observer.unobserve(entry.target);
      });
    }, { threshold: .08 });
    document.querySelectorAll('.reveal, .stagger-group').forEach(element => observer.observe(element));
    return () => { observer.disconnect(); activeTweens.forEach(tween => tween.revert()); };
  });
  if (window.ScrollTrigger) {
    const countdownMotion = gsap.matchMedia();
    countdownMotion.add('(prefers-reduced-motion: no-preference)', () => {
      const countdownBar = document.querySelector('#countdownBar');
      const countdownStage = document.querySelector('#pricingCountdown');
      if (!countdownBar || !countdownStage) return;
      gsap.set(countdownStage, { autoAlpha: 1, y: -72, scaleX: .42, scaleY: .32, borderRadius: 999, transformOrigin: '50% 0%' });
      const timeline = gsap.timeline({ scrollTrigger: { trigger: '#pricing', start: 'top 63%', end: 'top 28%', scrub: .55 } });
      timeline.to(countdownBar, { y: 18, scale: .88, ease: 'none' }, 0)
        .to(countdownStage, { y: 0, scaleX: 1, scaleY: 1, borderRadius: 26, ease: 'none' }, 0)
        .to(countdownBar, { autoAlpha: 0, duration: .04, ease: 'none' }, .96);
      const priceValue = document.querySelector('#workshop-price');
      if (priceValue) {
        const roulette = { progress: 0, lastTick: -1 };
        const formatPrice = value => value.toLocaleString('en-US');
        gsap.timeline({
          scrollTrigger: {
            trigger: priceValue,
            start: 'top 76%',
            once: true
          }
        })
          .set(priceValue, { transformOrigin: '50% 50%' })
          .to(priceValue, { filter: 'blur(5px)', y: -5, scaleY: .92, duration: .12, ease: 'power1.in' })
          .to(roulette, {
            progress: 1,
            duration: 1.05,
            ease: 'none',
            onUpdate: () => {
              const tick = Math.floor(roulette.progress * 25);
              if (tick === roulette.lastTick) return;
              roulette.lastTick = tick;
              priceValue.textContent = formatPrice(1000 + Math.floor(Math.random() * 9000));
            }
          }, '<')
          .to(priceValue, {
            filter: 'blur(0px)',
            y: 0,
            scaleY: 1,
            scale: 1.06,
            duration: .18,
            ease: 'power3.out',
            onStart: () => { priceValue.textContent = '1,499'; },
            onComplete: () => { gsap.to(priceValue, { scale: 1, duration: .26, ease: 'back.out(2)' }); }
          });
      }
      window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
      return () => { timeline.scrollTrigger?.kill(); timeline.kill(); };
    });
  }
}
