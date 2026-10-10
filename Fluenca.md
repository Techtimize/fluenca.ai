# Design System: Fluenca.ai

> Hand this file to **Google Stitch** (or any design agent) as the single source of truth when redesigning Fluenca — marketing, onboarding, and the product dashboard.

---

## 0. Product Overview (What Fluenca Is)

**Fluenca.ai** is an AI-powered **business + marketing intelligence platform**. It researches a company once, builds a verified **Company DNA**, then runs a multi-agent pipeline that turns that truth into insights, plans, and publish-ready content.

### Core promise
Verify the business once. Everything Fluenca creates starts from that truth — not from guesses.

### User journey (product flow)
1. **Signup / Auth** — email, OTP, password recovery  
2. **Onboarding** — company URL, industry, products/services, language  
3. **Company detail + Intake Q&A** — agent crawls the web, drafts questions with cited answers; founder confirms  
4. **Analyzing / DNA generation** — DNA agent synthesizes the Company DNA profile  
5. **Verify DNA** — human review / refine the DNA before unlock  
6. **Dashboard home** — overview of intelligence, scores, next actions  
7. **Work surfaces** (authenticated app):
   - **Company overview** — brand / DNA summary  
   - **Competitor analysis** — AI + manual competitor research  
   - **Trends** — niche / market signals  
   - **Content recommendation** — plan from goals + DNA  
   - **Content / Scripts / Blogs** — generate, preview, manage assets  
   - **Calendar** — schedule  
   - **Controls** — agent mode / content execution settings  
   - **Social** — Instagram, Facebook, LinkedIn profile + media mirrors  
   - **Integrations** — connect Meta / LinkedIn / X  
   - **Profile** — company + user settings  
8. **Public Agents page (`/agents`)** — narrative + interactive “how the agents work” experience (signature hero below)

### Agent system (mental model for UI)
Four mascot agents orbit a **Core Orchestrator**:

| Agent   | Role              | Job in the product                                      |
|---------|-------------------|---------------------------------------------------------|
| Rayyan  | Intake & Crawl    | Research site, draft verified Q&A                       |
| Masrur  | DNA & Strategy    | Lock Company DNA as source of truth                     |
| Talha   | SEO & Topics      | Topical map + keyword intelligence                      |
| Sayyam  | Media & Viral     | Scripts, images, social/media production                |

UI should always communicate: **research → DNA → plan → create → publish**, with agents as the visible system behind the work — not as a dark “AI terminal” aesthetic.

---

## 1. Visual Theme & Atmosphere

**Reading:** B2B SaaS product + marketing for founders and marketing leads. Calm, intelligent, premium — like a well-lit strategy studio, not a neon AI dashboard.

| Dial | Target | Meaning |
|------|--------|---------|
| Density | 4–5 | Daily-app balanced: airy marketing, slightly denser dashboards |
| Variance | 6–7 | Confident asymmetry on marketing; predictable structure in app chrome |
| Motion | 6–7 | Fluid, purposeful (GSAP orbits, Framer scroll reveals) — never noisy |

**Atmosphere words:** soft indigo mist, white paper, glass header, rounded intelligence, agent orbit as living system diagram.

**Background language:** Primary canvas is **Mist Canvas** (`#F7F8FF`) with large soft lavender blobs (`#C7CBFF`, `#E4D4FF`, `#DDE0FF`) blurred at edges. Surfaces float in **Pure White**. Never pure black nights for the main product shell.

---

## 2. Color Palette & Roles

### Brand core (Fluenca indigo system)
Use this indigo family as the **one accent system**. Calibrated — soft fills, restrained gradients. Not neon, not cyberpunk glow.

