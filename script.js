document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const revealItems = document.querySelectorAll(".reveal");
  if (!revealItems.length) {
    return;
  }

  const activateItem = (item) => {
    const delay = Number(item.getAttribute("data-delay") || 0);
    window.setTimeout(() => item.classList.add("active"), delay);
  };

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => activateItem(item));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        activateItem(entry.target);
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -50px 0px"
    }
  );

  revealItems.forEach((item) => observer.observe(item));
});
