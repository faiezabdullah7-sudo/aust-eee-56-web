/**
 * ═══════════════════════════════════════════════════════════════
 *  AUST EEE '56 — EDIT THIS FILE ONLY to update the website
 * ═══════════════════════════════════════════════════════════════
 *
 *  HOW TO UPDATE:
 *  1. Open this file in any text editor (Notepad, VS Code, Cursor).
 *  2. Change the text or links below.
 *  3. Save the file.
 *  4. Refresh your browser (Ctrl+F5).
 *
 *  LINKS: Paste full URLs like "https://drive.google.com/..."
 *  Leave as "" (empty quotes) if you don't have a link yet.
 *
 *  DATES for countdown: use format "2026-06-15T09:00:00"
 *  (year-month-day T hour:minute:second)
 *
 *  BANNER IMAGE: put a file in images/ folder, e.g. images/banner.jpg
 *  GALLERY: put photos in images/gallery/ folder, then list them in gallery.images
 *  MEMBERS: edit all 150 student cards in students-data.js
 */

const SITE_DATA = {
  // ── Basic info ──────────────────────────────────────────────
  site: {
    title: "AUST EEE '56",
    batchLabel: "56",           // shows in logo: EEE '56
    semester: "1.1",            // e.g. 2.1, 3.1
    logoSrc: "images/aust-logo.svg",
    logoAlt: "Ahsanullah University of Science and Technology logo",
    heroBadge: "Department of Electrical & Electronic Engineering",
    heroLine1: "Ahsanullah University",
    heroLine2: "EEE Batch '56",
    heroSubtitle:
      "Your batch hub for routines, study materials, exam sections, notices, and quick links.",
  },

  // ── Top banner (AUST EEE) ───────────────────────────────────
  // image: path like "images/banner.jpg" or full URL. Leave "" for default SVG.
  banner: {
    image: "images/banner.svg",
    title: "AUST — Department of EEE",
    subtitle: "Electrical & Electronic Engineering · Batch '56",
    tagline: "Excellence in Engineering Education",
  },

  // ── Photo gallery (shared — put files in images/gallery/) ───
  gallery: {
    title: "Batch Gallery",
    description: "Add photos in images/gallery/ and list them below in images[].",
    images: [
      // { src: "images/gallery/orientation-day.jpg", caption: "Orientation Day 2025" },
      // { src: "images/gallery/department.jpg", caption: "EEE Building" },
    ],
  },

  // ── Countdown timers ────────────────────────────────────────
  countdowns: [
    {
      icon: "📚",
      title: "Final Exam",
      date: "0000-00-00:00", // ← change this date
    },
    {
      icon: "🌴",
      title: "Semester Break",
      date: "00:00:00", // ← change this date
    },
  ],

  // ── Quick access cards (home page grid) ─────────────────────
  // href: full URL, or "#materials" / "#notices" for same-page sections
  quickLinks: [
    { icon: "📁", title: "1.1 Study Materials", desc: "Slides, sheets & drives", href: "#materials" },
    { icon: "📝", title: "Mid & Final Prep", desc: "Section-wise papers", href: "#exams" },
    { icon: "🏛️", title: "AUST EEE Dept", desc: "Official site", href: "https://aust.edu/eee", external: true },
    { icon: "📋", title: "OBE Syllabus", desc: "Official curriculum", href: "https://aust.edu/eee/syllabus", external: true },
    { icon: "🧪", title: "EEE Labs", desc: "Lab info & manuals", href: "https://aust.edu/eee/lab_info", external: true },
    { icon: "👩‍🏫", title: "Faculty", desc: "EEE teachers & staff", href: "https://aust.edu/eee/faculty_members", external: true },
    { icon: "🎓", title: "AUST Home", desc: "University website", href: "https://aust.edu/", external: true },
    { icon: "🔐", title: "IUMS", desc: "Student portal", href: "https://iums.aust.edu/ums-web/login/", external: true },
    { icon: "🚌", title: "BUS Route", desc: "Campus transport", href: "" },
    { icon: "📢", title: "Notices", desc: "Latest updates", href: "#notices" },
    { icon: "📷", title: "Gallery", desc: "Batch photos", href: "#gallery" },
    { icon: "👥", title: "Our Family", desc: "150 student cards", href: "#members" },
  ],

  // ── Study materials (Google Drive links) ─────────────────────
  materials: {
    description: "Batch drives stay here; official EEE syllabus, labs, routine, and notices are linked below.",
    midTermDrive: "",   // e.g. "https://drive.google.com/drive/folders/..."
    finalTermDrive: "",
    sections: {
      A: "",  // Section A drive or folder
      B: "",
      C: "",
    },
  },

  // ── Class routine ─────────────────────────────────────────────
  routine: {
    semesterLabel: "Fall 2025",
    placeholderText: "Open the official undergraduate class routine from the AUST EEE department.",
    routineLink: "https://aust.edu/eee/undergraduate_class_routine",
    routineButtonText: "Open Official Routine",
    calendarLink: "https://aust.edu/academic_calendar",
    calendarLabel: "AUST Academic Calendar",
  },

  // ── Exams by section ──────────────────────────────────────────
  // Add or remove links inside each section as needed
  examSections: [
    {
      name: "Section A",
      links: [
        { label: "Mid-term Q&A", url: "" },
        { label: "Final suggestions", url: "" },
        { label: "Quiz archive", url: "" },
      ],
    },
    {
      name: "Section B",
      links: [
        { label: "Mid-term Q&A", url: "" },
        { label: "Final suggestions", url: "" },
        { label: "Quiz archive", url: "" },
      ],
    },
    {
      name: "Section C",
      links: [
        { label: "Mid-term Q&A", url: "" },
        { label: "Final suggestions", url: "" },
        { label: "Quiz archive", url: "" },
      ],
    },
  ],

  // ── Notices (newest first) ────────────────────────────────────
  notices: [
    {
      date: "20 May 2026",
      title: "CR & GM meeting — all sections",
      body: "Class representatives meet Friday 4 PM, EEE building room 501.",
    },
    {
      date: "18 May 2026",
      title: "Mid-term exam schedule posted",
      body: "Check your section folder for room and seat plans.",
    },
    {
      date: "12 May 2026",
      title: "Waiver / scholarship window open",
      body: "Submit forms to the department office by 28 May.",
    },
    {
      date: "05 May 2026",
      title: "Lab safety orientation — mandatory",
      body: "All students must attend one session this week.",
    },
  ],

  // ── Resources table ───────────────────────────────────────────
  resources: [
    {
      subject: "AUST EEE",
      topic: "Department home, program details, news, activities",
      date: "18-May-2026",
      linkText: "Open",
      url: "https://aust.edu/eee",
      external: true,
    },
    {
      subject: "OBE Syllabus",
      topic: "Outcome-based EEE curriculum",
      date: "15-May-2026",
      linkText: "Open",
      url: "https://aust.edu/eee/syllabus",
      external: true,
    },
    {
      subject: "Official Routine",
      topic: "Undergraduate class routine",
      date: "15-May-2026",
      linkText: "Open",
      url: "https://aust.edu/eee/undergraduate_class_routine",
      external: true,
    },
    {
      subject: "EEE Notices",
      topic: "Department notices and exam notifications",
      date: "12-May-2026",
      linkText: "Open",
      url: "https://aust.edu/eee/notice",
      external: true,
    },
    {
      subject: "EEE News",
      topic: "Department news and updates",
      date: "12-May-2026",
      linkText: "Open",
      url: "https://aust.edu/eee/news",
      external: true,
    },
    {
      subject: "Faculty",
      topic: "Faculty members and staff",
      date: "10-May-2026",
      linkText: "Open",
      url: "https://aust.edu/eee/faculty_members",
      external: true,
    },
    {
      subject: "Lab Info",
      topic: "EEE laboratories and safety information",
      date: "10-May-2026",
      linkText: "Open",
      url: "https://aust.edu/eee/lab_info",
      external: true,
    },
    {
      subject: "Lab Manuals",
      topic: "Official EEE lab manuals",
      date: "10-May-2026",
      linkText: "Open",
      url: "https://aust.edu/eee/lab_manuals",
      external: true,
    },
    {
      subject: "Admission",
      topic: "AUST admission portal",
      date: "01-May-2026",
      linkText: "Open",
      url: "https://admission.aust.edu/",
      external: true,
    },
    {
      subject: "IUMS",
      topic: "Student information portal",
      date: "01-May-2026",
      linkText: "Login",
      url: "https://iums.aust.edu/ums-web/login/",
      external: true,
    },
    {
      subject: "Webmail",
      topic: "AUST email",
      date: "01-May-2026",
      linkText: "Open",
      url: "https://mail.google.com/a/aust.edu",
      external: true,
    },
    {
      subject: "Alumni",
      topic: "AUST alumni page",
      date: "01-May-2026",
      linkText: "Open",
      url: "https://aust.edu/alumni",
      external: true,
    },
  ],

  // ── Members section (student cards in students-data.js) ─────
  members: {
    title: "Our Family",
    description: "EEE Batch '56 — all students. Edit each person in students-data.js (150 cards).",
  },

  // ── Meet Author popup ─────────────────────────────────────────
  author: {
    name: "Faiez Abdullah",
    department: "AUST EEE '56",
    role: "Website Developer",
    bio: "Built this batch portal for Electrical & Electronic Engineering, Batch 56.",
    initials: "FA",
  },

  // ── Contact modal (Contact button in menu) ────────────────────
  contact: {
    modalSubtitle: "Batch '56 web maintainers",
    name: "Your CR / Web Team",
    department: "AUST EEE '56",
    email: "info@aust.edu",
    emailNote: "(department)",
    facebook: "",              // batch Facebook group URL
    facebookLabel: "Batch Facebook Group",
  },

  // ── Email subscribe section ───────────────────────────────────
  subscribe: {
    title: "Stay in the loop",
    description: "Get notices by email when your batch admins connect a mailing list.",
    placeholder: "your.email@aust.edu",
    successMessage: "Thanks! We'll add {email} when the mailing list is live.",
  },

};