| Name | Hex | Role |
|------|-----|------|
| **Fluenca Indigo** | `#5452F6` | Primary accent — links, pills, focus, active nav |
| **Deep Indigo** | `#4F46E5` | Gradient start / strong CTA left |
| **Violet Lift** | `#8B5CF6` | Gradient end / CTA right |
| **Signal Blue** | `#3659FF` | Marketing gradient edge (landing only) |
| **Mid Spectrum** | `#4F60FF` | Marketing gradient mid |
| **Accent Violet** | `#8157F7` | Marketing gradient end |

**Primary CTA gradient (buttons):**  
`linear-gradient(95.57deg, #3659FF -37.81%, #4F60FF 45.96%, #8157F7 115.03%)`  
or product shorthand: `from-[#4F46E5] to-[#8B5CF6]`

### Surfaces & neutrals
| Name | Hex | Role |
|------|-----|------|
| **Mist Canvas** | `#F7F8FF` | App / marketing page background |
| **Pure White** | `#FFFFFF` | Cards, sheets, modals |
| **Whisper Lilac** | `#EEF0FF` | Soft chip / hover fill |
| **Soft Sheet** | `#F5F6FF` | Secondary panel fill |
| **Ink Near-Black** | `#1C1C1E` | Primary headlines & body emphasis |
| **Muted Stone** | `#62625F` | Secondary body copy |
| **Quiet Gray** | `#71717A` / neutral-500 | Metadata, captions |
| **Hairline Border** | `#E6E8F5` | Card / section borders |
| **Accent Ring** | `#D9DCF7` | Chip borders, input rings |
| **Lavender Mist** | `#C7CBFF` | Ambient glow blob |
| **Orchid Mist** | `#E4D4FF` | Ambient glow blob |

### Semantic (sparingly)
| Name | Hex | Role |
|------|-----|------|
| Success | `#22C55E` / `#16A34A` | DNA verify complete, connected |
| Danger | `#F43F5E` / `#E11D48` | Errors, destructive |
| Warning | Amber-500 family | Caution only — not brand |

### Agent story accents (decorative only — not primary brand)
Use only on agent chapters / orbit labels, never as global CTA color:
- Masrur — Amber (`#F59E0B` family)  
- Rayyan — Fluenca Indigo  
- Talha — Emerald  
- Sayyam — Violet  

### Banned color behaviors
- No pure `#000000` page backgrounds for product UI  
- No neon outer glows / purple bloom on every button  
- No dark-mode-first marketing for the main brand story  
- No random second accent competing with Fluenca Indigo  

---

## 3. Typography Rules

| Role | Preference | Specs |
|------|------------|-------|
| **Display / headlines** | Plus Jakarta / Google Sans Flex / soft geometric sans (`font-display`) | Medium weight (500–600), tight tracking, large but controlled |
| **Body** | Same family or slightly softer sans (`font-body`) | 15–17px, leading 24–28px, max ~65ch |
| **Mono** | Geist Mono / Google Sans Code | Agent metadata, IDs, “LlmTier.STRONG”, clip labels |
| **Arabic** | Noto Arabic when locale is Arabic | Mirror layout rules still apply |

**Scale cues (marketing):**
- Hero H1: ~34px → 48px → 56px  
- Section H2: ~28px → 36px → 50px  
- Eyebrow pill: 11–13px, medium, indigo text  

**Banned:** Inter as the hero brand face; generic Georgia/Times in product UI; screaming all-caps marketing headers.

---

## 4. Signature Motif — Agents Hero (Orbit Hall)

**This is the preferred hero language for the product revamp.** Stitch should reuse this motif on landing, empty states, onboarding “analyzing”, and marketing moments that explain “how Fluenca thinks.”

### Composition
1. **Eyebrow pill** — white/80, border `#D9DCF7`, text `#5452F6`, tiny spark icon  
2. **Headline** — dark ink; key phrase in indigo→violet gradient text  
3. **One supporting sentence** — `#62625F`, max ~2 lines  
4. **Orbit stage** (centerpiece):
   - Soft concentric rings: dashed / solid / dotted in `#C7CBFF` / `#D9DCF7`  
   - **Core hub** — white circle, Fluenca logo, soft indigo-tinted shadow  
   - **Four agent avatars** on an orbit (GSAP continuous rotation; faces counter-rotate so they stay upright)  
   - Role chips under each avatar (DNA, Intake, SEO, Media)  
