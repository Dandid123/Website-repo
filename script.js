// Futuristic interactive effects

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

// Add glow effect to cursor movement
document.addEventListener('mousemove', (e) => {
  const x = e.clientX;
  const y = e.clientY;
  
  // Create subtle glow effect
  document.querySelectorAll('.card').forEach(card => {
    const rect = card.getBoundingClientRect();
    const cardX = rect.left + rect.width / 2;
    const cardY = rect.top + rect.height / 2;
    
    const distX = x - cardX;
    const distY = y - cardY;
    const distance = Math.sqrt(distX * distX + distY * distY);
    
    if (distance < 200) {
      const intensity = (1 - distance / 200) * 0.3;
      card.style.boxShadow = `0 0 ${30 + intensity * 20}px rgba(0,255,255,${0.2 + intensity})`;
    } else {
      card.style.boxShadow = '0 0 15px rgba(0,255,255,0.1)';
    }
  });
});

// Animate elements on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('section, .card').forEach(element => {
  element.style.opacity = '0';
  element.style.transform = 'translateY(20px)';
  element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(element);
});

// Keyboard arrow key navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    const sections = document.querySelectorAll('section');
    const currentScroll = window.scrollY;
    
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
