# Campus Prep — Design System & UI Specification (`DESIGN.md`)

## 1. Overview & Brand Identity
**Campus Prep** is a centralized, high-utility engineering college platform providing crowdsourced notes, solved university PYQs, syllabus mappings, and AI-powered revision tools.

* **Aesthetic Direction:** Dark Cosmic / Modern Glassmorphism (inspired by Vercel, Linear, and Perplexity UI).
* **Target Audience:** Engineering students across branches (Comps, AI/ML, AI/DS, IT, EXTC, Mech, Auto).
* **Core Visual Themes:** Deep void backgrounds, glowing ambient spotlights, sharp 1px violet/slate borders, crisp high-contrast text, and vibrant status accents.

---

## 2. Color Tokens & Surface Gradients

### Base Surface Gradients & Backgrounds
* **Root Canvas Gradient:**
  `linear-gradient(135deg, rgb(11, 8, 20) 0%, rgb(21, 13, 42) 50%, rgb(13, 9, 24) 100%)`
* **Header Bar (Glassmorphic Sticky):**
  `background-color: rgba(13, 9, 24, 0.85); backdrop-filter: blur(12px); border-color: rgba(139, 92, 246, 0.2);`
* **Primary Container Cards / Vault Preview:**
  `background: rgba(18, 12, 34, 0.85); border-color: rgba(139, 92, 246, 0.25); box-shadow: rgba(0, 0, 0, 0.5) 0px 20px 40px;`
* **Nested Item Cards / Note Rows:**
  `background: rgba(28, 19, 52, 0.6); border-color: rgba(139, 92, 246, 0.2);`
* **Feature Cards / Stats Panels:**
  `background: rgba(20, 13, 38, 0.85); border-color: rgba(139, 92, 246, 0.25);`

### Interactive Button & Active Pill Gradients
* **Active Department Pill:**
  `background: linear-gradient(135deg, rgba(79, 70, 229, 0.3) 0%, rgba(124, 58, 237, 0.4) 100%); border-color: rgb(139, 92, 246); color: rgb(196, 181, 253);`
* **Inactive Department Pill:**
  `bg-white/5 hover:bg-white/10 border border-slate-800 text-slate-400 hover:text-slate-200`
* **Primary CTA Gradient:**
  `bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-500/25`
* **Secondary Glass Button:**
  `background-color: rgba(25, 17, 45, 0.85); border-color: rgba(168, 85, 247, 0.35); color: rgb(226, 232, 240);`

### Text & Gradient Typography
* **Primary Heading Text:** `rgb(255, 255, 255)` (`#ffffff`)
* **Hero Gradient Highlight:** `bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent`
* **Body / Subtitles:** `rgb(203, 213, 225)` (`#cbd5e1`)
* **Muted / Metadata Labels:** `rgb(148, 163, 184)` (`#94a3b8`)

---

## 3. Typography & Badges

### Font Families
1. **Headings & Displays:** `Space Grotesk`, `sans-serif`
2. **Body & Controls:** `Inter`, `sans-serif`
3. **Monospace & Badges:** `JetBrains Mono`, `monospace`

### Badge Design Tokens
* **"ENGG PORTAL" Header Tag:** `px-2 py-0.5 rounded bg-indigo-50/10 text-indigo-400 border border-indigo-500/30 font-mono text-[11px] tracking-wider uppercase`
* **"Approved by Admin" Badge:** `px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-[11px] font-semibold flex items-center gap-1`
* **"Faculty Verified" Badge:** `px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30 font-mono text-[11px] font-semibold`

---

## 4. Glowing Ambient Backdrop Effects

* **Hero Top Central Glow:**
  `<div class="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-br from-indigo-500/15 via-purple-500/15 to-transparent blur-[120px] rounded-full"></div>`
* **Right Accent Glow:**
  `<div class="pointer-events-none absolute top-96 right-10 w-[420px] h-[300px] bg-violet-400/15 blur-[100px] rounded-full"></div>`

---

## 5. Page Layout Architecture & Components

```
[ Fixed Glassmorphic Header Navigation ]
  ├── Logo + Branch Tag (COMPS • Sem 7)
  ├── Route Nav Links (Landing, Vault, AI, Admin)
  └── Search Bar (⌘K) + Notification Bell + User Profile Avatar
│
[ Hero Section ]
  ├── Curriculum Pill Badge ("Built for Mumbai & Pune University Curriculums")
  ├── Headline with Indigo-Violet Gradient Highlight
  ├── Subtitle & Dual CTA Buttons ("Explore Dashboard", "Upload Notes")
  └── 4-Column Social Proof Stat Grid (14.2k+ Notes, 7 Branches, 48k+ Students, 99.4% Pass Rate)
│
[ Department Selector Pills ]
  └── Scrollable Pill Bar: [COMPS] [AI/ML] [AI&DS] [IT] [EXTC] [MECH] [AUTO]
│
[ Interactive Vault Live Preview ]
  ├── Header: "Trending in COMPS • Semester 7"
  └── Stacked Material Rows (PDF Title, Author, Star Rating, Download Count, Quick View & Download CTA)
│
[ Precision Engineering Suite (3-Column Feature Cards) ]
  ├── 1. Dynamic Branch & Sem Filtering Schema
  ├── 2. Faculty & Admin Moderation Pipeline
  └── 3. Integrated AI Revision Assistant ("Synapse Engine v2")
│
[ Peer Recognition & Contributor Banner ]
  └── Overlapping Avatar Stack + "Become a Contributor" Callout
│
[ Sub-Footer & Main Footer ]
  ├── Directory Columns: Academic Streams, Schemas, Community, Engineering Disclaimer
  └── Copyright Notice + Version Tag (v3.4.0-PROD)
```

---

## 6. Icon Mapping Reference (Material Symbols $\rightarrow$ Lucide React)

| Mock Material Symbol | Lucide React Icon Equivalent |
| :--- | :--- |
| `search` | `<Search className="w-4 h-4" />` |
| `notifications` | `<Bell className="w-4 h-4" />` |
| `bolt` | `<Zap className="w-4 h-4 text-indigo-400" />` |
| `menu_book` | `<BookOpen className="w-6 h-6 text-indigo-400" />` |
| `quiz` | `<FileQuestion className="w-6 h-6 text-violet-400" />` |
| `functions` | `<Binary className="w-6 h-6 text-indigo-400" />` |
| `verified_user` | `<ShieldCheck className="w-7 h-7 text-violet-400" />` |
| `auto_awesome` | `<Sparkles className="w-7 h-7 text-purple-400" />` |
| `download` | `<Download className="w-4 h-4" />` |
| `cloud_upload` | `<Upload className="w-4 h-4" />` |