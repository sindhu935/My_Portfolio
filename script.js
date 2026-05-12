
/* ---- NAV SCROLL EFFECT ---- */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

/* ---- ACTIVE NAV LINK ON SCROLL ---- */
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const observerNav = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observerNav.observe(s));

/* ---- MOBILE HAMBURGER ---- */
const hamburger = document.querySelector('.nav-hamburger');
const navMenu = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navMenu.classList.remove('open'));
});

/* ---- SCROLL FADE-UP ANIMATION ---- */
const fadeEls = document.querySelectorAll('.fade-up');

const observerFade = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      observerFade.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => observerFade.observe(el));

/* ---- LOAD & RENDER PROJECTS FROM JSON ---- */
async function loadProjects() {
  const container = document.getElementById('projects-container');

  try {
    const res = await fetch('projects.json');
    if (!res.ok) throw new Error('Failed to fetch projects');
    const projects = await res.json();
    renderProjects(projects, container);
  } catch (err) {
    container.innerHTML = `
      <p style="color:var(--text3); font-size:14px; text-align:center; padding:2rem;">
        Could not load projects. Please ensure projects.json is in the same folder.
      </p>`;
    console.error('Project load error:', err);
  }
}

function renderProjects(projects, container) {
  container.innerHTML = '';

  projects.forEach((project, index) => {
    const card = document.createElement('div');
    card.className = `project-card fade-up${project.featured ? ' featured' : ''}`;
    card.style.transitionDelay = `${index * 0.1}s`;

    const tagsHTML = project.tags
      .map(tag => `<span class="project-tag">${tag}</span>`)
      .join('');

    card.innerHTML = `
      ${project.featured ? '<span class="featured-badge">★ Featured</span>' : ''}
      <div class="project-icon">${project.icon}</div>
      <div>
        <div class="project-title">${project.title}</div>
        <p class="project-desc">${project.description}</p>
      </div>
      <div class="project-tags">${tagsHTML}</div>
      <div class="project-footer">
        <a href="${project.github}" target="_blank" rel="noopener" class="project-link">
          View on GitHub
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>
      </div>
    `;

    container.appendChild(card);
  });

  /* Re-observe newly added fade-up elements */
  container.querySelectorAll('.fade-up').forEach(el => observerFade.observe(el));
}

/* ---- SKILL TAG HOVER RIPPLE ---- */
document.querySelectorAll('.skill-tag').forEach(tag => {
  tag.addEventListener('mouseenter', function () {
    this.style.transform = 'scale(1.05)';
  });
  tag.addEventListener('mouseleave', function () {
    this.style.transform = 'scale(1)';
  });
});

/* ---- SMOOTH EMAIL COPY ---- */
const emailBtn = document.getElementById('copy-email');
if (emailBtn) {
  emailBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('sindhurajendhar9@gmail.com').then(() => {
      const original = emailBtn.textContent;
      emailBtn.textContent = '✓ Copied!';
      emailBtn.style.color = '#2a7a2a';
      setTimeout(() => {
        emailBtn.textContent = original;
        emailBtn.style.color = '';
      }, 2000);
    });
  });
}

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {
  loadProjects();
});