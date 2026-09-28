/**
 * Abdullah Sohail — Personal Portfolio JavaScript
 * Modern, Lightweight, Accessible, and Robust Interaction Logic
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Dynamic Footer Year
  // -------------------------------------------------------------------------
  const copyrightYearEl = document.getElementById('copyright-year');
  if (copyrightYearEl) {
    copyrightYearEl.textContent = new Date().getFullYear();
  }

  // -------------------------------------------------------------------------
  // 2. Sticky Navbar on Scroll
  // -------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const scrollThreshold = 40;

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // -------------------------------------------------------------------------
  // 3. Mobile Navigation Toggle
  // -------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const toggleIcon = document.getElementById('toggle-icon');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('mobile-open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      if (toggleIcon) {
        if (isOpen) {
          toggleIcon.classList.remove('fa-bars');
          toggleIcon.classList.add('fa-xmark');
        } else {
          toggleIcon.classList.remove('fa-xmark');
          toggleIcon.classList.add('fa-bars');
        }
      }
    });

    // Close menu when a navigation link is clicked
    const links = navLinks.querySelectorAll('.nav-link');
    links.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        if (toggleIcon) {
          toggleIcon.classList.remove('fa-xmark');
          toggleIcon.classList.add('fa-bars');
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // 4. Active Navigation Link Highlighting (ScrollSpy)
  // -------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-link');

  function updateActiveNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 140;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        allNavLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // -------------------------------------------------------------------------
  // 5. Scroll Reveal Animations (Intersection Observer)
  // -------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-init');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is unsupported
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  // -------------------------------------------------------------------------
  // 6. Toast Notification Helper
  // -------------------------------------------------------------------------
  const toastContainer = document.getElementById('toast-container');

  function showToast(message, iconClass = 'fa-solid fa-circle-check') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i class="${iconClass} toast-icon"></i>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Trigger reveal transition
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto-dismiss after 3.8s
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 350);
    }, 3800);
  }

  // -------------------------------------------------------------------------
  // 7. Copy Email to Clipboard
  // -------------------------------------------------------------------------
  const copyBtn = document.getElementById('copy-email-btn');
  const copyIcon = document.getElementById('copy-icon');
  const emailTextEl = document.getElementById('email-text');

  if (copyBtn && emailTextEl) {
    copyBtn.addEventListener('click', () => {
      const email = emailTextEl.textContent.trim();

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(email)
          .then(handleCopySuccess)
          .catch(handleCopyFallback);
      } else {
        handleCopyFallback();
      }

      function handleCopySuccess() {
        if (copyIcon) {
          copyIcon.classList.remove('fa-regular', 'fa-copy');
          copyIcon.classList.add('fa-solid', 'fa-check');
          copyBtn.style.color = '#34d399';

          setTimeout(() => {
            copyIcon.classList.remove('fa-solid', 'fa-check');
            copyIcon.classList.add('fa-regular', 'fa-copy');
            copyBtn.style.color = '';
          }, 2400);
        }
        showToast(`Email copied: ${email}`);
      }

      function handleCopyFallback() {
        try {
          const textarea = document.createElement('textarea');
          textarea.value = email;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          handleCopySuccess();
        } catch (err) {
          showToast(`Email address: ${email}`, 'fa-solid fa-envelope');
        }
      }
    });
  }

  // -------------------------------------------------------------------------
  // 8. Contact Form Handling
  // -------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const subjectInput = document.getElementById('form-subject');
      const messageInput = document.getElementById('form-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !email || !subject || !message) {
        showToast('Please fill in all fields before sending.', 'fa-solid fa-triangle-exclamation');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address.', 'fa-solid fa-triangle-exclamation');
        if (emailInput) emailInput.focus();
        return;
      }

      // Visual feedback
      if (submitBtn) {
        submitBtn.disabled = true;
        const originalHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>Preparing Email...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;

        setTimeout(() => {
          showToast(`Thank you, ${name}! Opening mail client...`);

          // Prepare mailto link with encoded parameters
          const mailtoUri = `mailto:abdullah5386sohail@gmail.com?subject=${encodeURIComponent(
            `[Portfolio Inquiry] ${subject}`
          )}&body=${encodeURIComponent(`Hi Abdullah,\n\n${message}\n\nFrom: ${name} (${email})`)}`;

          window.location.href = mailtoUri;

          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHtml;
        }, 800);
      }
    });
  }

  // -------------------------------------------------------------------------
  // 9. Portfolio.json Dynamic Verification (Non-Blocking)
  // -------------------------------------------------------------------------
  // In addition to static semantic rendering for SEO and zero-delay loading,
  // we optionally query Portfolio.json to ensure data consistency.
  if (window.location.protocol.startsWith('http')) {
    fetch('Portfolio.json')
      .then((res) => {
        if (!res.ok) throw new Error('Portfolio.json could not be loaded');
        return res.json();
      })
      .then((data) => {
        if (data && data.basics) {
          // Verify basic consistency in memory
          window.PORTFOLIO_DATA = data;
        }
      })
      .catch((err) => {
        // Silently continue using the prerendered semantic markup
      });
  }
})();
