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

