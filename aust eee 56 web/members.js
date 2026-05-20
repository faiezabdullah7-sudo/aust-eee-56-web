/* Batch members grid — data from students-data.js */

const SECTION_COLORS = {
  A: "#2f9fff",
  B: "#15c777",
  C: "#d27528",
};

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s ?? "";
  return d.innerHTML;
}

function initials(name, roll) {
  const n = (name || "").trim();
  if (n.length >= 2) {
    const parts = n.split(/\s+/);
    return parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : n.slice(0, 2).toUpperCase();
  }
  return (roll || "??").replace(/[^A-Z0-9]/gi, "").slice(-2).toUpperCase() || "??";
}

function renderStudentCard(s) {
  const name = (s.name || "").trim() || "Add name in students-data.js";
  const section = (s.section || "?").toUpperCase();
  const color = SECTION_COLORS[section] || "#3b9eff";
  const ini = initials(s.name, s.roll);
  const roleBadge = s.role
    ? `<span class="member-role">${esc(s.role)}</span>`
    : "";

  const photoBlock = s.photo
    ? `<img class="member-photo" src="${esc(s.photo)}" alt="${esc(name)}" loading="lazy" />`
    : `<span class="member-initials" style="--sec-color:${color}">${esc(ini)}</span>`;

  const phone = s.phone
    ? `<a href="tel:${esc(s.phone)}">${esc(s.phone)}</a>`
    : `<span class="muted">—</span>`;
  const email = s.email
    ? `<a href="mailto:${esc(s.email)}">${esc(s.email)}</a>`
    : `<span class="muted">—</span>`;
  const blood = s.blood ? esc(s.blood) : "—";
  const fb = s.facebook
    ? `<a href="${esc(s.facebook)}" target="_blank" rel="noopener">Profile</a>`
    : `<span class="muted">—</span>`;

  const searchText = [s.roll, s.name, s.section, s.phone, s.email, s.role, s.blood]
    .filter(Boolean)
    .join(" ");

  return `
    <article class="member-card reveal" data-section="${esc(section)}" data-searchable="${esc(searchText)}">
      <div class="member-card-top" style="--sec-color:${color}">
        ${photoBlock}
        <span class="member-section">Sec ${esc(section)}</span>
        ${roleBadge}
      </div>
      <div class="member-card-body">
        <h3 class="member-name">${esc(name)}</h3>
        <p class="member-roll">${esc(s.roll)}</p>
        <dl class="member-details">
          <div><dt>Phone</dt><dd>${phone}</dd></div>
          <div><dt>Email</dt><dd>${email}</dd></div>
          <div><dt>Blood</dt><dd>${blood}</dd></div>
          <div><dt>Facebook</dt><dd>${fb}</dd></div>
        </dl>
      </div>
    </article>`;
}

function getStudents() {
  return Array.isArray(STUDENTS_DATA) ? STUDENTS_DATA : [];
}

function renderMembers(filterSection = "all", query = "") {
  const grid = document.getElementById("membersGrid");
  const empty = document.getElementById("membersEmpty");
  const countEl = document.getElementById("membersCount");
  if (!grid) return;

  const q = query.trim().toLowerCase();
  const students = getStudents().filter((s) => {
    const sec = (s.section || "").toUpperCase();
    if (filterSection !== "all" && sec !== filterSection) return false;
    if (!q) return true;
    const text = [s.roll, s.name, s.section, s.phone, s.email, s.role].join(" ").toLowerCase();
    return text.includes(q);
  });

  if (students.length === 0) {
    grid.innerHTML = "";
    empty?.classList.remove("hidden");
  } else {
    empty?.classList.add("hidden");
    grid.innerHTML = students.map(renderStudentCard).join("");
    if (typeof window.initScrollReveal === "function") {
      window.initScrollReveal();
    }
  }

  if (countEl) {
    countEl.textContent = `Showing ${students.length} of ${getStudents().length} students`;
  }
}

function initMembers() {
  const search = document.getElementById("memberSearch");
  const tabs = document.querySelectorAll(".member-filter");

  let section = "all";
  let query = "";

  const update = () => renderMembers(section, query);

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      section = tab.dataset.section || "all";
      update();
    });
  });

  search?.addEventListener("input", (e) => {
    query = e.target.value;
    update();
  });

  update();
}

window.initMembers = initMembers;
