/* AUST EEE '56 - interactions & animations */

const header = document.querySelector(".site-header");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const navScrim = document.getElementById("navScrim");
const searchInput = document.getElementById("globalSearch");
const searchHint = document.getElementById("searchHint");
const noResults = document.getElementById("noResults");
const toast = document.getElementById("siteToast");

let revealObserver;
let navObserver;
let toastTimer;
const countdownIntervals = new Set();
const initialized = {
  shell: false,
  placeholders: false,
  tabs: false,
  search: false,
  modals: false,
  subscribe: false,
};

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3600);
}

function closeNav() {
  navLinks?.classList.remove("open");
  navToggle?.classList.remove("open");
  navScrim?.classList.remove("open");
  navToggle?.setAttribute("aria-expanded", "false");
  document.body.classList.remove("nav-open");
}

function openNav() {
  navLinks?.classList.add("open");
  navToggle?.classList.add("open");
  navScrim?.classList.add("open");
  navToggle?.setAttribute("aria-expanded", "true");
  document.body.classList.add("nav-open");
}

function initShell() {
  if (initialized.shell) return;
  initialized.shell = true;

  window.addEventListener(
    "scroll",
    () => header?.classList.toggle("scrolled", window.scrollY > 24),
    { passive: true }
  );

  navToggle?.addEventListener("click", () => {
    const isOpen = navLinks?.classList.contains("open");
    isOpen ? closeNav() : openNav();
  });

  navScrim?.addEventListener("click", closeNav);
  navLinks?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));

  document.addEventListener("click", (e) => {
    if (!navLinks?.classList.contains("open")) return;
    if (navLinks.contains(e.target) || navToggle?.contains(e.target)) return;
    closeNav();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      searchInput?.focus();
    }
  });
}

window.initScrollReveal = function initScrollReveal() {
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const delay = Number(entry.target.dataset.delay || 0) * 70;
          window.setTimeout(() => entry.target.classList.add("visible"), delay);
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
    );
  }

  document.querySelectorAll(".reveal:not(.visible)").forEach((el, i) => {
    el.dataset.delay = String(i % 5);
    revealObserver.observe(el);
  });
};

function initActiveNav() {
  if (!("IntersectionObserver" in window)) return;
  navObserver?.disconnect();

  const links = [...document.querySelectorAll(".nav-links a[href^='#']")];
  const linkById = new Map(
    links
      .map((link) => [link.getAttribute("href")?.slice(1), link])
      .filter(([id]) => id)
  );

  navObserver = new IntersectionObserver(
    (entries) => {
      const active = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!active) return;
      links.forEach((link) => link.removeAttribute("aria-current"));
      linkById.get(active.target.id)?.setAttribute("aria-current", "page");
    },
    { threshold: [0.18, 0.35], rootMargin: "-22% 0px -60% 0px" }
  );

  document.querySelectorAll("main section[id]").forEach((section) => navObserver.observe(section));
}

function initCountdowns() {
  countdownIntervals.forEach((id) => clearInterval(id));
  countdownIntervals.clear();

  document.querySelectorAll(".countdown-card").forEach((card) => {
    const target = Date.parse(card.dataset.date || "");
    const timer = card.querySelector(".timer");
    if (!timer) return;

    if (Number.isNaN(target)) {
      card.classList.add("countdown-empty");
      timer.innerHTML = '<p class="countdown-note">Date coming soon</p>';
      return;
    }

    const blocks = {
      days: timer.querySelector(".days"),
      hours: timer.querySelector(".hours"),
      minutes: timer.querySelector(".minutes"),
      seconds: timer.querySelector(".seconds"),
    };

    const pad = (n) => String(Math.max(0, n)).padStart(2, "0");

    function tick() {
      let diff = Math.max(0, target - Date.now());
      const days = Math.floor(diff / 86400000);
      diff %= 86400000;
      const hours = Math.floor(diff / 3600000);
      diff %= 3600000;
      const minutes = Math.floor(diff / 60000);
      diff %= 60000;
      const seconds = Math.floor(diff / 1000);

      Object.entries({ days, hours, minutes, seconds }).forEach(([key, value]) => {
        const el = blocks[key];
        if (!el) return;
        const next = pad(value);
        if (el.textContent === next) return;
        el.textContent = next;
        const block = el.closest(".time-block");
        block?.classList.add("tick");
        window.setTimeout(() => block?.classList.remove("tick"), 350);
      });
    }

    tick();
    countdownIntervals.add(setInterval(tick, 1000));
  });
}

