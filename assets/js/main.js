/**
 * LagunaGuide Showcase & Documentation Platform
 * Interactive Script
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Navigation Toggle
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close menu when a link is clicked on mobile
    navMenu.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 2. Populate External Links from config.js
  if (window.LAGUNAGUIDE_CONFIG) {
    const config = window.LAGUNAGUIDE_CONFIG;
    const repo = config.repoUrl || config.repo;
    const manuscript = config.manuscriptUrl || config.manuscript;
    const video = config.videoUrl || config.video;

    document.querySelectorAll("[data-link='repo']").forEach((el) => {
      if (repo) {
        el.href = repo;
        const text = el.querySelector("[data-url-text]");
        if (text) text.textContent = repo.replace(/^https?:\/\//, "");
      }
    });

    document.querySelectorAll("[data-link='manuscript']").forEach((el) => {
      if (manuscript) {
        el.href = manuscript;
      }
    });

    document.querySelectorAll("[data-link='video']").forEach((el) => {
      if (video) {
        el.href = video;
      }
    });
  }

  // 3. Lightbox Viewer (Full Resolution, Uncropped Containment)
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbTitle = document.getElementById("lbTitle");
  const lbClose = document.getElementById("lbClose");

  if (lightbox && lbImg) {
    const openLightbox = (src, title) => {
      lbImg.src = src;
      lbImg.alt = title || "Interface Screenshot";
      if (lbTitle) lbTitle.textContent = title || "System Interface";
      if (typeof lightbox.showModal === "function") {
        lightbox.showModal();
      } else {
        lightbox.setAttribute("open", "");
      }
    };

    const closeLightbox = () => {
      if (typeof lightbox.close === "function") {
        lightbox.close();
      } else {
        lightbox.removeAttribute("open");
      }
      lbImg.src = "";
    };

    // Attach to any zoom trigger or screenshot canvas
    document.querySelectorAll(".browser-canvas, .btn-zoom, .btn-zoom-trigger").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const fullSrc = el.getAttribute("data-full");
        const altText = el.getAttribute("data-alt") || el.querySelector("img")?.alt || "Interface Preview";
        if (fullSrc) {
          openLightbox(fullSrc, altText);
        }
      });
    });

    if (lbClose) {
      lbClose.addEventListener("click", closeLightbox);
    }

    // Close when clicking the dialog backdrop outside the window
    lightbox.addEventListener("click", (e) => {
      const rect = lightbox.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        closeLightbox();
      }
    });
  }

  // 4. APA Citation Copy
  const btnCopyCite = document.getElementById("btnCopyCite");
  const citeText = document.getElementById("citeText");
  const toast = document.getElementById("toast");

  if (btnCopyCite && citeText && toast) {
    btnCopyCite.addEventListener("click", async (e) => {
      e.preventDefault();
      const textToCopy = citeText.innerText || citeText.textContent;
      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast("Citation copied to clipboard");
      } catch (err) {
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        showToast("Citation copied to clipboard");
      }
    });
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  // 5. Scroll-Spy for Header Navigation Links
  const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
  const sections = Array.from(navLinks)
    .map((link) => {
      const id = link.getAttribute("href").replace("#", "");
      return document.getElementById(id);
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = entry.target.id;
            navLinks.forEach((link) => {
              const href = link.getAttribute("href");
              if (href === `#${currentId}`) {
                link.classList.add("active");
              } else {
                link.classList.remove("active");
              }
            });
          }
        });
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: 0,
      }
    );

    sections.forEach((sec) => observer.observe(sec));
  }
});
