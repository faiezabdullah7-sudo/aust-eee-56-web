/* Builds the page from SITE_DATA in site-data.js */

function hasLink(url) {
  return typeof url === "string" && url.trim() !== "" && url.trim() !== "#";
}

function escapeHtml(str) {
  const el = document.createElement("div");
  el.textContent = str ?? "";
  return el.innerHTML;
}

function linkAttrs(external) {
  return external ? ' target="_blank" rel="noopener"' : "";
}

function makeLink(url, text, external = false) {
  if (!hasLink(url)) {
    return `<a href="#" data-placeholder data-placeholder-label="${escapeHtml(text)}">${escapeHtml(text)}</a>`;
  }
  return `<a href="${escapeHtml(url.trim())}"${linkAttrs(external)}>${escapeHtml(text)}</a>`;
}

function setButtonLink(el, url, label) {
  el.textContent = hasLink(url) ? label : "Coming soon";
  if (hasLink(url)) {
    el.href = url.trim();
    el.removeAttribute("data-placeholder");
    el.removeAttribute("data-placeholder-label");
  } else {
    el.href = "#";
    el.setAttribute("data-placeholder", "");
    el.setAttribute("data-placeholder-label", label);
  }
}

function renderLogo(site) {
  const src = site.logoSrc || "images/aust-logo.svg";
  const alt = site.logoAlt || "AUST logo";
  document.querySelectorAll(".logo-mark, .hero-logo").forEach((img) => {
    img.src = src;
    img.alt = alt;
  });
  const favicon = document.getElementById("siteFavicon");
  if (favicon) favicon.href = src;
}

function renderSite() {
  const d = SITE_DATA;
  if (!d) return;

  document.title = d.site.title;
  renderLogo(d.site);
  document.querySelector(".logo-text").innerHTML =
    `AUST <strong>EEE</strong> '${escapeHtml(d.site.batchLabel)}'`;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = `${d.site.title} - study materials, routine, notices.`;

  document.querySelector(".hero-badge").textContent = d.site.heroBadge;
  const lines = document.querySelectorAll(".hero-title .line");
  if (lines[0]) lines[0].textContent = d.site.heroLine1;
  if (lines[1]) lines[1].textContent = d.site.heroLine2;
  document.querySelector(".hero-sub").textContent = d.site.heroSubtitle;

  renderBanner(d.banner);
  renderCountdowns(d.countdowns);
  renderQuickLinks(d.quickLinks);
  renderMaterials(d.materials);
  renderRoutine(d.routine);
  renderExams(d.examSections);
  renderNotices(d.notices);
  renderResources(d.resources);
  renderMembersSection(d.members);
  renderContact(d.contact);
  renderAuthor(d.author);
  renderSubscribe(d.subscribe);

  renderGallerySection(d.gallery);

  if (typeof window.initApp === "function") window.initApp();
  if (typeof window.initGallery === "function") window.initGallery();
  if (typeof window.initMembers === "function") window.initMembers();
}

function renderBanner(b) {
  const section = document.getElementById("deptBanner");
  if (!section || !b) return;

  const bg = section.querySelector(".banner-bg");
  const title = section.querySelector(".banner-title");
  const subtitle = section.querySelector(".banner-subtitle");
  const tagline = section.querySelector(".banner-tagline");

  if (title) title.textContent = b.title || "AUST — Department of EEE";
  if (subtitle) subtitle.textContent = b.subtitle || "";
  if (tagline) tagline.textContent = b.tagline || "";

  if (bg) {
    if (hasLink(b.image)) {
      bg.style.backgroundImage = `url("${b.image}")`;
      section.classList.add("has-image");
    } else {
      bg.style.backgroundImage = "linear-gradient(135deg, #0a1628 0%, #0d2847 45%, #061018 100%)";
      section.classList.remove("has-image");
    }
  }
}

