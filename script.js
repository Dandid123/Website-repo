// Cyberpunk interactive effects

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Aggressive glitch effect on title
const title = document.querySelector('.title');
if (title) {
  setInterval(() => {
    if (Math.random() > 0.9) {
      title.style.textShadow = `-3px 0 10px #ff006e, 3px 0 10px #00ffff`;
      setTimeout(() => {
        title.style.textShadow = `0 0 10px #ff006e`;
      }, 50);
    }
  }, 2000);
}

// Proximity-based neon glow
document.addEventListener('mousemove', (e) => {
  const x = e.clientX;
  const y = e.clientY;
  
  document.querySelectorAll('.card').forEach(card => {
    const rect = card.getBoundingClientRect();
    const cardX = rect.left + rect.width / 2;
    const cardY = rect.top + rect.height / 2;
    
    const distX = x - cardX;
    const distY = y - cardY;
    const distance = Math.sqrt(distX * distX + distY * distY);
    
    if (distance < 250) {
      const intensity = (1 - distance / 250) * 0.5;
      card.style.boxShadow = `0 0 ${25 + intensity * 25}px rgba(0,255,255,${0.3 + intensity}), inset 0 0 15px rgba(0,255,255,${0.05 + intensity * 0.1})`;
    } else {
      card.style.boxShadow = '0 0 15px rgba(255,0,110,0.1), inset 0 0 15px rgba(0,255,255,0.05)';
    }
  });
});

// Scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0) skewY(0deg)';
    }
  });
}, observerOptions);

document.querySelectorAll('section, .card').forEach(element => {
  element.style.opacity = '0';
  element.style.transform = 'translateY(20px) skewY(2deg)';
  element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(element);
});

// Arrow key navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    const sections = document.querySelectorAll('section');
    let nextSection = sections[0];
    
    for (let section of sections) {
      const rect = section.getBoundingClientRect();
      if (e.key === 'ArrowDown' && rect.top > 100) {
        nextSection = section;
        break;
      } else if (e.key === 'ArrowUp' && rect.top < -100) {
        nextSection = section;
      }
    }
    
    nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

// Keyboard shortcut to show phone number
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'p') {
    alert('📱 416-907-7666');
  }
});

// Basketball follows mouse with smooth inertial motion and 3D tilt
(function(){
  const wrapper = document.querySelector('.basketball-wrapper');
  const ball = document.querySelector('.basketball');
  const shadow = document.querySelector('.basketball-shadow');
  if (!wrapper || !ball) return;

  // internal state
  let targetX = 0, targetY = 0; // desired translation
  let currentX = 0, currentY = 0;
  let targetRot = 0, currentRot = 0; // rotation z
  let targetTiltX = 0, currentTiltX = 0; // rotateX
  let targetTiltY = 0, currentTiltY = 0; // rotateY
  const lerp = (a, b, t) => a + (b - a) * t;

  // sensitivity / limits
  const maxOffset = 36; // px
  const maxTilt = 12; // degrees
  const followSpeed = 0.14; // 0..1 higher is snappier
  const rotSpeed = 0.16;
  const tiltSpeed = 0.12;

  function onPointerMove(x, y){
    const rect = ball.getBoundingClientRect();
    const ballX = rect.left + rect.width / 2;
    const ballY = rect.top + rect.height / 2;
    const dx = x - ballX;
    const dy = y - ballY;
    const distance = Math.hypot(dx, dy);

    // Keep rotation changes on the shortest path when the cursor crosses the left edge.
    const desiredRot = Math.atan2(dy, dx) * 180 / Math.PI + 90;
    const angleDelta = ((desiredRot - targetRot + 540) % 360) - 180;
    targetRot += angleDelta;

    // translation: scaled by closeness; clamp distance for stable behaviour
    const clamped = Math.min(distance, 220);
    const scale = Math.max(0, Math.min(1, (220 - clamped) / 220));
    const nx = (dx / (distance || 1)) * maxOffset * scale;
    const ny = (dy / (distance || 1)) * maxOffset * scale;
    targetX = nx; targetY = ny;

    // tilt: based on relative cursor inside ball rect (gives small 3D tilt)
    const rx = (dx / (rect.width / 2)); // -1..1 roughly
    const ry = (dy / (rect.height / 2));
    targetTiltY = Math.max(-1, Math.min(1, rx)) * maxTilt * -1; // invert so moving right tilts left
    targetTiltX = Math.max(-1, Math.min(1, ry)) * maxTilt * 0.6; // smaller X tilt

    // shadow respond
    if (shadow) {
      const shadowScale = 1 + scale * 0.35;
      const shadowOffsetX = nx * 0.25;
      const shadowOffsetY = Math.abs(ny) * 0.12;
      shadow.style.transform = `translateX(${shadowOffsetX.toFixed(1)}px) translateY(${( -6 + shadowOffsetY ).toFixed(1)}px)`;
      shadow.style.width = `${(70 * shadowScale).toFixed(1)}%`;
      shadow.style.opacity = `${(0.5 + 0.45 * (scale)).toFixed(2)}`;
    }
  }

  // pointer handlers
  function pointerHandler(e){
    const x = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] && e.touches[0].clientX) || 0;
    const y = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] && e.touches[0].clientY) || 0;
    onPointerMove(x,y);
  }

  window.addEventListener('mousemove', pointerHandler, {passive:true});
  window.addEventListener('touchmove', pointerHandler, {passive:true});

  // animate loop
  function update(){
    currentX = lerp(currentX, targetX, followSpeed);
    currentY = lerp(currentY, targetY, followSpeed);
    currentRot = lerp(currentRot, targetRot, rotSpeed);
    currentTiltX = lerp(currentTiltX, targetTiltX, tiltSpeed);
    currentTiltY = lerp(currentTiltY, targetTiltY, tiltSpeed);

    // combine transforms with 3D tilt for a richer look
    const transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0) rotateZ(${currentRot.toFixed(2)}deg) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;
    wrapper.style.transform = transform;

    requestAnimationFrame(update);
  }

  // start the loop
  requestAnimationFrame(update);

  // reset gently when pointer leaves window
  window.addEventListener('mouseleave', () => {
    targetX = 0; targetY = 0; targetRot = 0; targetTiltX = 0; targetTiltY = 0;
    if (shadow) { shadow.style.transform = 'translateX(-50%) translateY(-6px)'; shadow.style.width = '70%'; shadow.style.opacity = '0.65'; }
  });

})();
