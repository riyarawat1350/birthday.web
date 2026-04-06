/**
 * EventDhara Premium Master Script
 * Handles Theme, Cart, Modals, Interactivity, Animations & Confetti
 */

document.addEventListener('DOMContentLoaded', () => {

  // =============================================
  // 1. PRELOADER & SCROLL PROGRESS
  // =============================================
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.style.opacity = '0';
      setTimeout(() => preloader.style.display = 'none', 500);
    }
  });

  const scrollProgress = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    if (scrollProgress) {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = `${(scrollPx / winHeightPx) * 100}%`;
      scrollProgress.style.width = scrolled;
    }
  });

  // =============================================
  // 2. DARK MODE THEME TOGGLE (LocalStorage)
  // =============================================
  const themeToggleBtn = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;

  // Check saved theme
  const savedTheme = localStorage.getItem('EventDhara_Theme') || 'light';
  htmlEl.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('EventDhara_Theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('i');
    if (theme === 'dark') {
      icon.className = 'fa-solid fa-sun';
      icon.style.color = '#f4d03f';
    } else {
      icon.className = 'fa-solid fa-moon';
      icon.style.color = 'var(--text)';
    }
  }

  // =============================================
  // 3. NAVBAR & MOBILE MENU
  // =============================================
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-link');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const floatingBookBtn = document.getElementById('floatingBookBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
      scrollTopBtn?.classList.remove('hidden');
      floatingBookBtn?.classList.remove('hidden');
    } else {
      navbar.classList.remove('scrolled');
      scrollTopBtn?.classList.add('hidden');
      floatingBookBtn?.classList.add('hidden');
    }
  });

  // Mobile Menu Toggle
  hamburger?.addEventListener('click', () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('mobile-open');
    if (!isExpanded) {
      document.body.style.overflow = 'hidden'; // Stop scrolling
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close mobile menu on link click
  navItems.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('mobile-open');
      document.body.style.overflow = '';
    });
  });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  floatingBookBtn?.addEventListener('click', () => {
    document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
  });

  // =============================================
  // 4. SCROLL REVEAL (Intersection Observer)
  // =============================================
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { root: null, threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // Parallax effect for Hero
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    document.querySelectorAll('.parallax').forEach(el => {
      const speed = el.getAttribute('data-speed');
      el.style.transform = `translateY(${scrolled * speed * 0.05}px)`;
    });
  });

  // =============================================
  // 5. STATS ANIMATION CONTROLLER
  // =============================================
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsStarted = false;

  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !statsStarted) {
      statsStarted = true;
      statNumbers.forEach(stat => {
        const target = parseFloat(stat.getAttribute('data-target'));
        const isDecimal = stat.getAttribute('data-decimal') === 'true';
        const suffix = stat.getAttribute('data-suffix') || '';
        const duration = 2000;
        const start = performance.now();

        function updateStat(currentTime) {
          const elapsed = currentTime - start;
          const progress = Math.min(elapsed / duration, 1);
          // Easing function
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          let currentVal = target * easeOutQuart;
          
          if (isDecimal) {
            stat.innerText = currentVal.toFixed(1) + suffix;
          } else {
            stat.innerText = Math.floor(currentVal) + suffix;
          }

          if (progress < 1) {
            requestAnimationFrame(updateStat);
          } else {
            stat.innerText = target + suffix;
          }
        }
        requestAnimationFrame(updateStat);
      });
    }
  }, { threshold: 0.5 });
  
  const statsSection = document.getElementById('stats');
  if (statsSection) statsObserver.observe(statsSection);

  // =============================================
  // 6. GALLERY SEARCH (Simple & Robust)
  // =============================================
  const galleryItems = document.querySelectorAll('.gallery-item');
  const gallerySearch = document.getElementById('gallerySearch');

  gallerySearch?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();

    galleryItems.forEach(item => {
      const keywords = item.getAttribute('data-keywords')?.toLowerCase() || '';
      const altText = item.querySelector('img')?.getAttribute('alt')?.toLowerCase() || '';
      
      if (term === '' || keywords.includes(term) || altText.includes(term)) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });

  // =============================================
  // 7. FAQ ACCORDION
  // =============================================
  const faqBtns = document.querySelectorAll('.faq-btn');
  faqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      
      // Close all other faqs
      faqBtns.forEach(b => {
        if (b !== btn) {
          b.setAttribute('aria-expanded', 'false');
          b.nextElementSibling.style.display = 'none';
        }
      });

      // Toggle current
      btn.setAttribute('aria-expanded', !isExpanded);
      const content = btn.nextElementSibling;
      if (!isExpanded) {
        content.style.display = 'block';
        content.style.animation = 'fadeInUp 0.3s ease forwards';
      } else {
        content.style.display = 'none';
      }
    });
  });

  // =============================================
  // 8. REVIEW CAROUSEL (Touch & Arrow supported)
  // =============================================
  const reviewTrack = document.getElementById('reviewsTrack');
  const reviewPrev = document.getElementById('reviewPrev');
  const reviewNext = document.getElementById('reviewNext');
  const reviewCards = document.querySelectorAll('.review-card');
  const reviewDotsContainer = document.getElementById('reviewDots');

  if (reviewTrack && reviewCards.length > 0) {
    let currentReview = 0;
    const totalReviews = reviewCards.length;
    
    // Create dots
    reviewCards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `review-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to review ${i + 1}`);
      dot.addEventListener('click', () => goToReview(i));
      reviewDotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.review-dot');

    function goToReview(index) {
      if (index < 0) index = 0;
      if (index >= totalReviews) index = totalReviews - 1;
      currentReview = index;
      
      // Calculate transform
      const cardWidth = reviewCards[0].offsetWidth;
      const gap = 24;
      reviewTrack.style.transform = `translateX(-${index * (cardWidth + gap)}px)`;
      
      // Update dots
      dots.forEach(d => d.classList.remove('active'));
      dots[index].classList.add('active');
    }

    reviewPrev.addEventListener('click', () => goToReview(currentReview - 1));
    reviewNext.addEventListener('click', () => goToReview(currentReview + 1));

    // Autoplay wrapper
    setInterval(() => {
      let next = currentReview + 1;
      if(next >= totalReviews) next = 0;
      goToReview(next);
    }, 5000);
  }

  // =============================================
  // 9. CART SYSTEM (LocalStorage)
  // =============================================
  const cartIconBtn = document.getElementById('cartIconBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartDrawerBackdrop = document.getElementById('cartDrawerBackdrop');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartDrawerBody = document.getElementById('cartDrawerBody');
  const cartDrawerTotal = document.getElementById('cartDrawerTotal');
  const cartCount = document.getElementById('cartCount');
  const cartCheckoutBtn = document.getElementById('cartCheckoutBtn');

  // Load from local storage
  let cart = JSON.parse(localStorage.getItem('EventDhara_Cart')) || [];

  function saveCart() {
    localStorage.setItem('EventDhara_Cart', JSON.stringify(cart));
    renderCart();
  }

  function addToCart(item) {
    // Generate unique ID based on package + theme + timestamp
    const uniqueId = `item_${Date.now()}`;
    const cartItem = { ...item, id: uniqueId };
    cart.push(cartItem);
    saveCart();
    showToast('Event Package added to Cart!');
  }

  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
  }

  function renderCart() {
    // Update bubble
    cartCount.innerText = cart.length;
    
    // Render items
    if (cart.length === 0) {
      cartDrawerBody.innerHTML = `<div class="cart-empty-state">Cart is currently empty.</div>`;
      cartDrawerTotal.innerText = '₹0';
      cartCheckoutBtn.disabled = true;
      cartCheckoutBtn.style.opacity = '0.5';
      return;
    }

    cartCheckoutBtn.disabled = false;
    cartCheckoutBtn.style.opacity = '1';

    let html = '';
    let total = 0;

    cart.forEach(item => {
      total += item.price;
      // build addons string
      const addonsStr = item.addons.length > 0 ? `+ ${item.addons.map(a => a.label).join(', ')}` : 'No Add-ons';
      html += `
        <div class="cart-item">
          <div class="cart-item-info">
            <span class="cart-item-name">${item.pkgName} Package</span>
            <span class="cart-item-desc">Theme: ${item.theme}</span>
            <span class="cart-item-desc">${addonsStr}</span>
            <span class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</span>
          </div>
          <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove item">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;
    });

    cartDrawerBody.innerHTML = html;
    cartDrawerTotal.innerText = `₹${total.toLocaleString('en-IN')}`;

    // Attach remove listeners
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        removeFromCart(id);
      });
    });
  }

  // Cart Drawer toggles
  function openCart() {
    cartDrawer.classList.add('open');
    cartDrawer.classList.remove('hidden'); // Fix: Remove hidden class
    cartDrawerBackdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    cartDrawer.classList.remove('open');
    cartDrawer.classList.add('hidden'); // Fix: Add hidden class back
    cartDrawerBackdrop.classList.add('hidden');
    document.body.style.overflow = '';
  }

  cartIconBtn?.addEventListener('click', openCart);
  closeCartBtn?.addEventListener('click', closeCart);
  cartDrawerBackdrop?.addEventListener('click', closeCart);

  // Initialize cart on load
  renderCart();


  // =============================================
  // 10. MODAL HANDLING & PACKAGE CUSTOMIZATION
  // =============================================
  
  // State for Step A modal form
  let currentPackage = {
    name: 'Basic',
    basePrice: 5999,
    theme: 'Kids',
    addons: []
  };

  const stepAModal = document.getElementById('stepAModal');
  const stepAClose = document.getElementById('stepAClose');
  const modalBasePrice = document.getElementById('modalBasePrice');
  const stepATotalAmount = document.getElementById('stepATotalAmount');
  
  const themeRadios = document.querySelectorAll('input[name="theme"]');
  const addonCheckboxes = document.querySelectorAll('input[name="addon"]');
  
  const wishlistBtn = document.getElementById('wishlistBtn');
  const cartAddBtn = document.getElementById('cartAddBtn');
  const buyNowBtn = document.getElementById('buyNowBtn');

  // Trigger Modal A from Pricing Buttons
  document.querySelectorAll('.book-now-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentPackage.name = e.currentTarget.getAttribute('data-package');
      currentPackage.basePrice = parseInt(e.currentTarget.getAttribute('data-price'));
      
      // Reset Modal state
      themeRadios[0].checked = true;
      currentPackage.theme = themeRadios[0].value;
      
      addonCheckboxes.forEach(cb => cb.checked = false);
      currentPackage.addons = [];
      
      updateModalATotal();
      
      // Open Modal
      stepAModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      
      // Hide cart if open
      closeCart();
    });
  });

  // Close Modal A
  stepAClose?.addEventListener('click', () => {
    stepAModal.classList.add('hidden');
    document.body.style.overflow = '';
  });

  // Calculate Modal A Total
  function updateModalATotal() {
    modalBasePrice.innerText = `₹${currentPackage.basePrice.toLocaleString('en-IN')}`;
    let total = currentPackage.basePrice;
    
    currentPackage.addons = [];
    addonCheckboxes.forEach(cb => {
      if (cb.checked) {
        const price = parseInt(cb.getAttribute('data-price'));
        total += price;
        currentPackage.addons.push({
          id: cb.value,
          label: cb.getAttribute('data-label'),
          price: price
        });
      }
    });

    // Capture theme
    themeRadios.forEach(radio => {
      if(radio.checked) currentPackage.theme = radio.value;
    });

    stepATotalAmount.innerText = `₹${total.toLocaleString('en-IN')}`;
    currentPackage.finalPrice = total;
  }

  // Listeners for changing themes/addons
  themeRadios.forEach(r => r.addEventListener('change', updateModalATotal));
  addonCheckboxes.forEach(c => c.addEventListener('change', updateModalATotal));

  // Modals Actions
  wishlistBtn?.addEventListener('click', () => {
    showToast('Added to your Wishlist!');
    stepAModal.classList.add('hidden');
    document.body.style.overflow = '';
  });

  cartAddBtn?.addEventListener('click', () => {
    addToCart({
      pkgName: currentPackage.name,
      basePrice: currentPackage.basePrice,
      theme: currentPackage.theme,
      addons: currentPackage.addons,
      price: currentPackage.finalPrice
    });
    stepAModal.classList.add('hidden');
    document.body.style.overflow = '';
  });

  // Proceed directly to Checkout
  buyNowBtn?.addEventListener('click', () => {
    stepAModal.classList.add('hidden');
    openCheckout([ {
      pkgName: currentPackage.name,
      basePrice: currentPackage.basePrice,
      theme: currentPackage.theme,
      addons: currentPackage.addons,
      price: currentPackage.finalPrice
    } ]);
  });

  // Proceed to Checkout from Cart
  cartCheckoutBtn?.addEventListener('click', () => {
    if (cart.length === 0) return;
    closeCart();
    openCheckout(cart);
  });


  // =============================================
  // 11. STEP B CHECKOUT & UPSELL LOGIC
  // =============================================
  const stepBModal = document.getElementById('stepBModal');
  const stepBClose = document.getElementById('stepBClose');
  const orderSummaryList = document.getElementById('orderSummaryList');
  const grandTotalAmount = document.getElementById('grandTotalAmount');
  const upsellCheckboxes = document.querySelectorAll('input[name="upsell"]');
  const checkoutSubmitForm = document.getElementById('checkoutSubmitForm');
  const confirmPayBtn = document.getElementById('confirmPayBtn');
  const paySuccess = document.getElementById('paySuccess');
  
  let checkoutItems = []; // What's currently being bought
  let checkoutBaseTotal = 0; // Total of items from cart/package
  let finalGrandTotal = 0; // After upsells

  stepBClose?.addEventListener('click', () => {
    stepBModal.classList.add('hidden');
    document.body.style.overflow = '';
  });

  function openCheckout(itemsToBuy) {
    checkoutItems = itemsToBuy;
    checkoutBaseTotal = 0;
    
    // Reset upsells
    upsellCheckboxes.forEach(cb => cb.checked = false);

    // Reset Form & Success states
    checkoutSubmitForm.reset();
    checkoutSubmitForm.style.display = 'block';
    paySuccess.classList.add('hidden');
    confirmPayBtn.disabled = false;
    confirmPayBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Confirm &amp; Pay';

    // Build Summary
    let summaryHTML = '';
    
    checkoutItems.forEach(item => {
      checkoutBaseTotal += item.price;
      summaryHTML += `<div class="summary-row bold"><span>${item.pkgName} Package (${item.theme})</span><span>₹${item.price.toLocaleString('en-IN')}</span></div>`;
    });

    orderSummaryList.innerHTML = summaryHTML;
    
    updateCheckoutGrandTotal();
    
    stepBModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function updateCheckoutGrandTotal() {
    let upsellTotal = 0;
    upsellCheckboxes.forEach(cb => {
      if (cb.checked) {
        upsellTotal += parseInt(cb.getAttribute('data-price'));
      }
    });

    finalGrandTotal = checkoutBaseTotal + upsellTotal;
    grandTotalAmount.innerText = `₹${finalGrandTotal.toLocaleString('en-IN')}`;
  }

  upsellCheckboxes.forEach(cb => cb.addEventListener('change', updateCheckoutGrandTotal));

  // Form Submit & Payment Simulation
  checkoutSubmitForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!checkoutSubmitForm.checkValidity()) {
      return; // Handled by native browser tooltips
    }

    // Simulate Payment Processing
    confirmPayBtn.disabled = true;
    confirmPayBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    
    setTimeout(() => {
      checkoutSubmitForm.style.display = 'none';
      
      // Show Success State
      paySuccess.classList.remove('hidden');
      
      // Empty Cart Since We Paid!
      cart = [];
      saveCart();

      // Trigger Confetti!
      triggerConfetti();

    }, 1500);

  });

  // =============================================
  // 12. TOAST NOTIFICATION
  // =============================================
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  
  function showToast(msg) {
    toastMessage.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // =============================================
  // 13. CONFETTI ENGINE (Vanilla JS Canvas)
  // =============================================
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  let confettiParticles = [];
  let confettiAnimationId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function triggerConfetti() {
    canvas.classList.remove('hidden');
    confettiParticles = [];
    const colors = ['#daa520', '#f4d03f', '#ffffff', '#e74c3c', '#2ecc71', '#3498db'];
    
    // Create 150 particles
    for (let i = 0; i < 150; i++) {
      confettiParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height, // start above screen
        r: Math.random() * 6 + 2, // size
        d: Math.random() * 10 + 2, // speed density
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngleInc: (Math.random() * 0.07) + 0.05,
        tiltAngle: 0
      });
    }

    let angle = 0;

    function renderConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      angle += 0.01;
      
      let particlesActive = false;

      confettiParticles.forEach((p, i) => {
        // Draw
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
        ctx.stroke();

        // Update positions
        p.tiltAngle += p.tiltAngleInc;
        p.y += (Math.cos(angle + p.d) + 1 + p.r / 2) / 2;
        p.x += Math.sin(angle);
        p.tilt = Math.sin(p.tiltAngle) * 15;

        // If particle hasn't fallen past bottom, active is true
        if (p.y <= canvas.height) {
          particlesActive = true;
        }
      });

      if (particlesActive) {
        confettiAnimationId = requestAnimationFrame(renderConfetti);
      } else {
        cancelAnimationFrame(confettiAnimationId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    
    // Start loop
    renderConfetti();
  }

  // =============================================
  // 14. GALLERY LIGHTBOX LOGIC
  // =============================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightbox && galleryItems.length > 0) {
    
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const src = img.getAttribute('src');
        const alt = img.getAttribute('alt');

        lightboxImg.setAttribute('src', src);
        lightboxCaption.innerText = alt;
        
        lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Lock scroll
      });
    });

    function closeLightbox() {
      lightbox.classList.add('hidden');
      document.body.style.overflow = ''; // Unlock scroll
      // Clear src to stop loading if needed
      setTimeout(() => {
        if(lightbox.classList.contains('hidden')) lightboxImg.setAttribute('src', '');
      }, 500);
    }

    lightboxClose?.addEventListener('click', closeLightbox);
    
    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
        closeLightbox();
      }
    });
  }

});