5. **Agent switcher bar** — white rounded tray; selecting an agent scrolls to their story  
6. **Controls** — Pause / Resume + Normal / Fast orbit (secondary outline pills)

### Atmosphere rules for this hero
- Background = Mist Canvas + 2–3 large blurred lavender orbs  
- Sticky frosted header (`bg-white/75`, blur) with logo + “Agent Engine” chip  
- Motion: smooth perpetual orbit; Framer fade-up on load; respect `prefers-reduced-motion` (freeze orbit)  
- Feel: **living system diagram**, not a video game HUD  

### How to use across the product revamp
| Surface | How to adapt the orbit motif |
|---------|------------------------------|
| Marketing landing hero | Full orbit + one CTA “Get started” |
| Onboarding “Analyzing” | Smaller orbit; core hub pulses while DNA builds |
| Dashboard empty / first-run | Compact orbit card: “Your agents are ready” |
| Agents page | Full hero + chapter stories (current reference) |
| Content generation loading | Thin orbit or single avatar loop tied to active agent |

---

## 5. Component Stylings

### Buttons
- **Primary:** Pill (`rounded-full`), indigo→violet gradient fill, white label, soft shadow `0 10px 24px -12px rgba(79,70,229,0.8)`. Active: slight scale-down. No neon outer ring.  
- **Secondary:** Pill, white fill, border `#D9DCF7`, text ink; hover `#EEF0FF`.  
- **Ghost / text:** Indigo `#5452F6`, underline on hover only for links.

### Chips / pills
- Soft indigo fill `#EEF0FF`, border `#D9DCF7`, text `#5452F6`, height ~30–34px.

### Cards
- White, border `#E6E8F5`, radius ~24–28px (`rounded-[24px]`–`rounded-[28px]`).  
- Shadow only when elevated: soft indigo-tinted (`rgba(79,70,229,0.12–0.25)`), never harsh gray slabs.  
- Prefer fewer cards; use hairline borders + whitespace in dense dashboards.

### Inputs
- Label above; helper optional; error below in danger red.  
- Focus ring: Fluenca Indigo at ~50% opacity.  
- Fill: white or `#F6F7FE`; border `#E6E8F5`.

### Navigation (app)
- Light sidebar or top chrome on Mist Canvas / white.  
- Active item: indigo text + soft lilac background — not thick neon bars.

### Loaders
- Skeleton blocks matching layout (lilac `#E4E6FB` / `#F4F5FD`).  
- Prefer progress + agent context (“Masrur synthesizing DNA”) over generic spinners.

### Empty states
- Short headline, one sentence, primary CTA. Optionally mini orbit or single agent avatar.

---

## 6. Layout Principles

- **Max width:** ~1440px marketing content; ~1280–1400px dashboard content.  
- **Section rhythm:** Large vertical gaps on marketing (`clamp(3rem, 8vw, 6rem)`); tighter in app.  
- **Marketing sections:** Often white sheets with large top radius overlapping previous section (landing pattern).  
- **Hero:** Agents-style centered orbit is allowed as Fluenca’s signature (exception to generic “no centered hero” rule — this orbit *is* the brand moment). Other marketing heroes may use split/asymmetric layouts.  
- **Feature grids:** Prefer zig-zag agent chapters (media | story alternating) over three equal cards.  
- **Mobile (<768px):** Single column; orbit shrinks (~320px); touch targets ≥44px; no horizontal page scroll.

---

## 7. Motion & Interaction

| Engine | Use |
|--------|-----|
| **GSAP** | Continuous orbit rotation, pause/speed, orchestrated timelines |
| **Framer Motion (`motion`)** | Page enter, scroll `whileInView` fades, progress bars |
| **CSS** | Soft ambient blob drift only if needed |

