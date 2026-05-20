/* Photo gallery - images from site-data.js only */

let galleryItems = [];
let activeGalleryIndex = 0;
let lightboxInitialized = false;

function escapeGallery(str) {
  const d = document.createElement("div");
  d.textContent = str ?? "";
  return d.innerHTML;
}

function getGalleryItems() {
  const images = SITE_DATA?.gallery?.images;
  if (!images?.length) return [];
  return images
    .filter((img) => img.src)
    .map((img, i) => ({
      id: `img-${i}`,
      src: img.src,
      caption: img.caption || "",
    }));
}

function renderGalleryCard(item, index) {
  const cap = item.caption ? `<figcaption>${escapeGallery(item.caption)}</figcaption>` : "";
  return `
    <figure class="gallery-item reveal" data-id="${escapeGallery(item.id)}">
      <button type="button" class="gallery-thumb" data-gallery-index="${index}" aria-label="Open ${escapeGallery(item.caption || "batch photo")}">
        <img src="${escapeGallery(item.src)}" alt="${escapeGallery(item.caption || "Batch photo")}" loading="lazy" />
      </button>
      ${cap}
    </figure>`;
}

function updateLightbox() {
  const item = galleryItems[activeGalleryIndex];
  const lb = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");
  const cap = document.getElementById("lightboxCaption");
  const prev = document.getElementById("lightboxPrev");
  const next = document.getElementById("lightboxNext");
  if (!lb || !img || !item) return;

  img.src = item.src;
  img.alt = item.caption || "Gallery photo";
  if (cap) {
    cap.textContent = item.caption || "";
    cap.classList.toggle("hidden", !item.caption);
  }

  const multiple = galleryItems.length > 1;
  prev?.classList.toggle("hidden", !multiple);
  next?.classList.toggle("hidden", !multiple);
}

function openLightbox(index) {
  const lb = document.getElementById("lightbox");
  if (!lb || galleryItems.length === 0) return;
  activeGalleryIndex = index;
  updateLightbox();
  if (typeof lb.showModal === "function") lb.showModal();
}

function moveLightbox(direction) {
  if (galleryItems.length < 2) return;
  activeGalleryIndex = (activeGalleryIndex + direction + galleryItems.length) % galleryItems.length;
  updateLightbox();
}

function refreshGallery() {
  const grid = document.getElementById("galleryGrid");
  const empty = document.getElementById("galleryEmpty");
  if (!grid) return;

  galleryItems = getGalleryItems();

  if (galleryItems.length === 0) {
    grid.innerHTML = "";
    empty?.classList.remove("hidden");
  } else {
    empty?.classList.add("hidden");
    grid.innerHTML = galleryItems.map(renderGalleryCard).join("");
    grid.querySelectorAll(".gallery-thumb").forEach((btn) => {
      btn.addEventListener("click", () => openLightbox(Number(btn.dataset.galleryIndex || 0)));
    });
    if (typeof window.initScrollReveal === "function") window.initScrollReveal();
  }

  const countEl = document.getElementById("galleryCount");
  if (countEl) {
    countEl.textContent = `${galleryItems.length} photo${galleryItems.length === 1 ? "" : "s"}`;
  }
}

function initLightbox() {
  if (lightboxInitialized) return;
  lightboxInitialized = true;

  const lb = document.getElementById("lightbox");
  document.getElementById("lightboxClose")?.addEventListener("click", () => lb?.close());
  document.getElementById("lightboxPrev")?.addEventListener("click", () => moveLightbox(-1));
  document.getElementById("lightboxNext")?.addEventListener("click", () => moveLightbox(1));

  lb?.addEventListener("click", (e) => {
    if (e.target === lb) lb.close();
  });

  document.addEventListener("keydown", (e) => {
    if (!lb?.open) return;
    if (e.key === "ArrowLeft") moveLightbox(-1);
    if (e.key === "ArrowRight") moveLightbox(1);
    if (e.key === "Escape") lb.close();
  });
}

function initGallery() {
  initLightbox();
  refreshGallery();
}

window.initGallery = initGallery;
