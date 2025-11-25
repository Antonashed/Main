/*
  main.js - countdown, smooth scroll, form handling, calculator, faq
  Comments are included for clarity as requested.
*/

// Countdown: target 2025-12-03 00:00 local (user requested 03.12.2025 00:00)
(function(){
  function pad(n){ return n<10? '0'+n : n; }
  // Use local timezone target: 3 Dec 2025 00:00:00 local
  var target = new Date(2025, 11, 3, 0, 0, 0); // month is 0-based: 11 -> December
  
  function update(){
    var now = new Date();
    var diff = target - now;
    if(diff <= 0){
      // Set all countdowns to 00
      document.querySelectorAll('.countdown .unit').forEach(function(u){ u.textContent = '00'; });
      document.querySelectorAll('.mini-timer').forEach(function(u){ u.textContent = '0 DNI 00:00:00'; });
      return;
    }
    var days = Math.floor(diff / (1000*60*60*24));
    var hours = Math.floor((diff / (1000*60*60)) % 24);
    var mins = Math.floor((diff / (1000*60)) % 60);
    var secs = Math.floor((diff / 1000) % 60);

    // Update ALL countdown timers on the page
    document.querySelectorAll('.countdown').forEach(function(countdownEl){
      var units = countdownEl.querySelectorAll('.unit');
      if(units.length >= 4){
        units[0].textContent = pad(days);
        units[1].textContent = pad(hours);
        units[2].textContent = pad(mins);
        units[3].textContent = pad(secs);
      }
    });
    
    // Update mini timer in header
    document.querySelectorAll('.mini-timer').forEach(function(el){
      el.textContent = days + ' DNI ' + pad(hours) + ':' + pad(mins) + ':' + pad(secs);
    });
  }
  
  update();
  setInterval(update, 1000);
})();

// Smooth scroll for CTA links (delegated)
document.addEventListener('click', function(e){
  var t = e.target.closest && e.target.closest('.cta-scroll');
  if(t){
    e.preventDefault();
    var target = document.querySelector('#order-form');
    if(target){
      target.scrollIntoView({behavior:'smooth', block:'center'});
    }
  }
});

// Calculator range behaviour
(function() {
  var slider = document.getElementById('qty');
  if (!slider) return;

  var qtyOut = document.getElementById('calc-qty');
  var priceOut = document.getElementById('calc-price');
  var totalOut = document.getElementById('calc-total');
  var saveOut = document.getElementById('calc-save');
  var ctaBtn = document.getElementById('calc-cta-btn'); // кнопка CTA

  function priceFor(q) {
    if (q < 2500) return 1.65;
    if (q < 5000) return 1.55;
    return 1.50;
  }

  function updateCalc() {
    var q = parseInt(slider.value, 10);

    qtyOut.textContent = q;

    var price = priceFor(q);
    priceOut.textContent = price.toFixed(2);

    var total = q * price;
    totalOut.textContent = total.toLocaleString('pl-PL');

    var save = (2.76 - price) * q;
    saveOut.textContent = Math.round(save).toLocaleString('pl-PL');

    // 🔥 Update CTA button dynamically
    if (ctaBtn) {
      ctaBtn.textContent = 'ZAMÓW ' + q.toLocaleString('pl-PL') + ' SZT';
    }
  }

  // Запускаем при загрузке
  updateCalc();

  // Обновляем при движении ползунка
  slider.addEventListener('input', updateCalc);

})();


// Form handling (fake): shows alert and resets form
document.addEventListener('submit', function(e){
  var form = e.target;
  if(form && form.id === 'lead-form'){
    e.preventDefault();
    var name = form.querySelector('[name=name]').value.trim();
    var phone = form.querySelector('[name=phone]').value.trim();
    if(!name || !phone){
      alert('Proszę wypełnić wymagane pola: Imię i Telefon');
      return;
    }
    alert('Dziękujemy! Twoje zapytanie zostało wysłane. Nasz zespół skontaktuje się w ciągu 15 minut.');
    form.reset();
  }
});

// FAQ toggle
document.addEventListener('click', function(e){
  var f = e.target.closest('.faq-item');
  if(f) f.classList.toggle('open');
});