function renderGallerySection(g) {
  if (!g) return;
  const title = document.getElementById("galleryTitle");
  const desc = document.getElementById("galleryDesc");

  if (title) title.textContent = g.title || "Batch Gallery";
  if (desc) desc.textContent = g.description || "";
}

function renderCountdowns(items) {
  const grid = document.getElementById("countdownGrid");
  if (!grid) return;
  grid.innerHTML = items
    .map(
      (c, i) => `
    <article class="countdown-card reveal" data-date="${escapeHtml(c.date)}">
      <div class="countdown-icon">${c.icon}</div>
      <h3>${escapeHtml(c.title)}</h3>
      <div class="timer" data-timer="${i}">
        <div class="time-block"><span class="days">00</span><small>Days</small></div>
        <div class="time-block"><span class="hours">00</span><small>Hours</small></div>
        <div class="time-block"><span class="minutes">00</span><small>Min</small></div>
        <div class="time-block"><span class="seconds">00</span><small>Sec</small></div>
      </div>
    </article>`
    )
    .join("");
}

function renderQuickLinks(links) {
  const grid = document.getElementById("quickLinkGrid");
  if (!grid) return;
  grid.innerHTML = links
    .map((l) => {
      const href = hasLink(l.href) ? l.href.trim() : "#";
      const placeholder = hasLink(l.href)
        ? ""
        : ` data-placeholder data-placeholder-label="${escapeHtml(l.title)}"`;
      const ext = l.external ? ' target="_blank" rel="noopener"' : "";
      return `
      <a href="${escapeHtml(href)}" class="link-card reveal"${placeholder}${ext}>
        <span>${l.icon}</span>
        <h3>${escapeHtml(l.title)}</h3>
        <p>${escapeHtml(l.desc)}</p>
      </a>`;
    })
    .join("");
}

function renderMaterials(m) {
  const desc = document.getElementById("materialsDesc");
  if (desc) desc.textContent = m.description;

  const midBtn = document.getElementById("midDriveBtn");
  const finalBtn = document.getElementById("finalDriveBtn");
  if (midBtn) setButtonLink(midBtn, m.midTermDrive, "Open Drive");
  if (finalBtn) setButtonLink(finalBtn, m.finalTermDrive, "Open Drive");

  const grid = document.getElementById("sectionGrid");
  if (!grid) return;
  grid.innerHTML = Object.entries(m.sections)
    .map(([letter, url]) => {
      const href = hasLink(url) ? url.trim() : "#";
      const ph = hasLink(url)
        ? ""
        : ` data-placeholder data-placeholder-label="Section ${escapeHtml(letter)} drive"`;
      return `
      <a href="${escapeHtml(href)}" class="section-card reveal" data-section="${letter}"${ph}>
        <span class="section-letter">${letter}</span>
        <span>Section ${letter}</span>
      </a>`;
    })
    .join("");
}

function renderRoutine(r) {
  const label = document.getElementById("routineSemester");
  if (label) label.textContent = r.semesterLabel;

  const text = document.getElementById("routinePlaceholder");
  if (text) text.textContent = r.placeholderText;

  const btn = document.getElementById("routineBtn");
  if (btn) setButtonLink(btn, r.routineLink, r.routineButtonText);

  const cal = document.getElementById("calendarLink");
  if (cal) {
    const calLabel = cal.querySelector(".cal-label");
    if (calLabel) calLabel.textContent = r.calendarLabel;
    if (hasLink(r.calendarLink)) {
      cal.href = r.calendarLink.trim();
      cal.removeAttribute("data-placeholder");
      cal.removeAttribute("data-placeholder-label");
    } else {
      cal.href = "#";
      cal.setAttribute("data-placeholder", "");
      cal.setAttribute("data-placeholder-label", r.calendarLabel || "Academic calendar");
    }
  }
}