function initPlaceholderLinks() {
  if (initialized.placeholders) return;
  initialized.placeholders = true;

  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-placeholder]");
    if (!link) return;
    if (link.getAttribute("href") && link.getAttribute("href") !== "#") return;
    e.preventDefault();
    const label = link.dataset.placeholderLabel || link.textContent?.trim() || "this link";
    showToast(`${label} is coming soon. Add the URL in site-data.js when ready.`);
    if (searchHint) searchHint.textContent = "Coming soon - link is not connected yet.";
  });
}

function initTabs() {
  if (initialized.tabs) return;
  initialized.tabs = true;

  document.querySelectorAll(".exam-tabs .tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".exam-tabs .tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(`tab-${tab.dataset.tab}`)?.classList.add("active");
    });
  });
}

function runSearch(query) {
  const q = query.trim().toLowerCase();
  let matchCount = 0;

  const matchText = (el) => (el.dataset.searchable || el.textContent || "").toLowerCase().includes(q);

  document.querySelectorAll(".notice-item, #resourceTable tbody tr, .member-card").forEach((el) => {
    const match = !q || matchText(el);
    el.classList.toggle("hidden-search", !match);
    if (match && q) matchCount += 1;
  });

  document.querySelectorAll(".exam-card").forEach((card) => {
    const match = !q || matchText(card);
    card.classList.toggle("dimmed-search", !match);
    if (match && q) matchCount += 1;
  });

  noResults?.classList.toggle("hidden", !q || matchCount > 0);

  if (searchHint) {
    searchHint.textContent = q
      ? matchCount
        ? `${matchCount} result${matchCount === 1 ? "" : "s"} found`
        : "No matches - try another keyword"
      : "";
  }
}

function initSearch() {
  if (initialized.search) return;
  initialized.search = true;
  searchInput?.addEventListener("input", (e) => runSearch(e.target.value));
}

function setupModal(dialogId, closeBtnId, openTriggers) {
  const dialog = document.getElementById(dialogId);
  if (!dialog) return;

  const close = () => dialog.close();
  document.getElementById(closeBtnId)?.addEventListener("click", close);
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) close();
  });

  openTriggers.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        if (typeof dialog.showModal === "function") dialog.showModal();
      });
    });
  });
}

function initModals() {
  if (initialized.modals) return;
  initialized.modals = true;
  setupModal("authorModal", "authorModalClose", ["#meetAuthorBtn"]);
  setupModal("contactModal", "modalClose", ['a[href="#contact"]', "#footerContact"]);
}

function initSubscribe() {
  if (initialized.subscribe) return;
  initialized.subscribe = true;

  document.getElementById("subscribeForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = document.getElementById("formMsg");
    const inner = document.querySelector(".subscribe-inner");
    const email = e.target.querySelector("input[type=email]")?.value || "";
    const template = inner?.dataset.successMsg || "Thanks for subscribing!";
    if (msg) {
      msg.textContent = template.replace("{email}", email);
      msg.className = "form-msg success";
    }
    showToast("Subscription saved for this demo.");
    e.target.reset();
  });
}

function initApp() {
  initShell();
  initScrollReveal();
  initActiveNav();
  initCountdowns();
  initPlaceholderLinks();
  initTabs();
  initSearch();
  initModals();
  initSubscribe();
}

window.initApp = initApp;