**Physics feel:** Spring-ish ease `[0.22, 1, 0.36, 1]` for UI; linear only for continuous orbit.  
**Performance:** Animate `transform` + `opacity` only.  
**Reduced motion:** Disable orbit loops; keep static composition.

**Perpetual micro-motion (tasteful):**
- Orbit (hero signature)  
- Soft ping on “live” chips  
- Progress bar fill on agent sim cards  

Avoid: bouncing scroll chevrons, emoji confetti, cursor trails.

---

## 8. Screen Map for Stitch Redesign

Ask Stitch to redesign these as a coherent set (same tokens, same orbit DNA where relevant):

### Marketing / public
1. Landing home (hero can adopt Agents Orbit motif)  
2. How Fluenca Thinks / How it Works  
3. Agents page (reference implementation)  
4. Pricing / FAQ / Waitlist if needed  

### Auth
5. Login, Signup, OTP, Forgot password  

### Onboarding
6. Company detail  
7. Intake questions  
8. Analyzing (orbit loading)  
9. Verify DNA progress + review  

### Product shell
10. Dashboard home  
11. Company overview  
12. Competitors (list + AI/manual results)  
13. Trends  
14. Content recommendation  
15. Content library / generation studio  
16. Scripts + detail  
17. Blogs + detail  
18. Calendar  
19. Controls (agent mode)  
20. Social hub + Instagram / Facebook / LinkedIn profiles  
21. Integrations  
22. Profile  

---

## 9. Copy Voice (for mock screens)

- Clear, founder-friendly, evidence-based.  
- Prefer “Company DNA”, “agents”, “verified”, “plan”, “publish”.  
- **Banned clichés:** Elevate, Unleash, Seamless, Next-Gen, revolutionary, 99.99%.  
- No emoji in UI chrome.  
- Real-feeling company names in mocks (not “Acme” / “Nexus”).

---

## 10. Anti-Patterns (Banned)

- Dark neon “AI cockpit” as the default product skin  
- Inter as primary marketing type  
- Pure black (`#000000`) canvases for main flows  
- Three equal generic feature cards as the only layout trick  
- Outer glow / bloom on every CTA  
- Overlapping text on imagery  
- “Scroll to explore” / bouncing chevrons  
- Fake precision metrics (`99.99%`)  
- Mixing a second unrelated accent (e.g. terracotta + cream editorial) into Fluenca  
- Replacing the indigo brand with generic purple-on-white templates that ignore Fluenca tokens  

---

## 11. Stitch Prompt Starter

Copy/paste when starting a Stitch project:

```text
Redesign Fluenca.ai using DESIGN.md as law.

Product: AI business + marketing intelligence. Flow: onboarding → intake → Company DNA → dashboard → content/social publish. Multi-agent system (Rayyan intake, Masrur DNA, Talha SEO, Sayyam media) around a Core Orchestrator.

Visual: Mist canvas #F7F8FF, white cards, indigo accent #5452F6, CTA gradient #4F46E5 → #8B5CF6, borders #E6E8F5, text #1C1C1E / #62625F.

Signature hero: Agents Orbit Hall — concentric soft rings, white logo hub, four avatar agents orbiting, pause/speed controls, soft lavender ambient blobs. Reuse this motif for landing, analyzing, and empty states.

Motion: calm GSAP orbit + Framer fade-ups. No neon dark UI. No Inter. No emoji. No 3 equal feature cards.
```

---

## 12. Reference Implementation (in repo)

- Agents experience: `app/agents/page.tsx` → `components/agents/AgentsExperience.tsx`  
- Agent content tokens: `components/agents/agents-data.ts`  
- Landing brand patterns: `components/landing/*`  
- Logo: `/public/assets/Logo.svg`  

When Stitch and engineering diverge, **prefer this DESIGN.md + the Agents hero** as the north star for the product revamp.
