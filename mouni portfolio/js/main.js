/**
 * =========================================================================
 * 🚀 MAIN INTERACTIVE CONTROLLER FOR KOVVURI NAVYA MOUNIKA'S PORTFOLIO
 * =========================================================================
 * Handles:
 * - Dynamic typing effect from PORTFOLIO_DATA
 * - Top scroll progress bar & navbar blur on scroll
 * - Mobile navigation menu toggle
 * - Active scroll spy navigation
 * - Project filtering & architecture modal viewer
 * - Copy to clipboard & toast notifications
 * - Contact form validation & submission simulation
 * - ⚙️ LIVE PROFILE CUSTOMIZER (Edit data anytime in browser or export config)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Reset any stuck scroll-lock from prior interactions or stale overlays.
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';

  const activeData = window.getActivePortfolioData ? window.getActivePortfolioData() : window.PORTFOLIO_DATA;

  // --- Dynamic Typing Effect in Hero Section ---
  const typingElement = document.getElementById('typing-text');
  if (typingElement) {
    const roles = (activeData.personal && activeData.personal.typingRoles && activeData.personal.typingRoles.length)
      ? activeData.personal.typingRoles
      : [
        'AIML Learning Student',
        'Full-Stack Web Developer',
        'DSA & Problem Solving Enthusiast',
        'Intelligent Systems Builder'
      ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 90;
    const deletingSpeed = 45;
    const pauseDelay = 1800;

    function type() {
      const currentRole = roles[roleIndex];
      if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      let timeoutDuration = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && charIndex === currentRole.length) {
        timeoutDuration = pauseDelay;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        timeoutDuration = 400;
      }

      setTimeout(type, timeoutDuration);
    }

    type();
  }

  // --- Scroll Progress Bar & Navbar Blur on Scroll ---
  const progressBar = document.getElementById('scroll-progress');
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }

    if (navbar) {
      if (winScroll > 40) {
        navbar.classList.add('bg-slate-950/85', 'backdrop-blur-md', 'border-b', 'border-slate-800/80', 'shadow-lg');
        navbar.classList.remove('bg-transparent');
      } else {
        navbar.classList.remove('bg-slate-950/85', 'backdrop-blur-md', 'border-b', 'border-slate-800/80', 'shadow-lg');
        navbar.classList.add('bg-transparent');
      }
    }

    if (backToTopBtn) {
      if (winScroll > 400) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.add('opacity-100', 'pointer-events-auto');
      } else {
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.remove('opacity-100', 'pointer-events-auto');
      }
    }
  });

  // --- Mobile Navigation Menu Toggle ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      if (isHidden) {
        mobileMenu.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
      } else {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      });
    });
  }

  // --- Active Link Highlighting (Scroll Spy) ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('text-indigo-400', 'font-semibold');
            link.classList.remove('text-slate-300');
          } else {
            link.classList.remove('text-indigo-400', 'font-semibold');
            link.classList.add('text-slate-300');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', highlightNavOnScroll);

  // --- Interactive Project Filtering ---
  const filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      const projectCards = document.querySelectorAll('.project-card');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || (category && category.includes(filterValue))) {
          card.classList.remove('hidden-card');
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.classList.add('hidden-card');
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // --- Project Modal Data & Handlers ---
  const modal = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-card');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  const certificateModal = document.getElementById('certificate-modal');
  const certificateCard = document.getElementById('certificate-card');
  const certificateCloseBtn = document.getElementById('certificate-close-btn');

  function closeCertificateModal() {
    if (!certificateModal) return;
    certificateModal.classList.add('opacity-0');
    certificateCard.classList.remove('scale-100');
    certificateCard.classList.add('scale-95');
    setTimeout(() => {
      certificateModal.classList.add('hidden');
      document.body.style.overflow = '';
    }, 200);
  }

  window.openCertificateModal = function (certIndex) {
    const data = window.getActivePortfolioData ? window.getActivePortfolioData() : window.PORTFOLIO_DATA;
    const cert = (data.certifications || [])[certIndex];
    if (!cert || !certificateModal) return;

    document.getElementById('certificate-title').textContent = cert.title || 'Certificate';
    document.getElementById('certificate-issuer').textContent = cert.issuer || 'Certification';
    document.getElementById('certificate-details').textContent = cert.details || 'Certificate details';

    const preview = document.getElementById('certificate-preview');

    if (cert.previewPdf) {
      preview.innerHTML = `
        <iframe src="${cert.previewPdf}#toolbar=0&navpanes=0&scrollbar=0" title="${cert.title}" class="w-full h-[520px] rounded-xl border border-slate-800 bg-white"></iframe>
      `;
    } else if (cert.previewImage) {
      preview.innerHTML = `
        <img src="${cert.previewImage}" alt="${cert.title}" class="w-full max-h-[420px] object-cover rounded-xl border border-slate-800" />
      `;
    } else {
      preview.innerHTML = `
        <div class="rounded-xl border border-dashed border-indigo-500/40 bg-gradient-to-br from-indigo-500/10 via-slate-900 to-purple-500/10 p-6">
          <div class="rounded-2xl border border-slate-700 bg-slate-950/80 p-6 shadow-2xl">
            <div class="flex items-center justify-between mb-6">
              <span class="text-xs font-mono uppercase text-indigo-300">Certificate</span>
              <span class="text-xs font-mono text-slate-400">Verified</span>
            </div>
            <div class="space-y-4">
              <div class="h-3 w-28 rounded-full bg-indigo-500/30"></div>
              <div class="h-3 w-44 rounded-full bg-slate-700"></div>
              <div class="h-3 w-36 rounded-full bg-slate-700"></div>
            </div>
            <div class="mt-8 border-t border-slate-800 pt-5">
              <p class="font-bold text-2xl text-white tracking-tight">${cert.title}</p>
              <p class="mt-2 text-sm text-slate-300">${cert.issuer}</p>
              <p class="mt-4 text-xs font-mono text-indigo-300">${cert.details}</p>
            </div>
          </div>
        </div>
      `;
    }

    certificateModal.classList.remove('hidden');
    setTimeout(() => {
      certificateModal.classList.remove('opacity-0');
      certificateCard.classList.remove('scale-95');
      certificateCard.classList.add('scale-100');
    }, 10);

    document.body.style.overflow = 'hidden';
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  };

  if (certificateCloseBtn) {
    certificateCloseBtn.addEventListener('click', closeCertificateModal);
  }

  if (certificateModal) {
    certificateModal.addEventListener('click', (e) => {
      if (e.target === certificateModal) {
        closeCertificateModal();
      }
    });
  }

  window.openProjectModal = function (projectId) {
    const data = window.getActivePortfolioData ? window.getActivePortfolioData() : window.PORTFOLIO_DATA;
    const project = (data.projects || []).find(p => p.id === projectId);
    if (!project || !modal) return;

    document.getElementById('modal-title').textContent = project.title;
    document.getElementById('modal-subtitle').textContent = project.subtitle || project.categoryLabel || '';
    document.getElementById('modal-overview').textContent = project.overview || project.shortDescription || '';

    const tagsContainer = document.getElementById('modal-tags');
    tagsContainer.innerHTML = '';
    (project.tags || []).forEach(tag => {
      const span = document.createElement('span');
      span.className = 'px-2.5 py-1 text-xs rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono-code';
      span.textContent = tag;
      tagsContainer.appendChild(span);
    });

    const highlightsContainer = document.getElementById('modal-highlights');
    highlightsContainer.innerHTML = '';
    (project.highlights || project.keyPoints || []).forEach(item => {
      const li = document.createElement('li');
      li.className = 'flex items-start gap-2.5 text-slate-300 text-sm';
      li.innerHTML = `<i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400 mt-0.5 shrink-0"></i><span>${item}</span>`;
      highlightsContainer.appendChild(li);
    });

    const githubLink = document.getElementById('modal-github');
    const liveLink = document.getElementById('modal-live');
    if (githubLink) {
      if (project.github) {
        githubLink.href = project.github;
        githubLink.classList.remove('hidden');
      } else {
        githubLink.classList.add('hidden');
      }
    }
    if (liveLink) {
      if (project.live) {
        liveLink.href = project.live;
        liveLink.classList.remove('hidden');
      } else {
        liveLink.classList.add('hidden');
      }
    }

    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.classList.remove('opacity-0');
      modalContent.classList.remove('scale-95');
      modalContent.classList.add('scale-100');
    }, 10);

    document.body.style.overflow = 'hidden';
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  };

  function closeModal() {
    if (!modal) return;
    modal.classList.add('opacity-0');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }, 200);
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeCertificateModal();
      closeCustomizerModal();
    }
  });

  // --- Copy to Clipboard with Toast Notification ---
  window.copyEmail = function (emailStr) {
    const data = window.getActivePortfolioData ? window.getActivePortfolioData() : window.PORTFOLIO_DATA;
    const targetEmail = emailStr || (data.personal && data.personal.email) || 'kovvurinavyamounika@gmail.com';
    navigator.clipboard.writeText(targetEmail).then(() => {
      showToast('Email copied to clipboard! 📋');
    }).catch(() => {
      showToast('Click email to send message directly ✉️');
    });
  };

  window.showToast = function (message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('toast-enter');

    setTimeout(() => {
      toast.classList.add('hidden');
      toast.classList.remove('toast-enter');
    }, 3200);
  };

  // --- Interactive Contact Form Handling ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('sender-name');
      const emailInput = document.getElementById('sender-email');
      const messageInput = document.getElementById('sender-message');
      const submitBtn = document.getElementById('submit-btn');

      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        showToast('Please fill out all required fields.');
        return;
      }

      // Simulate sending state
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Sending Message...
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        showToast('Message sent successfully! Thanks for reaching out 🚀');
        contactForm.reset();
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      }, 1000);
    });
  }

  // =========================================================================
  // ⚙️ OWNER ONLY CUSTOMIZER (Protected by Owner PIN & Secret Shortcut)
  // =========================================================================
  const OWNER_PIN = '2026'; // Navya's secret owner PIN
  const customizerModal = document.getElementById('customizer-modal');
  const customizerCard = document.getElementById('customizer-card');
  const customizerBtn = document.getElementById('customizer-open-btn');
  const customizerCloseBtn = document.getElementById('customizer-close-btn');

  function openCustomizerModal() {
    if (!customizerModal) return;

    const enteredPin = prompt('🔒 Owner Verification Required:\nPlease enter your Owner PIN to edit this portfolio:');
    if (!enteredPin) return;
    if (enteredPin.trim() !== OWNER_PIN) {
      alert('⛔ Access Denied: Incorrect PIN. Only the portfolio owner is authorized to change photos or details.');
      return;
    }

    const data = window.getActivePortfolioData();

    // Populate inputs with current active data
    document.getElementById('edit-fullname').value = data.personal.fullName || '';
    document.getElementById('edit-shortname').value = data.personal.shortName || '';
    document.getElementById('edit-email').value = data.personal.email || '';
    document.getElementById('edit-photo-path').value = data.personal.profileImage || '';
    const photoPreview = document.getElementById('edit-photo-preview');
    if (photoPreview) {
      photoPreview.src = data.personal.profileImage || 'assets/default-avatar.svg';
    }
    document.getElementById('edit-tagline').value = data.personal.heroTagline || '';
    document.getElementById('edit-bio').value = data.personal.elevatorBio || '';
    document.getElementById('edit-location').value = data.personal.location || '';
    document.getElementById('edit-availability').value = data.personal.availability || '';

    document.getElementById('edit-degree').value = data.education.degree || '';
    document.getElementById('edit-institution').value = data.education.institution || '';
    document.getElementById('edit-cgpa').value = data.education.cgpa || '';
    document.getElementById('edit-timeline').value = data.education.timeline || '';

    document.getElementById('edit-github').value = (data.socialLinks && data.socialLinks.github) || '';
    document.getElementById('edit-linkedin').value = (data.socialLinks && data.socialLinks.linkedin) || '';
    document.getElementById('edit-leetcode').value = (data.socialLinks && data.socialLinks.leetcode) || '';

    document.getElementById('edit-dsasolved').value = (data.stats && data.stats.dsaSolved) || '';
    document.getElementById('edit-projectsbuilt').value = (data.stats && data.stats.projectsBuilt) || '';

    // Update code preview textarea
    updateCodePreview(data);

    customizerModal.classList.remove('hidden');
    setTimeout(() => {
      customizerModal.classList.remove('opacity-0');
      customizerCard.classList.remove('scale-95');
      customizerCard.classList.add('scale-100');
    }, 10);
    document.body.style.overflow = 'hidden';
  }

  function closeCustomizerModal() {
    if (!customizerModal) return;
    customizerModal.classList.add('opacity-0');
    customizerCard.classList.remove('scale-100');
    customizerCard.classList.add('scale-95');
    setTimeout(() => {
      customizerModal.classList.add('hidden');
      document.body.style.overflow = '';
    }, 200);
  }

  function updateCodePreview(dataObj) {
    const codeArea = document.getElementById('edit-code-export');
    if (codeArea) {
      codeArea.value = `window.PORTFOLIO_DATA = ${JSON.stringify(dataObj, null, 2)};`;
    }
  }

  if (customizerBtn) {
    customizerBtn.addEventListener('click', openCustomizerModal);
  }
  if (customizerCloseBtn) {
    customizerCloseBtn.addEventListener('click', closeCustomizerModal);
  }
  if (customizerModal) {
    customizerModal.addEventListener('click', (e) => {
      if (e.target === customizerModal) {
        closeCustomizerModal();
      }
    });
  }

  // Secret Owner Shortcut: Press Ctrl + Shift + E anytime
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
      e.preventDefault();
      openCustomizerModal();
    }
  });

  // Secret Owner Trigger: Triple-click the <KNM/> logo in navbar
  const logoElem = document.getElementById('brand-monogram');
  if (logoElem) {
    let logoClicks = 0;
    let logoTimer = null;
    logoElem.style.cursor = 'pointer';
    logoElem.addEventListener('click', (e) => {
      logoClicks++;
      clearTimeout(logoTimer);
      if (logoClicks >= 3) {
        e.preventDefault();
        logoClicks = 0;
        openCustomizerModal();
      } else {
        logoTimer = setTimeout(() => { logoClicks = 0; }, 700);
      }
    });
  }

  // Profile Photo File Upload Handler
  const photoFileInput = document.getElementById('edit-photo-file');
  if (photoFileInput) {
    photoFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          const dataUrl = uploadEvent.target.result;
          const photoPathInput = document.getElementById('edit-photo-path');
          if (photoPathInput) photoPathInput.value = dataUrl;
          const previewImg = document.getElementById('edit-photo-preview');
          if (previewImg) previewImg.src = dataUrl;
          showToast('Photo uploaded! Click Save to apply. 📷');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Save changes to browser localStorage and re-render instantly
  const saveBtn = document.getElementById('customizer-save-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const current = window.getActivePortfolioData();

      current.personal.fullName = document.getElementById('edit-fullname').value.trim() || current.personal.fullName;
      current.personal.shortName = document.getElementById('edit-shortname').value.trim() || current.personal.shortName;
      current.personal.email = document.getElementById('edit-email').value.trim() || current.personal.email;
      current.personal.profileImage = document.getElementById('edit-photo-path').value.trim() || current.personal.profileImage;
      current.personal.heroTagline = document.getElementById('edit-tagline').value.trim() || current.personal.heroTagline;
      current.personal.elevatorBio = document.getElementById('edit-bio').value.trim() || current.personal.elevatorBio;
      current.personal.location = document.getElementById('edit-location').value.trim() || current.personal.location;
      current.personal.availability = document.getElementById('edit-availability').value.trim() || current.personal.availability;

      current.education.degree = document.getElementById('edit-degree').value.trim() || current.education.degree;
      current.education.institution = document.getElementById('edit-institution').value.trim() || current.education.institution;
      current.education.cgpa = document.getElementById('edit-cgpa').value.trim() || current.education.cgpa;
      current.education.timeline = document.getElementById('edit-timeline').value.trim() || current.education.timeline;

      current.socialLinks = current.socialLinks || {};
      current.socialLinks.github = document.getElementById('edit-github').value.trim() || current.socialLinks.github;
      current.socialLinks.linkedin = document.getElementById('edit-linkedin').value.trim() || current.socialLinks.linkedin;
      current.socialLinks.leetcode = document.getElementById('edit-leetcode').value.trim() || current.socialLinks.leetcode;

      current.stats = current.stats || {};
      current.stats.dsaSolved = document.getElementById('edit-dsasolved').value.trim() || current.stats.dsaSolved;
      current.stats.projectsBuilt = document.getElementById('edit-projectsbuilt').value.trim() || current.stats.projectsBuilt;

      // Save to localStorage
      localStorage.setItem('NAVYA_PORTFOLIO_DATA', JSON.stringify(current));

      // Re-render UI live
      if (window.renderPortfolio) {
        window.renderPortfolio();
      }

      showToast('Portfolio updated successfully! 🎉');
      closeCustomizerModal();
    });
  }

  // Copy updated code to clipboard
  const copyCodeBtn = document.getElementById('customizer-copy-code-btn');
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', () => {
      const codeArea = document.getElementById('edit-code-export');
      if (codeArea) {
        navigator.clipboard.writeText(codeArea.value).then(() => {
          showToast('Config code copied! Paste it into js/portfolio-data.js 📋');
        });
      }
    });
  }

  // Reset to original default configuration
  const resetBtn = document.getElementById('customizer-reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all custom edits back to default?')) {
        localStorage.removeItem('NAVYA_PORTFOLIO_DATA');
        if (window.renderPortfolio) {
          window.renderPortfolio();
        }
        showToast('Reset to default configuration. ↺');
        closeCustomizerModal();
      }
    });
  }
});