// Testimonials auto-carousel
(function() {
  const track = document.querySelector('.testimonial-track');
  if (!track) return;

  const items = Array.from(track.children);
  let index = 0;
  const interval = 5000; // 5 seconds

  // Дублируем элементы, чтобы карусель была бесконечной
  items.forEach(item => {
    const clone = item.cloneNode(true);
    track.appendChild(clone);
  });

  function moveCarousel() {
    index++;
    track.style.transform = `translateX(-${index * (items[0].offsetWidth + 16)}px)`;

    // Если дошли до середины – сброс
    if (index >= items.length) {
      setTimeout(() => {
        track.style.transition = 'none';
        index = 0;
        track.style.transform = 'translateX(0)';
        void track.offsetWidth; 
        track.style.transition = 'transform 0.6s ease-in-out';
      }, 700);
    }
  }

  setInterval(moveCarousel, interval);
})();
// --- Testimonials auto-carousel + clickable dots ---
(function() {
  const track = document.querySelector('.testimonial-track');
  const dotsContainer = document.querySelector('.carousel-dots');
  if (!track || !dotsContainer) return;

  const items = Array.from(track.children);
  const visibleCount = 3;
  const totalSlides = items.length;

  let index = 0;
  const interval = 5000;

  // Create dots
  for (let i = 0; i < totalSlides; i++) {
    const d = document.createElement('div');
    d.classList.add('carousel-dot');
    if (i === 0) d.classList.add('active');
    d.dataset.slide = i;
    dotsContainer.appendChild(d);
  }
  const dots = document.querySelectorAll('.carousel-dot');

  // Duplicate items for infinite scrolling
  items.forEach(item => {
    track.appendChild(item.cloneNode(true));
  });

  function updateDots(activeIndex) {
    dots.forEach(dot => dot.classList.remove('active'));
    dots[activeIndex % totalSlides].classList.add('active');
  }

  function move(slideIndex) {
    const itemWidth = items[0].offsetWidth + 16;
    track.style.transform = `translateX(-${slideIndex * itemWidth}px)`;
  }

  function autoMove() {
    index++;
    move(index);
    updateDots(index);

    if (index >= totalSlides) {
      setTimeout(() => {
        track.style.transition = 'none';
        index = 0;
        move(0);
        updateDots(0);
        void track.offsetWidth;
        track.style.transition = 'transform 0.6s ease-in-out';
      }, 650);
    }
  }

  const timer = setInterval(autoMove, interval);

  // Click dots
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      index = parseInt(dot.dataset.slide, 10);
      move(index);
      updateDots(index);
    });
  });

})();


// Animated gradient for urgency section on scroll
(function() {
  const urgencySection = document.querySelector('.urgency-new');
  if (!urgencySection) return;

  // Начальный и конечный градиенты
  const startGradient = 'linear-gradient(135deg, #ff3333 0%, #cc0000 100%)';
  const endGradient = 'linear-gradient(135deg, #ff6b35 0%, #cc0000 100%)'; // Более оранжевый

  function updateGradient() {
    const rect = urgencySection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Рассчитываем, насколько секция видна в viewport
    const sectionTop = rect.top;
    const sectionHeight = rect.height;
    
    // Когда секция в центре экрана - 100% нового градиента
    const triggerPoint = windowHeight * 0.3; // Начинаем изменять когда секция на 30% высоты экрана
    
    let progress = 0;
    
    if (sectionTop < triggerPoint && sectionTop > -sectionHeight) {
      // Секция в зоне видимости - рассчитываем прогресс
      progress = 1 - (sectionTop / (triggerPoint + sectionHeight));
      progress = Math.max(0, Math.min(1, progress)); // Ограничиваем от 0 до 1
    } else if (sectionTop <= -sectionHeight) {
      // Секция полностью прокручена вверх - фиксируем конечный цвет
      progress = 1;
    }
    
    // Интерполяция между градиентами
    if (progress > 0) {
      // Создаем промежуточный градиент
      const currentGradient = `linear-gradient(135deg, 
        rgba(255, 107, 53, ${0.5 + progress * 0.5}) 0%, 
        #cc0000 100%)`;
      
      urgencySection.style.background = currentGradient;
      urgencySection.style.boxShadow = `0 10px 30px rgba(255, 107, 53, ${0.3 + progress * 0.2})`;
    } else {
      // Возвращаем начальный градиент
      urgencySection.style.background = startGradient;
      urgencySection.style.boxShadow = '0 10px 30px rgba(255, 0, 0, 0.3)';
    }
  }

  // Оптимизация с помощью requestAnimationFrame
  let ticking = false;
  
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateGradient();
        ticking = false;
      });
      ticking = true;
    }
  }

  // Слушаем события скролла
  window.addEventListener('scroll', onScroll);
  window.addEventListener('resize', updateGradient);
  
  // Инициализация при загрузке
  updateGradient();
})();

// Fixed FAQ accordion
document.addEventListener('DOMContentLoaded', function() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    question.addEventListener('click', function() {
      const isOpen = item.classList.contains('open');
      
      // Close all items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('open');
        otherItem.querySelector('.faq-answer').style.maxHeight = '0';
      });
      
      // If clicked item wasn't open, open it
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
});