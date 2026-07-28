# Antigravity Prompt: Hive Estates UI Revamp

Copy everything below the line into Antigravity as your instruction.

---

## 0. SAFETY & REVERSIBILITY — READ THIS FIRST

Before touching anything, do the following. Do not skip this step.

1. **Do not delete, overwrite, or remove any existing files, components, routes, or styles.** The current UI must remain fully intact and recoverable at all times.
2. Create a new git branch for this work (e.g. `ui-revamp-v2`) and commit the current working state to `main`/`master` first if it isn't already committed, so there is a clean restore point.
3. Do not touch the existing components directly. Instead:
   - Duplicate the existing component/page files (e.g. `index.tsx` → `index.legacy.tsx`) OR build new versions in a parallel folder structure (e.g. `src/components-v2/`, `src/routes-v2/`) so the old and new UI can coexist.
   - Keep all existing routes in `src/routeTree.gen.ts` working exactly as they do today until we explicitly approve switching over.
4. Implement a simple way to toggle between old and new UI — a feature flag, an env variable, or a separate preview route (e.g. `/v2/*` mirroring the existing routes) — so we can compare both live and revert instantly by flipping one flag/branch, with zero risk of losing the current site.
5. Do not change any backend logic, API contracts, data fetching hooks, or admin dashboard functionality — this is a **visual/UX layer revamp only**. Wire the new UI to the exact same data sources the current UI uses.
6. At the end, give a clear summary of: what files were added, what (if anything) was modified in place, and the exact steps to revert to the old UI.

---

## 1. PROJECT CONTEXT

**Product:** Hive Estates — a real estate marketplace website for Belagavi, listing land, apartments, and bungalows for buyers, connecting them with agents/builders and generating inquiries (leads).

**Current stack:** React + Vite + TanStack Router (do not change the stack — this is a UI/design revamp on top of the existing architecture, confirmed via `src/routeTree.gen.ts` and `src/routes`).

**Goal:** Redesign the entire frontend UI (all public pages + admin dashboard) to match the attached reference design's visual language, while keeping every existing page, route, and piece of functionality from the current site. This is a visual and UX overhaul, not a rebuild of features.

**The three non-negotiable qualities of the new design:**
1. **Trustworthy & reliable** — this is where people make large financial decisions. The UI must feel credible, calm, and professional, not flashy or "salesy."
2. **Simple & easy to navigate** — the audience includes non-technical, older, and less tech-savvy users looking for property. Navigation, filters, and forms must be obvious at a glance, with minimal cognitive load.
3. **High-conversion** — every page should have a clear, low-friction path to an inquiry (call, WhatsApp, or contact form). Reduce friction everywhere: fewer clicks to contact, sticky contact options, clear CTAs.

---

## 2. VISUAL DIRECTION (based on the attached reference image)

Take direct inspiration from the attached reference design's structure and *tone*, adapted to Hive Estates' brand and content — do not copy it literally page-for-page, and do not copy any of its placeholder copy.

**What to carry over from the reference:**
- A full-bleed, high-quality hero image/video of a property, with a large, confident, warm headline overlaid (not corporate/stiff copy).
- A pill-shaped, minimal top navigation bar with rounded, high-contrast primary action button (e.g. "Post Property" / "Sign Up").
- A floating, card-style **search/filter module** anchored near the bottom of the hero (property type, price range, locality, bedrooms) with rounded corners and soft shadow — this becomes the site's primary conversion tool, so make it prominent and sticky-feeling.
- Rounded corners throughout (cards, buttons, inputs, images) — soft, approachable, modern geometry rather than sharp corporate edges.
- Generous white space, large legible type, and a light, airy background — avoid clutter.
- Pill-shaped filter tags/badges (City, House, Residential, Apartment style) for quick filtering.

