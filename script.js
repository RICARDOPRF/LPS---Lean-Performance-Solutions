(function () {
  // Reveal on scroll
  function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
      var windowHeight = window.innerHeight;
      var elementTop = reveals[i].getBoundingClientRect().top;
      if (elementTop < windowHeight - 100) reveals[i].classList.add("active");
    }
  }

  // Tabs
  function setupTabs() {
    const chips = document.querySelectorAll(".chip");
    const tabs = document.querySelectorAll(".tab");
    chips.forEach((btn) => {
      btn.addEventListener("click", () => {
        chips.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const id = btn.getAttribute("data-tab");
        tabs.forEach((t) => t.classList.remove("active"));
        const el = document.getElementById(id);
        if (el) el.classList.add("active");

        reveal();
        const g = document.getElementById("galerias");
        if (g) window.scrollTo({ top: g.offsetTop - 80, behavior: "smooth" });
      });
    });
  }

  // Year
  function setYear() {
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  // LIGHTBOX
  let lbGallery = [];
  let lbIndex = 0;
  let lbTouchStartX = null;

  function reminderNavButtons() {
    const prevBtn = document.querySelector(".lb-prev");
    const nextBtn = document.querySelector(".lb-next");
    if (!prevBtn || !nextBtn) return;
    const show = lbGallery.length > 1;
    prevBtn.style.display = show ? "flex" : "none";
    nextBtn.style.display = show ? "flex" : "none";
  }

  function renderLightbox() {
    const current = lbGallery[lbIndex];
    const img = document.getElementById("lightbox-img");
    const caption = document.getElementById("lightbox-caption");
    if (!current || !img || !caption) return;

    img.src = current.src;
    img.alt = current.alt || "Imagem ampliada";
    caption.textContent = current.dataset.caption || "";
  }

  window.openLightbox = function (imgEl) {
    const galleryName = imgEl.dataset.gallery || "default";
    lbGallery = Array.from(document.querySelectorAll('img[data-gallery="' + galleryName + '"]'));
    lbIndex = lbGallery.indexOf(imgEl);
    if (lbIndex < 0) lbIndex = 0;

    renderLightbox();

    const lightbox = document.getElementById("lightbox");
    if (!lightbox) return;
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    reminderNavButtons();
  };

  window.closeLightbox = function () {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox) return;
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
  };

  window.nextLightbox = function () {
    if (!lbGallery.length) return;
    lbIndex = (lbIndex + 1) % lbGallery.length;
    renderLightbox();
    reminderNavButtons();
  };

  window.prevLightbox = function () {
    if (!lbGallery.length) return;
    lbIndex = (lbIndex - 1 + lbGallery.length) % lbGallery.length;
    renderLightbox();
    reminderNavButtons();
  };

  function wireLightboxEvents() {
    const lightbox = document.getElementById("lightbox");
    const inner = document.querySelector(".lightbox-inner");
    const lbImg = document.getElementById("lightbox-img");

    if (lightbox) {
      lightbox.addEventListener("click", window.closeLightbox);
    }
    if (inner) {
      inner.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    }

    document.addEventListener("keydown", function (e) {
      const isOpen = document.getElementById("lightbox")?.classList.contains("active");
      if (!isOpen) return;

      if (e.key === "Escape") window.closeLightbox();
      if (e.key === "ArrowRight") window.nextLightbox();
      if (e.key === "ArrowLeft") window.prevLightbox();
    });

    // Swipe mobile
    if (lbImg) {
      lbImg.addEventListener(
        "touchstart",
        function (e) {
          lbTouchStartX = e.touches[0].clientX;
        },
        { passive: true }
      );
      lbImg.addEventListener(
        "touchend",
        function (e) {
          if (lbTouchStartX === null) return;
          const endX = e.changedTouches[0].clientX;
          const diff = endX - lbTouchStartX;
          lbTouchStartX = null;

          if (Math.abs(diff) > 45) {
            if (diff < 0) window.nextLightbox();
            else window.prevLightbox();
          }
        },
        { passive: true }
      );
    }
  }

// Backward-compat aliases (caso alguma página antiga chame esses nomes)
window.nextImage = window.nextLightbox;
window.prevImage = window.prevLightbox;

  window.addEventListener("scroll", reveal);

  window.addEventListener("load", function () {
    reveal();
    setupTabs();
    setYear();
    wireLightboxEvents();
  });
})();