function renderExams(sections) {
  const grid = document.getElementById("examGrid");
  if (!grid) return;
  grid.innerHTML = sections
    .map((sec) => {
      const searchText = `${sec.name} mid final quiz ${sec.links.map((l) => l.label).join(" ")}`;
      const items = sec.links
        .map((l) => `<li>${makeLink(l.url, l.label, l.external)}</li>`)
        .join("");
      return `
      <article class="exam-card reveal" data-searchable="${escapeHtml(searchText)}">
        <h3>${escapeHtml(sec.name)}</h3>
        <ul>${items}</ul>
      </article>`;
    })
    .join("");
}

function renderNotices(notices) {
  const list = document.getElementById("noticeList");
  if (!list) return;
  list.innerHTML = notices
    .map((n) => {
      const search = `${n.title} ${n.body} ${n.date}`;
      return `
      <article class="notice-item reveal" data-searchable="${escapeHtml(search)}">
        <time>${escapeHtml(n.date)}</time>
        <h3>${escapeHtml(n.title)}</h3>
        <p>${escapeHtml(n.body)}</p>
      </article>`;
    })
    .join("");
}

function renderResources(rows) {
  const tbody = document.querySelector("#resourceTable tbody");
  if (!tbody) return;
  tbody.innerHTML = rows
    .map((r) => {
      const search = `${r.subject} ${r.topic} ${r.date}`;
      const action = makeLink(r.url, r.linkText, r.external);
      return `
      <tr data-searchable="${escapeHtml(search)}">
        <td data-label="Subject">${escapeHtml(r.subject)}</td>
        <td data-label="Topic">${escapeHtml(r.topic)}</td>
        <td data-label="Date">${escapeHtml(r.date)}</td>
        <td data-label="Action">${action}</td>
      </tr>`;
    })
    .join("");
}

function renderMembersSection(m) {
  if (!m) return;
  const title = document.getElementById("membersTitle");
  const desc = document.getElementById("membersDesc");
  if (title) title.textContent = m.title || "Our Family";
  if (desc) desc.textContent = m.description || "";
}

function renderAuthor(a) {
  if (!a) return;
  const set = (id, text) => {
    const el = document.getElementById(id);
    if (el && text) el.textContent = text;
  };
  set("authorName", a.name);
  set("authorDept", a.department);
  set("authorRole", a.role);
  set("authorBio", a.bio);
  const avatar = document.getElementById("authorAvatar");
  if (avatar) avatar.textContent = a.initials || a.name?.slice(0, 2).toUpperCase() || "FA";
}

function renderContact(c) {
  const sub = document.getElementById("contactModalSub");
  if (sub) sub.textContent = c.modalSubtitle;

  const list = document.getElementById("contactList");
  if (!list) return;

  const fb = hasLink(c.facebook)
    ? `<a href="${escapeHtml(c.facebook)}" target="_blank" rel="noopener">${escapeHtml(c.facebookLabel)}</a>`
    : `<a href="#" data-placeholder>${escapeHtml(c.facebookLabel || "Add group link")}</a>`;

  list.innerHTML = `
    <div><dt>Name</dt><dd>${escapeHtml(c.name)}</dd></div>
    <div><dt>Department</dt><dd>${escapeHtml(c.department)}</dd></div>
    <div><dt>Email</dt><dd><a href="mailto:${escapeHtml(c.email)}">${escapeHtml(c.email)}</a> ${escapeHtml(c.emailNote || "")}</dd></div>
    <div><dt>Facebook</dt><dd>${fb}</dd></div>`;
}

function renderSubscribe(s) {
  const inner = document.querySelector(".subscribe-inner");
  if (!inner) return;
  const h2 = inner.querySelector("h2");
  const p = inner.querySelector(".subscribe-desc");
  const input = inner.querySelector('input[type="email"]');
  if (h2) h2.textContent = s.title;
  if (p) p.textContent = s.description;
  if (input) input.placeholder = s.placeholder;
  inner.dataset.successMsg = s.successMessage;
}

document.addEventListener("DOMContentLoaded", renderSite);
