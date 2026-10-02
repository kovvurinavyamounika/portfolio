/**
 * =========================================================================
 * 🎨 DYNAMIC PORTFOLIO RENDERER
 * =========================================================================
 * Reads data from window.PORTFOLIO_DATA (or localStorage override)
 * and automatically populates all sections of the portfolio!
 */

// Helper to get active data (local storage override or default config)
window.getActivePortfolioData = function () {
  const saved = localStorage.getItem('NAVYA_PORTFOLIO_DATA');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not parse saved portfolio data, using default config.', e);
    }
  }
  return window.PORTFOLIO_DATA;
};

// Render function called on load and whenever data changes
window.renderPortfolio = function () {
  const data = window.getActivePortfolioData();
  if (!data) return;

  // 1. Personal & Brand
  const personal = data.personal || {};
  document.title = `${personal.fullName || 'Portfolio'} | AI/ML & Software Engineering`;

  const brandMono = document.getElementById('brand-monogram');
  if (brandMono) brandMono.textContent = personal.monogram || '<KNM/>';

  const brandName = document.getElementById('brand-name');
  if (brandName) brandName.textContent = personal.shortName || personal.fullName || 'Navya Mounika';

  const brandSubtitle = document.getElementById('brand-subtitle');
  if (brandSubtitle) brandSubtitle.textContent = 'AI_ML & SWE';

  const heroRoleBadge = document.getElementById('hero-role-badge');
  if (heroRoleBadge) heroRoleBadge.textContent = personal.roleBadge || 'Available for Internships';

  const heroName = document.getElementById('hero-name');
  if (heroName) heroName.textContent = personal.fullName || 'Kovvuri Navya Mounika';

  const heroTagline = document.getElementById('hero-tagline');
  if (heroTagline) heroTagline.textContent = personal.heroTagline || 'I engineer intelligent software & solve complex problems.';

  const heroBio = document.getElementById('hero-bio');
  if (heroBio) heroBio.textContent = personal.elevatorBio || '';

  const heroEmailText = document.getElementById('hero-email-text');
  if (heroEmailText) heroEmailText.textContent = personal.email || 'kovvurinavyamounika@gmail.com';

  const heroEmailBtn = document.getElementById('hero-email-btn');
  if (heroEmailBtn) {
    heroEmailBtn.onclick = () => window.copyEmail(personal.email || 'kovvurinavyamounika@gmail.com');
  }

  // Hero Photo Binding
  // Hero Photo Binding
  const heroPhoto = document.getElementById('hero-photo');
  if (heroPhoto) {
    const photoSrc = personal.profileImage || 'assets/profile.jpg';
    heroPhoto.src = photoSrc;
    heroPhoto.onerror = function () {
      this.onerror = null;
      this.style.display = 'none';
    };
  }

  // 2. Social Links
  const social = data.socialLinks || {};
  const setHref = (id, url) => {
    const el = document.getElementById(id);
    if (el && url) el.href = url;
  };
  setHref('hero-github-link', social.github);
  setHref('hero-linkedin-link', social.linkedin);
  setHref('hero-leetcode-link', social.leetcode);
  setHref('hero-codechef-link', social.codechef);
  setHref('hero-hackerrank-link', social.hackerrank);
  setHref('hero-email-link', `mailto:${personal.email}`);
  setHref('contact-github-link', social.github);
  setHref('contact-linkedin-link', social.linkedin);
  setHref('contact-leetcode-link', social.leetcode);
  setHref('contact-codechef-link', social.codechef);
  setHref('contact-hackerrank-link', social.hackerrank);
  setHref('contact-twitter-link', social.twitter);
  setHref('footer-github-link', social.github);
  setHref('footer-linkedin-link', social.linkedin);

  // 3. Education
  const edu = data.education || {};
  const eduDegree = document.getElementById('edu-degree');
  if (eduDegree) eduDegree.textContent = edu.degree || '';

  const eduTimeline = document.getElementById('edu-timeline');
  if (eduTimeline) eduTimeline.textContent = edu.timeline || '2023 - 2027';

  const eduInstitution = document.getElementById('edu-institution');
  if (eduInstitution) eduInstitution.textContent = `${edu.institution || ''} • CGPA: ${edu.cgpa || '8.8 / 10.0'}`;

  const courseworkContainer = document.getElementById('edu-coursework-container');
  if (courseworkContainer && Array.isArray(edu.coursework)) {
    courseworkContainer.innerHTML = edu.coursework.map(c =>
      `<span class="px-2 py-0.5 rounded bg-dark-850 border border-slate-800 text-xs font-mono text-slate-300">${c}</span>`
    ).join('');
  }

  // 4. Stats & Metrics
  const stats = data.stats || {};
  const statsDsaCount = document.getElementById('stats-dsa-count');
  if (statsDsaCount) statsDsaCount.textContent = stats.dsaSolved || '350+';

  const statsEasy = document.getElementById('stats-easy');
  if (statsEasy) statsEasy.textContent = `Easy (${stats.easyCount || 120})`;

  const statsMedium = document.getElementById('stats-medium');
  if (statsMedium) statsMedium.textContent = `Medium (${stats.mediumCount || 195})`;

  const statsHard = document.getElementById('stats-hard');
  if (statsHard) statsHard.textContent = `Hard (${stats.hardCount || 35})`;

  const totalProb = (stats.easyCount || 120) + (stats.mediumCount || 195) + (stats.hardCount || 35);
  const barEasy = document.getElementById('bar-easy');
  const barMedium = document.getElementById('bar-medium');
  const barHard = document.getElementById('bar-hard');
  if (barEasy) barEasy.style.width = `${((stats.easyCount || 120) / totalProb) * 100}%`;
  if (barMedium) barMedium.style.width = `${((stats.mediumCount || 195) / totalProb) * 100}%`;
  if (barHard) barHard.style.width = `${((stats.hardCount || 35) / totalProb) * 100}%`;

  const statsProjects = document.getElementById('stats-projects');
  if (statsProjects) statsProjects.textContent = stats.projectsBuilt || '12+';

  const statsCommits = document.getElementById('stats-commits');
  if (statsCommits) statsCommits.textContent = stats.commitsCount || '400+';

  const statsContest = document.getElementById('stats-contest');
  if (statsContest) statsContest.textContent = stats.contestRating || 'Top 15%';

  const statsHackathons = document.getElementById('stats-hackathons');
  if (statsHackathons) statsHackathons.textContent = stats.hackathonsParticipated || '3+';

  // 5. Skills Grid
  const skillsContainer = document.getElementById('skills-container');
  if (skillsContainer && Array.isArray(data.skills)) {
    skillsContainer.innerHTML = data.skills.map(sk => `
      <div class="p-6 rounded-2xl glass-card border border-slate-800/80 flex flex-col justify-between">
        <div>
          <div class="w-12 h-12 rounded-xl bg-${sk.accentColor}-500/10 border border-${sk.accentColor}-500/20 flex items-center justify-center text-${sk.accentColor}-400 mb-5">
            <i data-lucide="${sk.icon || 'code'}" class="w-6 h-6"></i>
          </div>
          <h3 class="font-bold text-lg text-white mb-2">${sk.category}</h3>
          <p class="text-xs text-slate-400 mb-4">${sk.description}</p>
          <div class="flex flex-wrap gap-2 text-xs font-mono">
            ${sk.items.map(item => `<span class="px-2.5 py-1 rounded-md bg-dark-900 border border-slate-800 text-slate-200">${item}</span>`).join('')}
          </div>
        </div>
        <div class="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-${sk.accentColor}-400">
          <span>${sk.highlight || ''}</span>
          <i data-lucide="check" class="w-3.5 h-3.5"></i>
        </div>
      </div>
    `).join('');
  }

  // 6. Featured Projects Grid
  const projectsGrid = document.getElementById('projects-grid');
  if (projectsGrid && Array.isArray(data.projects)) {
    projectsGrid.innerHTML = data.projects.map(proj => `
      <div class="project-card flex flex-col justify-between p-7 rounded-2xl glass-card border border-slate-800 group" data-category="${proj.category}">
        <div>
          <div class="flex items-center justify-between mb-4">
            <span class="font-mono text-xs px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              ${proj.categoryLabel || proj.category}
            </span>
            <div class="flex items-center gap-3 text-slate-400">
              ${proj.github ? `
                <a href="${proj.github}" target="_blank" rel="noopener noreferrer" class="hover:text-white transition" title="View Source Code">
                  <i data-lucide="github" class="w-4 h-4"></i>
                </a>
              ` : ''}
              ${proj.live ? `
                <a href="${proj.live}" target="_blank" rel="noopener noreferrer" class="hover:text-indigo-400 transition" title="Live Preview">
                  <i data-lucide="external-link" class="w-4 h-4"></i>
                </a>
              ` : ''}
            </div>
          </div>

          <h3 class="font-sans text-2xl font-bold text-white group-hover:text-indigo-300 transition mb-3">
            ${proj.title}
          </h3>

          <p class="text-sm text-slate-300 leading-relaxed mb-6">
            ${proj.shortDescription}
          </p>

          <div class="space-y-2 mb-6">
            ${(proj.keyPoints || []).map(pt => `
              <div class="flex items-start gap-2 text-xs text-slate-400">
                <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0"></i>
                <span>${pt}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div>
          <div class="flex flex-wrap gap-2 text-xs font-mono text-slate-300 mb-5">
            ${(proj.tags || []).map(t => `<span class="px-2 py-0.5 rounded bg-dark-850 border border-slate-800">${t}</span>`).join('')}
          </div>

          <button onclick="openProjectModal('${proj.id}')" class="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-dark-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800 transition flex items-center justify-center gap-2">
            <span>Explore Architecture & Details</span>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  // 7. Certifications
  const certContainer = document.getElementById('certifications-container');
  if (certContainer && Array.isArray(data.certifications)) {
    certContainer.innerHTML = data.certifications.map((cert, index) => `
      <button type="button" class="w-full text-left p-5 rounded-2xl glass-card border border-slate-800/80 flex items-start gap-4 transition hover:border-indigo-500/40 hover:scale-[1.01]" data-cert-index="${index}" aria-label="Open certificate preview for ${cert.title}">
        <div class="p-3 rounded-xl bg-${cert.color || 'indigo'}-500/10 border border-${cert.color || 'indigo'}-500/20 text-${cert.color || 'indigo'}-400 shrink-0">
          <i data-lucide="${cert.icon || 'award'}" class="w-5 h-5"></i>
        </div>
        <div>
          <h4 class="font-bold text-white text-base text-left">${cert.title}</h4>
          <p class="text-xs text-slate-400 mt-0.5 text-left">${cert.details}</p>
          <span class="text-[11px] font-mono text-${cert.color || 'indigo'}-400/90 mt-1.5 block text-left">${cert.issuer}</span>
        </div>
      </button>
    `).join('');

    const certButtons = certContainer.querySelectorAll('[data-cert-index]');
    certButtons.forEach(button => {
      button.addEventListener('click', () => {
        const certIndex = Number(button.getAttribute('data-cert-index'));
        if (window.openCertificateModal) {
          window.openCertificateModal(certIndex);
        }
      });
    });
  }

  // 9. Contact Info Details
  const contactEmailLink = document.getElementById('contact-email-link');
  if (contactEmailLink) {
    contactEmailLink.href = `mailto:${personal.email || 'kovvurinavyamounika@gmail.com'}`;
    contactEmailLink.textContent = personal.email || 'kovvurinavyamounika@gmail.com';
  }

  const contactLocation = document.getElementById('contact-location');
  if (contactLocation) contactLocation.textContent = personal.location || 'India • Open to Relocation & Remote';

  const contactAvailability = document.getElementById('contact-availability');
  if (contactAvailability) contactAvailability.textContent = personal.availability || 'Summer / Fall Internships & Co-ops';

  // 10. Footer Author
  const footerAuthor = document.getElementById('footer-author');
  if (footerAuthor) footerAuthor.textContent = personal.fullName || 'Kovvuri Navya Mounika';

  const footerMono = document.getElementById('footer-monogram');
  if (footerMono) footerMono.textContent = personal.monogram || '<KNM/>';

  // Refresh Lucide Icons for dynamically generated elements
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
};

// Auto-run render when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.renderPortfolio();
});