**Adapt (don't copy) for our context:**
- Replace generic "Build Your Future" style copy with Hive Estates-specific, plain-spoken copy about Belagavi real estate, written from the buyer's point of view (what they can do: search, compare, verify, contact) — not marketing fluff.
- Trust badges are critical for us specifically: "100% Hive Verified," "200+ Properties Sold" — give these a distinct, credible visual treatment near the hero (e.g. a subtle horizontal trust bar), not just floating text.

---

## 3. COLOR PALETTE — USE MINIMALLY AND DELIBERATELY

Brand colors (from the Hive Estates logo, attached):
- **Hive Green (primary):** a deep forest green, approx `#2D5016`–`#33691E` range — sample exactly from the logo.
- **Hive Gold/Yellow (accent):** the bee's golden yellow, approx `#F4C430`–`#FBC02D` range — sample exactly from the logo.

**Critical instruction: use these colors sparingly, not as the dominant palette.**
- The base UI should be mostly neutral: white/off-white backgrounds, warm light greys (`#F8F8F6`–`#F3F2EE` range) for section backgrounds, and a dark neutral charcoal (not pure black) for text — this is what will make the site feel calm, premium, and trustworthy, matching the reference image's mostly-neutral palette.
- **Hive Green** should be used only for: the logo, primary navigation accents, and perhaps one primary CTA button style — used with intention, not repeated in every section.
- **Hive Gold** should be used only as a small accent: a highlight underline, a "Verified" badge icon, a hover state, or a small decorative touch — never as a large fill or background.
- Do not tint large surfaces, cards, or backgrounds in green or gold. Do not create a "green-and-gold everywhere" theme — that will undercut the clean, trustworthy, editorial feel we're going for. Think: 90% neutral, 10% brand color, used at moments that matter (trust signals, primary actions).
- Define this as an actual small token system (4–6 named colors: e.g. `hive-green`, `hive-gold`, `ink` (text), `paper` (background), `mist` (section bg), `line` (borders)) and use it consistently rather than ad hoc.

**Typography:**
- Pick one confident, modern sans-serif for headings (slightly tighter tracking, larger scale for hero headlines) and a highly legible sans-serif for body copy — these can be the same family at different weights if it's versatile enough, but the type scale should feel deliberate, not default browser sizing.
- Ensure legibility is prioritized over style for anyone over 40 — comfortable line-height, no thin/light weights for body text, sufficient contrast.

**Motion:** Keep it subtle — soft fade/slide-in on scroll for cards, gentle hover states on buttons/cards. No heavy animation. This audience should never feel like the site is "trying too hard."

---

## 4. SITE STRUCTURE & PAGE-BY-PAGE SPEC

Rebuild the following pages/routes with the new visual system. Preserve all existing functionality (data, forms, filters, admin logic) — only redesign the UI layer. Structure and content below is taken directly from our current frontend audit; use it as the functional spec.

### 4.1 Public Pages

**Home (`/` — `index.tsx`)**
- Hero section: full-bleed property image, headline emphasizing **Belagavi**, trust badges ("100% Hive Verified", "200+ Properties Sold") styled as a clean trust bar, prominent search bar, quick links to popular localities, and two visual category entry cards: "Apartments / Bungalows" and "Land & Plots."
- "Featured Land Listings" and "Featured Apartments & Bungalows" as two separate horizontal carousels/grids, each with clear section headers.
- "Latest Listings" grid — newly added properties.
- "Popular Localities" — a card grid to browse by neighbourhood.
- FAQ accordion — "What does Hive Verified mean?" and similar. Style as a simple, clean expandable list, not a heavy component.
- Every listing card across the site should be a single reusable `PropertyCard` component: image, price, locality, key specs (beds/baths or plot size), a "Hive Verified" badge when applicable, and a clear tap/click target — this consistency is key for trust and simplicity.

**Listing Pages** — shared `<ListingsPage>` component, redesigned once and reused across:
- **Buy (`/buy`):** all properties for sale, supports `?q=locality` search param.
- **Apartments (`/apartments`):** pre-filtered to Apartment/Bungalow.
- **Land (`/land`):** pre-filtered to Land.
- Design: left or top filter panel (type, price range, locality, bedrooms) that's collapsible on mobile, a responsive property grid using `PropertyCard`, and clear empty/loading states. Filters should feel as simple as the reference design's pill-style filters.

**Property Details (`/property/$slug`)**
- Two-column layout: main content left, **sticky sidebar** right (collapses to bottom-fixed bar on mobile).
- Main content:
  - Status/listing-number/Hive Verified/Premium/Featured badges, styled minimally and consistently.
  - Media gallery: large main image + thumbnail strip, lightbox on click.
  - Header: title, locality, property type, price (or "Request Price"/"Request Call" CTA button when price is hidden).
  - Specifications grid — dynamic by category:
    - Homes: Area, Bedrooms, Bathrooms, Parking, Facing, Furnishing, Age, Type.
    - Land: Plot Size, Dimensions, Layout Name, Facing, Electricity, Drainage, Water, Approvals, Survey Number, Road Width.
  - Vastu compliance indicator (simple icon + label).
  - Finance/loan info — approved banks, shown as a clean logo row or small trust module.
  - Description section.
  - Amenities list (homes only) — icon + label grid.
  - Map placeholder.
  - Nearby places — schools, hospitals, shopping, connectivity, grouped clearly.
  - EMI Calculator (homes only) — interactive sliders for Loan Amount, Interest, Tenure, redesigned to feel simple and trustworthy (large readable numbers, no clutter).
  - Tags.
- Sticky sidebar (this is the primary conversion point of the page — treat it with priority):
  - Listing ID, posted by, date.
  - Quick contact buttons: **Call** and **WhatsApp**, large and unmissable.
  - Inquiry form: Name, Phone, Email, Message — short, low-friction, clear submit CTA.

**Informational & Marketing Pages** — redesign with the same clean, minimal visual system, consistent header treatment (simple page hero/title band), and clear CTAs where relevant:
- Post Property (`/post-property`) — form to submit a new listing; make this feel effortless, step-by-step if the form is long.
- Hive Verified (`/hive-verified`) — explain the verification process; this is a trust-building page, give it a clear, confident, editorial layout (icons/steps, not walls of text).
- Contact (`/contact`) — contact info, map, contact form.
- About (`/about`) — company/mission.
- Agents (`/agents`) — agent directory.
- Builders (`/builders`) — builder directory/partners.
- Projects (`/projects`) — new construction/developments showcase.
- Blogs (`/blogs`) — articles/insights, simple card-based blog index.

**Legal Pages** — `/privacy`, `/terms`: simple, readable, text-focused layout, generous line-height, no unnecessary decoration.

### 4.2 Admin Dashboard (`/admin/*`)

Keep this functionally identical; redesign visually to match the new design system but prioritize clarity, density, and speed over "marketing" polish — this is a work tool, not a landing page.
- **Admin Login (`/admin/login`)** — simple, minimal auth screen.
- **Admin Dashboard (`/admin/`)** — landing page after login, likely stats/metrics; use clean cards/charts, neutral palette, tiny brand accents only.
- **Properties Index (`/admin/properties/`)** — data table: search bar, status filters (active/draft/etc.), table columns for Property Name, Price, Type, Status, Added On, with Edit/Delete actions. Prioritize scanability and information density.
- **New Property (`/admin/properties/new`)** and **Edit Property (`/admin/properties/$id/edit`)** — clear, well-grouped multi-section forms.
- **Inquiries Index (`/admin/inquiries/`)** — table/dashboard for leads submitted via contact forms; make lead status and contact info easy to scan and act on quickly.

---

## 5. CONVERSION & TRUST PRINCIPLES TO APPLY EVERYWHERE

- Every property card and every property detail page must make **Call** and **WhatsApp** actions obvious and reachable in one tap/click.
- Trust signals ("Hive Verified," bank approvals, listing counts) should appear consistently in the same visual style sitewide, so users learn to recognize and trust them.
- Keep forms short. Only ask for what's needed at each step.
- Navigation should never be more than 2 levels deep to reach a listing from the homepage.
- Use plain, human language everywhere (buttons say what they do — "Call Now," "Send Inquiry," "View Details" — not vague labels).
- Design for mobile-first: most property searches will happen on phones. Sticky bottom contact bar on mobile property detail pages is a must.

---

## 6. TECHNICAL & QUALITY BAR

- Fully responsive down to small mobile screens.
- Visible keyboard focus states, adequate color contrast (especially given the older/less tech-savvy target audience), and respect reduced-motion preferences.
- Reuse a shared design token system (colors, spacing, radii, shadows, type scale) across all pages rather than one-off styles per page.
- Build a small shared component library first (Button, Badge, Card/PropertyCard, Input, Accordion, Modal/Lightbox, Nav, Footer) before assembling pages, so the whole site is visually consistent.
- Confirm the plan (component list + page list + rollout/toggle mechanism) before generating a large volume of code, so we can course-correct early.

---

## 7. DELIVERABLE

At the end, provide:
1. A short written summary of the design system chosen (colors, type, key components).
2. The list of new/added files and confirmation that no existing files were deleted or broken.
3. Exact instructions for previewing the new UI alongside the old one, and for reverting fully to the old UI if needed.
