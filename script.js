(function () {
  const navLinks = Array.from(document.querySelectorAll(".section-nav a"));
  const sections = Array.from(document.querySelectorAll(".page"));
  const progressBar = document.getElementById("scrollMeterBar");

  function setActiveSection(id) {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.scrollIntoView({ block: "nearest", inline: "center" });
      }
    });
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        setActiveSection(visible.target.id);
      }
    },
    {
      root: null,
      rootMargin: "-42% 0px -42% 0px",
      threshold: [0, 0.25, 0.5, 0.75, 1],
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  function updateProgress() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    progressBar.style.transform = "scaleX(" + Math.min(Math.max(ratio, 0), 1) + ")";
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  document.querySelectorAll(".device-toggle").forEach((toggle) => {
    const preview = toggle.nextElementSibling;
    const buttons = Array.from(toggle.querySelectorAll("button"));

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const device = button.dataset.deviceTarget;
        preview.dataset.devicePreview = device;

        buttons.forEach((item) => {
          const selected = item === button;
          item.classList.toggle("is-active", selected);
          item.setAttribute("aria-pressed", String(selected));
        });
      });
    });
  });

  window.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      return;
    }

    const activeIndex = sections.findIndex((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5;
    });

    if (activeIndex === -1) {
      return;
    }

    const nextIndex = event.key === "ArrowDown" ? activeIndex + 1 : activeIndex - 1;
    const nextSection = sections[nextIndex];

    if (nextSection) {
      event.preventDefault();
      nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
})();
